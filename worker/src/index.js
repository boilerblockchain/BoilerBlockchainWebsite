/**
 * Boiler Blockchain challenge submissions.
 *
 * Routes:
 *   POST /submit   public; stores one submission in D1.
 *   GET  /admin    HTML dashboard; prompts for the admin token, lists rows.
 *   GET  /list     JSON list of submissions; requires Bearer ADMIN_TOKEN.
 *   GET  /export   CSV of all submissions;   requires Bearer ADMIN_TOKEN.
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

    // ---- admin CSV ----
    if (url.pathname === '/export' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      const { results } = await env.DB.prepare(
        `SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5000`
      ).all();
      const cols = ['id', 'created_at', 'name', 'email', 'challenge', 'flag', 'flag_correct', 'flag_reused', 'flag_verdict', 'flag_owner', 'onchain', 'links', 'exploit', 'writeup'];
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
  :root { color-scheme: dark; }
  body { margin:0; background:#0b0b0f; color:#eee;
         font-family:ui-sans-serif,system-ui,sans-serif; }
  header { padding:1rem 1.5rem; border-bottom:1px solid #222;
           display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
  h1 { font-size:1rem; letter-spacing:.14em; text-transform:uppercase; margin:0;
       color:#C77DFF; }
  input { padding:.55rem .7rem; background:#16161c; border:1px solid #333;
          color:#fff; border-radius:0; min-width:280px; }
  button { padding:.55rem 1rem; background:#7120B0; border:1px solid #7120B0;
           color:#fff; cursor:pointer; }
  button:hover { background:#A855F7; }
  button.ghost { background:transparent; border-color:#444; }
  a { color:#C77DFF; }
  .wrap { padding:1.5rem; }
  .count { color:#888; font-size:.85rem; }
  #answers { padding:0 1.5rem 1.5rem; display:none; }
  #answers h2 { font-size:.8rem; letter-spacing:.14em; text-transform:uppercase;
                color:#C77DFF; border-bottom:1px solid #222; padding-bottom:.5rem; }
  .akey { border:1px solid #1c1c24; background:#111; padding:.8rem 1rem;
          margin-bottom:.8rem; }
  .akey .name { color:#C77DFF; font-weight:600; margin-bottom:.4rem; }
  .akey .row { font-size:.85rem; line-height:1.5; margin:.25rem 0; }
  .akey .lab { color:#888; text-transform:uppercase; letter-spacing:.08em;
               font-size:.7rem; margin-right:.4rem; }
  table { width:100%; border-collapse:collapse; font-size:.85rem; }
  th,td { text-align:left; padding:.5rem .6rem; border-bottom:1px solid #1c1c24;
          vertical-align:top; }
  th { color:#888; text-transform:uppercase; letter-spacing:.1em;
       font-size:.7rem; position:sticky; top:0; background:#0b0b0f; }
  td.writeup { max-width:340px; white-space:pre-wrap; }
  .chal { color:#C77DFF; white-space:nowrap; }
  td.verdict { max-width:300px; line-height:1.45; }
  td.verdict .why { color:#777; font-size:.76rem; }
  td.verdict .owner { color:#9fe; font-family:ui-monospace,monospace; font-size:.75rem; }
  .err { color:#ff6b6b; }
  code { color:#9fe; word-break:break-all; }
</style>
</head>
<body>
<header>
  <h1>Submissions</h1>
  <input id="token" type="password" placeholder="admin token" />
  <button onclick="load()">Load</button>
  <button onclick="csv()">Export CSV</button>
  <button class="ghost" onclick="toggleAnswers()">Answer key</button>
  <button class="ghost" onclick="toggleGuide()">Guide</button>
  <span id="msg" class="count"></span>
</header>
<div id="answers"><h2>Answer key</h2><div id="answers-body"></div></div>
<div id="guide" style="display:none;padding:0 1.5rem 1.5rem"><h2 style="font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:#C77DFF;border-bottom:1px solid #222;padding-bottom:.5rem">Internal guide</h2><pre id="guide-body" style="white-space:pre-wrap;background:#111;border:1px solid #1c1c24;padding:1rem;font-size:.82rem"></pre></div>
<div class="wrap"><table id="tbl"><thead></thead><tbody></tbody></table></div>
<script>
  // One cell that says exactly what the checker concluded and why, so a green
  // tick is never the whole story a grader has to go on.
  const VERDICT_STYLE = {
    valid:            { icon:'✓', color:'#4ade80' },
    valid_legacy:     { icon:'✓', color:'#4ade80' },
    foreign_instance: { icon:'⚠', color:'#fbbf24' },
    wrong_challenge:  { icon:'✗', color:'#ff6b6b' },
    forged:           { icon:'✗', color:'#ff6b6b' },
    malformed:        { icon:'✗', color:'#ff6b6b' },
    none:             { icon:'',  color:'#666'    },
  };
  function verdictCell(r){
    const key = r.flag_verdict || (r.flag ? (r.flag_correct==1?'valid_legacy':'forged') : 'none');
    const style = VERDICT_STYLE[key] || VERDICT_STYLE.malformed;
    const meta = (window.VERDICTS||{})[key] || {};
    const esc = s => String(s??'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
    if(key === 'none') return '';
    const bits = [
      '<span style="color:'+style.color+';font-weight:700">'+style.icon+' '+esc(meta.label||key)+'</span>'
    ];
    if(r.flag_reused==1) bits.push('<span style="color:#fbbf24">⚠ also submitted by someone else</span>');
    if(r.flag_owner) bits.push('<span class="owner">owner tag '+esc(r.flag_owner)+'</span>');
    if(meta.detail) bits.push('<span class="why">'+esc(meta.detail)+'</span>');
    return bits.join('<br>');
  }
  const tokenEl = document.getElementById('token');
  try { tokenEl.value = localStorage.getItem('bb_admin_token') || ''; } catch {}
  const msg = document.getElementById('msg');
  function headers(){ return { Authorization: 'Bearer ' + tokenEl.value }; }
  async function load(){
    try { localStorage.setItem('bb_admin_token', tokenEl.value); } catch {}
    msg.textContent = 'Loading…'; msg.className='count';
    const res = await fetch('/list', { headers: headers() });
    if(!res.ok){ msg.textContent = 'Auth failed ('+res.status+')'; msg.className='err'; return; }
    const { submissions, verdicts } = await res.json();
    window.VERDICTS = verdicts || {};
    const cols = ['id','created_at','name','email','challenge','verdict','flag','onchain','links','exploit','writeup'];
    document.querySelector('thead').innerHTML =
      '<tr>' + cols.map(c=>'<th>'+c+'</th>').join('') + '</tr>';
    const esc = s => String(s??'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
    document.querySelector('tbody').innerHTML = submissions.map(r =>
      '<tr>' + cols.map(c => {
        const v = esc(r[c]);
        if(c==='verdict') return '<td class="verdict">'+verdictCell(r)+'</td>';
        if(c==='challenge') return '<td class="chal">'+v+'</td>';
        if(c==='writeup') return '<td class="writeup">'+v+'</td>';
        if(c==='exploit') return '<td class="writeup"><pre style="margin:0;white-space:pre-wrap;font-size:.78rem">'+v+'</pre></td>';
        if(c==='flag'||c==='onchain'||c==='links') return '<td><code>'+v+'</code></td>';
        return '<td>'+v+'</td>';
      }).join('') + '</tr>'
    ).join('');
    const solved  = submissions.filter(r=>r.flag_verdict==='valid'||r.flag_verdict==='valid_legacy'||(!r.flag_verdict&&r.flag_correct==1)).length;
    const shared  = submissions.filter(r=>r.flag_reused==1).length;
    const foreign = submissions.filter(r=>r.flag_verdict==='foreign_instance').length;
    const forged  = submissions.filter(r=>r.flag_verdict==='forged').length;
    msg.textContent = submissions.length + ' submissions · ' + solved + ' verified'
      + (foreign ? ' · ' + foreign + ' from another email ⚠' : '')
      + (shared  ? ' · ' + shared  + ' duplicate ⚠' : '')
      + (forged  ? ' · ' + forged  + ' forged ✗' : ''); msg.className='count';
  }
  function csv(){
    const url = '/export';
    fetch(url, { headers: headers() }).then(r => {
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
    const esc = s => String(s??'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
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
