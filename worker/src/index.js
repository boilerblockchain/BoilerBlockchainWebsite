/**
 * Boiler Blockchain challenge submissions.
 *
 * Routes:
 *   POST /submit   public; stores one submission in D1.
 *   GET  /admin    HTML dashboard; prompts for the admin token, lists rows.
 *   GET  /list     JSON list of submissions; requires Bearer ADMIN_TOKEN.
 *   GET  /export   CSV of all submissions;   requires Bearer ADMIN_TOKEN.
 *   POST /hide     soft delete: flips `hidden` on one row; Bearer ADMIN_TOKEN.
 *                  Nothing is ever removed from D1 — /export still carries it.
 *
 * Secrets/vars:
 *   ADMIN_TOKEN     (secret)  `wrangler secret put ADMIN_TOKEN`
 *   FLAG_SECRET     (secret)  same value as the instancer's FLAG_SECRET; used to
 *                             verify the per-instance flags it mints.
 *   ALLOWED_ORIGIN  (var)     site origin allowed to POST; "*" while testing.
 */

const MAX_FIELD = 20000; // per-field char cap (exploit paste can be long)
const FIELDS = ['name', 'email', 'challenge', 'onchain', 'links', 'exploit', 'flag', 'writeup'];

// Flags are minted per instance by the instancer and signed with FLAG_SECRET
// (the same secret on both sides), so there is nothing to hardcode here and no
// call between the two services: a flag verifies on its own signature.
//   boiler{<challenge-slug>_<nonce>_<signature>}
const FLAG_PATTERN = /^boiler\{([a-z0-9-]+)_([0-9a-f]{8})_([0-9a-f]{12})_([0-9a-f]{16})\}$/;
// Flags minted before launches were bound to an email. Still accepted, but they
// cannot prove who earned them, so they are marked as such.
const LEGACY_FLAG_PATTERN = /^boiler\{([a-z0-9-]+)_([0-9a-f]{12})_([0-9a-f]{16})\}$/;

// Challenge name as submitted on the site -> instancer slug.
const CHALLENGE_SLUGS = {
  'Multisig Mayhem': 'multisig-mayhem',
  'Flash Crash': 'flash-crash',
  'Double Down Drain': 'double-down-drain',
};

// Every verdict the checker can reach, with the plain-English line the grader
// sees on the dashboard. `credit` is whether it counts as solved.
const FLAG_VERDICTS = {
  valid: {
    credit: true,
    label: 'verified',
    detail: 'Signature checks out and the instance was launched by this same email.',
  },
  valid_legacy: {
    credit: true,
    label: 'verified (pre-binding)',
    detail:
      'Signature checks out, but this flag predates email binding, so it proves a real instance produced it and not who.',
  },
  foreign_instance: {
    credit: true,
    label: 'someone else\u2019s instance',
    detail:
      'Real flag, but minted for a different email. Either they used a friend\u2019s instance or launched under another address. Check the instancer launch log for the owner tag.',
  },
  wrong_challenge: {
    credit: false,
    label: 'wrong challenge',
    detail: 'Real flag, but it belongs to a different challenge than the one submitted.',
  },
  forged: {
    credit: false,
    label: 'bad signature',
    detail:
      'Right shape, wrong signature. This string was never produced by an instance \u2014 it was typed or guessed.',
  },
  malformed: {
    credit: false,
    label: 'not a flag',
    detail: 'Does not match the flag format at all.',
  },
  none: { credit: false, label: '', detail: 'No flag submitted (build task).' },
};

// Legacy static flags (FLAGS_JSON secret), kept so any flag claimed before the
// per-instance switch still validates. Safe to drop once nobody holds one.
function getLegacyFlags(env) {
  try { return JSON.parse(env.FLAGS_JSON || '{}'); } catch { return {}; }
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

/** The instancer's owner tag for an email: HMAC(secret, "owner:<email>")[:8]. */
async function ownerTag(secret, email) {
  return (await hmacHex(secret, `owner:${normalizeEmail(email)}`)).slice(0, 8);
}

/**
 * Decides what a submitted flag actually is. Returns one of the FLAG_VERDICTS
 * keys plus the owner tag the flag carries, so the dashboard can show a reason
 * rather than an unexplained green tick.
 */
async function checkFlag(env, challenge, flag, email) {
  if (!flag) return { verdict: 'none', owner: '' };

  const staticFlag = getLegacyFlags(env)[challenge];
  if (staticFlag && constantTimeEqual(flag, staticFlag)) {
    return { verdict: 'valid_legacy', owner: '' };
  }
  if (!env.FLAG_SECRET) return { verdict: 'malformed', owner: '' };

  const bound = FLAG_PATTERN.exec(flag);
  const legacy = bound ? null : LEGACY_FLAG_PATTERN.exec(flag);
  if (!bound && !legacy) return { verdict: 'malformed', owner: '' };

  const slug = bound ? bound[1] : legacy[1];
  const owner = bound ? bound[2] : '';
  const nonce = bound ? bound[3] : legacy[2];
  const signature = bound ? bound[4] : legacy[3];

  const signedOver = bound ? `${slug}:${owner}:${nonce}` : `${slug}:${nonce}`;
  const expected = (await hmacHex(env.FLAG_SECRET, signedOver)).slice(0, 16);
  if (!constantTimeEqual(signature, expected)) return { verdict: 'forged', owner };

  // Signature is genuine from here on: the remaining questions are whose it is
  // and whether it was pasted into the right challenge.
  if (slug !== CHALLENGE_SLUGS[challenge]) return { verdict: 'wrong_challenge', owner };
  if (!bound) return { verdict: 'valid_legacy', owner: '' };
  if (!constantTimeEqual(owner, await ownerTag(env.FLAG_SECRET, email))) {
    return { verdict: 'foreign_instance', owner };
  }
  return { verdict: 'valid', owner };
}

/**
 * A flag belongs to exactly one launch, so the same correct flag arriving from
 * a second person means it was passed around. Recorded silently: the submitter
 * is not told, the dashboard is.
 */
async function isFlagReused(env, flag, email) {
  const previous = await env.DB.prepare(
    `SELECT email FROM submissions WHERE flag = ? AND flag_correct = 1 LIMIT 1`
  )
    .bind(flag)
    .first();
  if (!previous) return false;
  return normalizeEmail(previous.email) !== normalizeEmail(email);
}

// Live instance URLs (informational, mirrors the site).
const LAUNCH_URL = 'https://ctf.pyras.org';
const INSTANCES = {
  'Multisig Mayhem': LAUNCH_URL,
  'Flash Crash': LAUNCH_URL,
  'Double Down Drain': LAUNCH_URL,
};

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(env) },
  });
}

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD);
}

function authorized(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const header = request.headers.get('Authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '');
  return token.length > 0 && token === env.ADMIN_TOKEN;
}

// Answer key for graders. Served only from /answers behind the admin token —
// never embedded in the public /admin HTML.
const ANSWERS = [
  {
    challenge: 'Level 1 — TipJar',
    win: 'Build task, not an exploit — no flag. Judged on the deployed contract + writeup.',
    vuln:
      'Not an exploit. Common misses: overwriting instead of accumulating per-address totals; using OpenZeppelin v4 Ownable patterns that will not compile on v5; no zero-value require.',
    solution:
      'Verify on Sepolia Etherscan that the contract exists, is verified, tracks per-address totals across repeat deposits, and only the owner can withdraw. Check the writeup explains how they tested it.',
  },
  {
    challenge: 'Multisig Mayhem',
    win: 'Drain the vault (Setup.isSolved: balance == 0). Launch your own instance at https://ctf.pyras.org',
    vuln:
      'submitTransaction() recovers a signer with ecrecover but never checks isOwner[signer], and executionThreshold() returns 1. Any signature from any key you control passes.',
    solution:
      'Compute txHash = keccak256(abi.encodePacked(dest, value, data, nonce, wallet)). Sign it with YOUR own key. Call submitTransaction with dest = your address, value = full balance, and your single (v,r,s). Balance goes to zero.',
    fix:
      'require(isOwner[signer]); enforce required >= advertisedRequiredSignatures (3); dedupe signers (the > ordering check helps but the missing isOwner check is the hole).',
  },
  {
    challenge: 'Flash Crash',
    win: 'Drain the vault (Setup.isSolved: balance == 0). Launch your own instance at https://ctf.pyras.org',
    vuln:
      'The session flag lives in EIP-1153 transient storage, which clears at the END of the transaction, not between calls. emergencyDrain() only checks sessionOpen — no caller auth.',
    solution:
      'In ONE transaction call openSession() then emergencyDrain(). Do it from an attacker contract (or a multicall) so both run in the same tx; sessionOpen is still true when emergencyDrain sends the balance to msg.sender.',
    fix:
      'Do not use a transient flag as authorization. Gate emergencyDrain to the owner / a real flash-loan callback, and clear the session explicitly at the end of the intended flow.',
  },
  {
    challenge: 'Double Down Drain',
    win: 'Drain the vault (Setup.isSolved: balance == 0). Launch your own instance at https://ctf.pyras.org',
    vuln:
      'flashLoan() sets inSession = true then delegatecalls an attacker-supplied module in the vault storage (owner is slot 0). inSession stays true for the rest of the tx, and skim() pays owner.',
    solution:
      'One tx: call flashLoan(module, data) where the module writes owner = attacker (slot 0) via delegatecall. After flashLoan returns, inSession is still true, so call skim() — it pays the new owner (attacker). Verified draining in a Foundry test.',
    fix:
      'Never delegatecall untrusted modules. Use call with explicit value accounting, keep owner immutable / protected, and do not rely on a lingering transient flag to gate skim().',
  },
];

// Internal how-to (organizers only). Kept off the public site on purpose so the
// full recipe can't be pasted into an AI. Served token-gated at /guide.
const GUIDE = `LEVEL 2 — internal how-to / run sheet

Each challenge is a custom vulnerable contract on a live Anvil chain. Students
launch their OWN isolated instance (per-student, concurrent) from the instancer,
solve it, and claim a real flag. Setup.isSolved() is true when the vault is
drained (balance == 0); the gateway then serves the real flag from /claim.

INSTANCER (public):  https://ctf.pyras.org   (https://ctf.jaeger.lol also works)
  - Student opens it, clicks "Launch instance" for a challenge.
  - Gets a private RPC at https://ctf.pyras.org/i/<id>/ + funded player key + addresses.
  - Instances are isolated and auto-expire after 30 min of inactivity (3h hard cap).

HOW A PLAYER SOLVES ONE
  1. Launch an instance -> private RPC URL + player key + contract addresses.
  2. Point Foundry (forge/cast) at the instance RPC URL.
  3. Write the exploit, drive Setup.isSolved() to true (drain the vault).
  4. POST {"address":"<setup>"} to <rpc>/claim -> their flag (boiler{...}).
  5. Submit the flag on the Boiler Blockchain site (auto-checked here).

FLAGS ARE PER INSTANCE
  Every launch mints its own flag, signed with FLAG_SECRET (shared by the
  instancer and this Worker). There is no master flag to leak, and this Worker
  verifies a flag by its signature without ever having seen it.
  A correct flag handed in by a second person is marked "shared" on the
  dashboard, which is how flag-passing shows up. The submitter is not told.

REFERENCE SOLUTIONS: see the answer key (vuln + solution + fix + flag).

HOSTING / OPS (brach)
  Instancer service:  systemctl --user status bb-instancer
  Instancer code:     ~/active/bb-challenges/instancer.py  (stdlib, port 8600)
  Rebuild images:     ~/active/bb-challenges/deploy-brach.sh
  Tunnel:             cloudflared user service -> ctf.pyras.org / ctf.jaeger.lol
  Reset:              automatic. Each launch is a fresh container; idle ones (30m)
                      are reaped. No manual reset needed.
  Rotate flags:       set a new FLAG_SECRET on both sides (instancer env +
                      wrangler secret put FLAG_SECRET). Every older flag stops
                      verifying, so rotate between cohorts, not mid-run.`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    // ---- public submit ----
    if (url.pathname === '/submit' && request.method === 'POST') {
      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: 'invalid JSON' }, 400, env);
      }
      const row = {};
      for (const key of FIELDS) row[key] = clean(data[key]);
      if (!row.name || !row.email || !row.challenge) {
        return json({ error: 'name, email and challenge are required' }, 422, env);
      }
      // Auto-mark: what is this flag, really?
      const { verdict, owner } = await checkFlag(env, row.challenge, row.flag, row.email);
      const flagCorrect = FLAG_VERDICTS[verdict].credit ? 1 : 0;
      const flagReused =
        flagCorrect && (await isFlagReused(env, row.flag, row.email)) ? 1 : 0;
      await env.DB.prepare(
        `INSERT INTO submissions
           (created_at, name, email, challenge, onchain, links, exploit, flag, flag_correct, flag_reused, flag_verdict, flag_owner, writeup, ip, ua)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      )
        .bind(
          new Date().toISOString(),
          row.name,
          row.email,
          row.challenge,
          row.onchain,
          row.links,
          row.exploit,
          row.flag,
          flagCorrect,
          flagReused,
          verdict,
          owner,
          row.writeup,
          request.headers.get('CF-Connecting-IP') || '',
          (request.headers.get('User-Agent') || '').slice(0, 300)
        )
        .run();
      // Tell the student whether their flag was accepted (only when they sent one).
      return json({ ok: true, flag_correct: row.flag ? Boolean(flagCorrect) : null }, 201, env);
    }

    // ---- admin JSON ----
    if (url.pathname === '/list' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      const { results } = await env.DB.prepare(
        `SELECT * FROM submissions ORDER BY created_at DESC LIMIT 1000`
      ).all();
      return json({ submissions: results, verdicts: FLAG_VERDICTS }, 200, env);
    }

    // ---- soft delete (token-gated) ----
    // Hiding is a flag on the row, not a DELETE: the submission stays in D1 and
    // in the CSV export, it just stops cluttering the dashboard. The state is
    // stored server-side so it survives a reload and follows the grader to any
    // other browser.
    if (url.pathname === '/hide' && request.method === 'POST') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: 'invalid JSON' }, 400, env);
      }
      const ids = (Array.isArray(data.ids) ? data.ids : [data.id])
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0);
      if (!ids.length) return json({ error: 'id or ids required' }, 422, env);
      const hidden = data.hidden === false ? 0 : 1;
      const placeholders = ids.map(() => '?').join(',');
      await env.DB.prepare(
        `UPDATE submissions SET hidden = ?, hidden_at = ? WHERE id IN (${placeholders})`
      )
        .bind(hidden, hidden ? new Date().toISOString() : null, ...ids)
        .run();
      return json({ ok: true, ids, hidden: Boolean(hidden) }, 200, env);
    }

    // ---- admin CSV ----
    if (url.pathname === '/export' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      const { results } = await env.DB.prepare(
        `SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5000`
      ).all();
      const cols = ['id', 'created_at', 'name', 'email', 'challenge', 'flag', 'flag_correct', 'flag_reused', 'flag_verdict', 'flag_owner', 'onchain', 'links', 'exploit', 'writeup', 'hidden', 'hidden_at'];
      const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const csv = [cols.join(',')]
        .concat(results.map((r) => cols.map((c) => esc(r[c])).join(',')))
        .join('\n');
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="submissions.csv"',
          ...cors(env),
        },
      });
    }

    // ---- answer key (token-gated) ----
    if (url.pathname === '/answers' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      // No shared flag to reveal any more: every instance mints its own, and the
      // Worker marks them automatically. Graders read the ✓ column, not a flag.
      const answers = ANSWERS.map((a) => ({
        ...a,
        flag: CHALLENGE_SLUGS[a.challenge]
          ? 'per-instance (boiler{slug_nonce_signature}) — auto-verified on submit'
          : undefined,
      }));
      return json({ answers }, 200, env);
    }

    // ---- internal guide (token-gated) ----
    if (url.pathname === '/guide' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      return json({ guide: GUIDE, instances: INSTANCES, verdicts: FLAG_VERDICTS }, 200, env);
    }

    // ---- admin dashboard ----
    if (url.pathname === '/admin' && request.method === 'GET') {
      return new Response(ADMIN_HTML, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return json({ error: 'not found' }, 404, env);
  },
};

const ADMIN_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>BB Challenges — Submissions</title>
<style>
  :root { color-scheme: dark; --bg:#0b0b0f; --panel:#111118; --line:#1e1e28;
          --purple:#C77DFF; --deep:#7120B0; --dim:#8b8b99; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:#eee;
         font-family:ui-sans-serif,system-ui,sans-serif; font-size:15px; }
  header { padding:1rem 1.5rem; border-bottom:1px solid var(--line);
           display:flex; gap:.6rem; align-items:center; flex-wrap:wrap;
           position:sticky; top:0; background:var(--bg); z-index:5; }
  h1 { font-size:1rem; letter-spacing:.14em; text-transform:uppercase; margin:0 .5rem 0 0;
       color:var(--purple); }
  input { padding:.5rem .7rem; background:#16161c; border:1px solid #333;
          color:#fff; border-radius:3px; }
  #token { min-width:220px; }
  #search { min-width:200px; }
  button { padding:.5rem .9rem; background:var(--deep); border:1px solid var(--deep);
           color:#fff; cursor:pointer; border-radius:3px; font-size:.85rem; }
  button:hover { background:#A855F7; }
  button.ghost { background:transparent; border-color:#3a3a46; color:#cfcfda; }
  button.ghost:hover { background:#1b1b24; }
  a { color:var(--purple); }
  .wrap { padding:1.25rem 1.5rem 3rem; max-width:1100px; }
  .count { color:var(--dim); font-size:.85rem; }
  .err { color:#ff6b6b; }
  code { color:#9fe; font-family:ui-monospace,monospace; word-break:break-all; }

  /* summary strip of totals */
  .totals { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:1rem; }
  .stat { background:var(--panel); border:1px solid var(--line); border-radius:4px;
          padding:.5rem .8rem; min-width:104px; }
  .stat b { display:block; font-size:1.3rem; line-height:1.2; }
  .stat span { color:var(--dim); font-size:.7rem; text-transform:uppercase;
               letter-spacing:.1em; }

  /* person row */
  details.person { background:var(--panel); border:1px solid var(--line);
                   border-radius:4px; margin-bottom:.5rem; }
  details.person[open] { border-color:#2e2e3c; }
  summary { cursor:pointer; list-style:none; padding:.7rem .9rem;
            display:flex; align-items:center; gap:.7rem; flex-wrap:wrap; }
  summary::-webkit-details-marker { display:none; }
  summary:hover { background:#15151d; }
  .caret { color:var(--dim); font-size:.7rem; width:.8rem; flex:none;
           transition:transform .12s ease; }
  details[open] > summary .caret { transform:rotate(90deg); }
  .who { font-weight:600; }
  .mail { color:var(--dim); font-size:.85rem; }
  .spacer { flex:1 1 auto; }
  .when { color:#6f6f80; font-size:.75rem; white-space:nowrap; }

  /* chips */
  .chip { font-size:.72rem; padding:.15rem .5rem; border-radius:999px;
          border:1px solid #333; color:#bbb; white-space:nowrap; }
  .chip.ok   { color:#4ade80; border-color:#1d5b34; background:#0e2317; }
  .chip.warn { color:#fbbf24; border-color:#5b471d; background:#241d0e; }
  .chip.bad  { color:#ff6b6b; border-color:#5b1d1d; background:#240e0e; }

  /* submission row inside a person */
  .subs { padding:0 .9rem .7rem 1.9rem; }
  details.sub { border-top:1px solid var(--line); }
  details.sub > summary { padding:.55rem .2rem; font-size:.88rem; }
  .chal { color:var(--purple); }
  .body { padding:.2rem .2rem 1rem; }
  .field { margin:.65rem 0; }
  .lab { display:block; color:var(--dim); text-transform:uppercase;
         letter-spacing:.09em; font-size:.68rem; margin-bottom:.2rem; }
  .val { white-space:pre-wrap; line-height:1.5; font-size:.88rem; }
  pre.val { margin:0; background:#0d0d13; border:1px solid var(--line);
            border-radius:3px; padding:.6rem .7rem; font-size:.8rem;
            overflow-x:auto; max-height:420px; }
  .why { color:#8a8a99; font-size:.8rem; line-height:1.45; margin-top:.2rem; }
  .meta { color:#5f5f70; font-size:.72rem; margin-top:.8rem;
          border-top:1px solid var(--line); padding-top:.5rem; }
  .empty { color:var(--dim); padding:2rem 0; }

  /* soft delete */
  .act { background:transparent; border:1px solid #3a3a46; color:#9b9baa;
         font-size:.7rem; padding:.18rem .5rem; border-radius:3px; cursor:pointer; }
  .act:hover { background:#241014; border-color:#5b1d1d; color:#ff8f8f; }
  .act.restore:hover { background:#0e2317; border-color:#1d5b34; color:#7ef0a6; }
  details.hidden-row > summary { opacity:.45; }
  details.hidden-row { border-left:2px solid #5b1d1d; }
  .toggle-hidden { color:var(--dim); font-size:.78rem; cursor:pointer;
                   user-select:none; display:flex; align-items:center; gap:.35rem; }
  .toggle-hidden input { min-width:0; }

  /* panels */
  #answers, #guide { padding:0 1.5rem 1.5rem; display:none; max-width:1100px; }
  #answers h2, #guide h2 { font-size:.8rem; letter-spacing:.14em; text-transform:uppercase;
                color:var(--purple); border-bottom:1px solid var(--line); padding-bottom:.5rem; }
  .akey { border:1px solid var(--line); background:var(--panel); padding:.8rem 1rem;
          margin-bottom:.8rem; border-radius:4px; }
  .akey .name { color:var(--purple); font-weight:600; margin-bottom:.4rem; }
  .akey .row { font-size:.85rem; line-height:1.5; margin:.25rem 0; }
  .akey .lab { display:inline; margin-right:.4rem; }
  @media (max-width:640px){ .mail { width:100%; } .when { display:none; } }
</style>
</head>
<body>
<header>
  <h1>Submissions</h1>
  <input id="token" type="password" placeholder="admin token" />
  <button onclick="load()">Load</button>
  <input id="search" type="search" placeholder="filter name / email / challenge" oninput="render()" />
  <button class="ghost" onclick="setAll(true)">Expand all</button>
  <button class="ghost" onclick="setAll(false)">Collapse all</button>
  <button class="ghost" onclick="csv()">Export CSV</button>
  <button class="ghost" onclick="toggleAnswers()">Answer key</button>
  <button class="ghost" onclick="toggleGuide()">Guide</button>
  <label class="toggle-hidden"><input type="checkbox" id="showHidden" onchange="onShowHidden()" /> <span id="hiddenCount">show hidden</span></label>
  <span id="msg" class="count"></span>
</header>
<div id="answers"><h2>Answer key</h2><div id="answers-body"></div></div>
<div id="guide"><h2>Internal guide</h2><pre id="guide-body" class="val" style="background:#0d0d13;border:1px solid #1e1e28;padding:1rem;font-size:.82rem"></pre></div>
<div class="wrap">
  <div class="totals" id="totals"></div>
  <div id="people"></div>
</div>
<script>
  // What the checker concluded, in one badge. A green tick is never the whole
  // story, so the reason travels with it into the expanded view.
  const VERDICT_STYLE = {
    valid:            { icon:'✓', cls:'ok'   },
    valid_legacy:     { icon:'✓', cls:'ok'   },
    foreign_instance: { icon:'⚠', cls:'warn' },
    wrong_challenge:  { icon:'✗', cls:'bad'  },
    forged:           { icon:'✗', cls:'bad'  },
    malformed:        { icon:'✗', cls:'bad'  },
    none:             { icon:'·', cls:''     },
  };
  const esc = s => String(s??'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const verdictKey = r => r.flag_verdict || (r.flag ? (r.flag_correct==1?'valid_legacy':'forged') : 'none');
  const isSolved = r => { const k = verdictKey(r); return k==='valid' || k==='valid_legacy'; };
  const when = s => { const d = new Date(s); return isNaN(d) ? esc(s)
      : d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}); };

  function badge(r){
    const key = verdictKey(r);
    const style = VERDICT_STYLE[key] || VERDICT_STYLE.malformed;
    const meta = (window.VERDICTS||{})[key] || {};
    const label = key==='none' ? 'no flag' : (meta.label || key);
    return '<span class="chip '+style.cls+'">'+style.icon+' '+esc(label)+'</span>';
  }

  const tokenEl  = document.getElementById('token');
  const searchEl = document.getElementById('search');
  const showHiddenEl = document.getElementById('showHidden');
  const msg = document.getElementById('msg');
  function headers(){ return { Authorization: 'Bearer ' + tokenEl.value }; }

  // Small bits of UI state that should survive a reload: the token, the filter,
  // whether hidden rows are shown, and which cards were left open.
  function store(key, value){ try { localStorage.setItem('bb_admin_'+key, value); } catch {} }
  function recall(key, fallback){ try { return localStorage.getItem('bb_admin_'+key) ?? fallback; } catch { return fallback; } }
  tokenEl.value  = recall('token', '');
  searchEl.value = recall('search', '');
  showHiddenEl.checked = recall('show_hidden', '') === '1';
  let OPEN = new Set();
  try { OPEN = new Set(JSON.parse(recall('open', '[]'))); } catch {}
  function rememberOpen(){ store('open', JSON.stringify([...OPEN])); }

  let ROWS = [];

  async function load(){
    store('token', tokenEl.value);
    msg.textContent = 'Loading…'; msg.className='count';
    const res = await fetch('/list', { headers: headers() });
    if(!res.ok){ msg.textContent = 'Auth failed ('+res.status+')'; msg.className='err'; return; }
    const { submissions, verdicts } = await res.json();
    window.VERDICTS = verdicts || {};
    ROWS = submissions || [];
    msg.textContent = ''; msg.className='count';
    render();
  }

  // One card per person (keyed on email), newest activity first.
  function group(rows){
    const byPerson = new Map();
    for(const r of rows){
      const key = (r.email||'').trim().toLowerCase() || ('#'+r.id);
      if(!byPerson.has(key)) byPerson.set(key, { email:r.email||'(no email)', name:r.name, subs:[] });
      const person = byPerson.get(key);
      person.subs.push(r);
      if(new Date(r.created_at) > new Date(person.subs[0].created_at)) person.name = r.name;
    }
    const people = [...byPerson.values()];
    for(const p of people){
      p.subs.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
      p.latest    = p.subs[0].created_at;
      p.solved    = new Set(p.subs.filter(isSolved).map(r=>r.challenge)).size;
      p.attempted = new Set(p.subs.map(r=>r.challenge)).size;
      p.shared    = p.subs.filter(r=>r.flag_reused==1).length;
      p.foreign   = p.subs.filter(r=>verdictKey(r)==='foreign_instance').length;
      p.forged    = p.subs.filter(r=>['forged','malformed','wrong_challenge'].includes(verdictKey(r))).length;
    }
    people.sort((a,b)=> b.solved - a.solved || new Date(b.latest) - new Date(a.latest));
    return people;
  }

  function field(lab, val, mono){
    if(!val) return '';
    return '<div class="field"><span class="lab">'+lab+'</span>'
      + (mono ? '<pre class="val">'+esc(val)+'</pre>' : '<div class="val">'+esc(val)+'</div>')
      + '</div>';
  }

  function subCard(r){
    const key = verdictKey(r);
    const meta = (window.VERDICTS||{})[key] || {};
    const warn = [];
    if(r.flag_reused==1) warn.push('<span class="chip warn">⚠ same flag from someone else</span>');
    const hidden = r.hidden==1;
    const action = hidden
      ? '<button class="act restore" onclick="setHidden(event,['+r.id+'],false)">restore</button>'
      : '<button class="act" onclick="setHidden(event,['+r.id+'],true)">hide</button>';
    const openKey = 's'+r.id;
    const head = '<summary><span class="caret">▶</span>'
      + '<span class="chal">'+esc(r.challenge)+'</span>'
      + badge(r) + warn.join('')
      + (hidden ? '<span class="chip">hidden</span>' : '')
      + '<span class="spacer"></span>' + action
      + '<span class="when">'+when(r.created_at)+'</span></summary>';
    const why = meta.detail ? '<div class="why">'+esc(meta.detail)+'</div>' : '';
    const body = '<div class="body">'
      + (key!=='none' || r.flag
          ? '<div class="field"><span class="lab">flag</span><div class="val"><code>'
            + esc(r.flag||'(none)') + '</code></div>' + why
            + (r.flag_owner ? '<div class="why">owner tag <code>'+esc(r.flag_owner)+'</code></div>' : '')
            + '</div>'
          : why)
      + field('on-chain address', r.onchain)
      + field('links', r.links)
      + field('exploit', r.exploit, true)
      + field('writeup', r.writeup, true)
      + '<div class="meta">#'+r.id+' · '+esc(r.created_at)+' · '+esc(r.ip||'')+'<br>'+esc(r.ua||'')+'</div>'
      + '</div>';
    return '<details class="sub'+(hidden?' hidden-row':'')+'" data-key="'+openKey+'"'
      + (OPEN.has(openKey)?' open':'') + '>'+head+body+'</details>';
  }

  function personCard(p){
    const chips = [];
    chips.push('<span class="chip">'+p.subs.length+' submission'+(p.subs.length==1?'':'s')+'</span>');
    if(p.solved)  chips.push('<span class="chip ok">✓ '+p.solved+' solved</span>');
    if(p.foreign) chips.push('<span class="chip warn">⚠ '+p.foreign+' other instance</span>');
    if(p.shared)  chips.push('<span class="chip warn">⚠ '+p.shared+' shared flag</span>');
    if(p.forged)  chips.push('<span class="chip bad">✗ '+p.forged+' bad flag</span>');
    // Hiding a person hides the submissions currently shown for them, so the
    // button does the same thing whether or not hidden rows are on screen.
    const ids = p.subs.filter(r=>r.hidden!=1).map(r=>r.id);
    const action = ids.length
      ? '<button class="act" onclick="setHidden(event,['+ids.join(',')+'],true)">hide all</button>'
      : '<button class="act restore" onclick="setHidden(event,['+p.subs.map(r=>r.id).join(',')+'],false)">restore all</button>';
    const openKey = 'p'+p.email;
    return '<details class="person" data-key="'+esc(openKey)+'"'+(OPEN.has(openKey)?' open':'')+'><summary>'
      + '<span class="caret">▶</span>'
      + '<span class="who">'+esc(p.name || '(no name)')+'</span>'
      + '<span class="mail">'+esc(p.email)+'</span>'
      + chips.join(' ')
      + '<span class="spacer"></span>' + action
      + '<span class="when">'+when(p.latest)+'</span>'
      + '</summary><div class="subs">' + p.subs.map(subCard).join('') + '</div></details>';
  }

  function render(){
    store('search', searchEl.value||'');
    const q = (searchEl.value||'').trim().toLowerCase();
    const showHidden = showHiddenEl.checked;
    let rows = showHidden ? ROWS : ROWS.filter(r => r.hidden!=1);
    if(q) rows = rows.filter(r => [r.name,r.email,r.challenge,r.flag].some(v => String(v||'').toLowerCase().includes(q)));
    const people = group(rows);
    const hiddenTotal = ROWS.filter(r=>r.hidden==1).length;
    document.getElementById('hiddenCount').textContent =
      hiddenTotal ? 'show hidden ('+hiddenTotal+')' : 'show hidden';

    const solved = new Set(rows.filter(isSolved).map(r => (r.email||'').toLowerCase()+'|'+r.challenge)).size;
    const stats = [
      ['people', people.length],
      ['submissions', rows.length],
      ['solves', solved],
      ['flagged', rows.filter(r=>r.flag_reused==1 || verdictKey(r)==='foreign_instance').length],
    ];
    document.getElementById('totals').innerHTML = stats.map(s =>
      '<div class="stat"><b>'+s[1]+'</b><span>'+s[0]+'</span></div>').join('');
    document.getElementById('people').innerHTML = people.length
      ? people.map(personCard).join('')
      : '<div class="empty">' + (ROWS.length ? 'Nothing matches that filter.' : 'No submissions yet.') + '</div>';
  }

  function setAll(open){
    document.querySelectorAll('#people details').forEach(d => {
      d.open = open;
      if(open) OPEN.add(d.dataset.key); else OPEN.delete(d.dataset.key);
    });
    rememberOpen();
  }

  // Which cards are open is part of the state worth keeping: a grader who
  // reloads mid-read lands back where they were.
  document.getElementById('people').addEventListener('toggle', (e) => {
    const key = e.target.dataset && e.target.dataset.key;
    if(!key) return;
    if(e.target.open) OPEN.add(key); else OPEN.delete(key);
    rememberOpen();
  }, true);

  function onShowHidden(){
    store('show_hidden', showHiddenEl.checked ? '1' : '');
    render();
  }

  // Soft delete. The row stays in D1 and in the CSV export; only the dashboard
  // stops showing it. Server-side, so it holds across reloads and browsers.
  async function setHidden(event, ids, hidden){
    event.preventDefault();
    event.stopPropagation();
    const res = await fetch('/hide', {
      method:'POST',
      headers: Object.assign({ 'Content-Type':'application/json' }, headers()),
      body: JSON.stringify({ ids, hidden }),
    });
    if(!res.ok){ msg.textContent = 'Hide failed ('+res.status+')'; msg.className='err'; return; }
    const set = new Set(ids);
    for(const r of ROWS) if(set.has(r.id)) r.hidden = hidden ? 1 : 0;
    msg.textContent = ids.length + (hidden ? ' hidden' : ' restored')
      + (hidden ? ' — still in the database and the CSV export' : '');
    msg.className='count';
    render();
  }

  function csv(){
    fetch('/export', { headers: headers() }).then(r => {
      if(!r.ok){ msg.textContent='Auth failed'; msg.className='err'; return; }
      return r.blob();
    }).then(b => { if(!b) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download='submissions.csv'; a.click();
    });
  }

  let answersLoaded = false;
  async function toggleAnswers(){
    const box = document.getElementById('answers');
    if(box.style.display === 'block'){ box.style.display='none'; return; }
    box.style.display = 'block';
    if(answersLoaded) return;
    const res = await fetch('/answers', { headers: headers() });
    if(!res.ok){ msg.textContent='Auth failed'; msg.className='err'; box.style.display='none'; return; }
    const { answers } = await res.json();
    const row = (lab,val) => val ? '<div class="row"><span class="lab">'+lab+'</span>'+esc(val)+'</div>' : '';
    document.getElementById('answers-body').innerHTML = answers.map(a =>
      '<div class="akey"><div class="name">'+esc(a.challenge)+'</div>'
      + row('flag', a.flag) + row('win condition', a.win) + row('vuln', a.vuln)
      + row('solution', a.solution) + row('fix', a.fix) + '</div>'
    ).join('');
    answersLoaded = true;
  }

  let guideLoaded = false;
  async function toggleGuide(){
    const box = document.getElementById('guide');
    if(box.style.display === 'block'){ box.style.display='none'; return; }
    box.style.display='block';
    if(guideLoaded) return;
    const res = await fetch('/guide', { headers: headers() });
    if(!res.ok){ msg.textContent='Auth failed'; msg.className='err'; box.style.display='none'; return; }
    const { guide } = await res.json();
    document.getElementById('guide-body').textContent = guide;
    guideLoaded = true;
  }

  if(tokenEl.value) load();
</script>
</body>
</html>`;
