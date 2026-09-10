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
 *   ALLOWED_ORIGIN  (var)     site origin allowed to POST; "*" while testing.
 */

const MAX_FIELD = 20000; // per-field char cap (exploit paste can be long)
const FIELDS = ['name', 'email', 'challenge', 'onchain', 'links', 'exploit', 'flag', 'writeup'];

// Real flags are NOT hardcoded (this repo is public). They come from the
// FLAGS_JSON Worker secret: {"Multisig Mayhem":"boiler{...}", ...}.
function getFlags(env) {
  try { return JSON.parse(env.FLAGS_JSON || '{}'); } catch { return {}; }
}

// Live instance URLs (informational, mirrors the site).
const LAUNCH_URL = 'https://ctf.jaeger.lol';
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
    win: 'Drain the vault (Setup.isSolved: balance == 0). Launch your own instance at https://ctf.jaeger.lol',
    vuln:
      'submitTransaction() recovers a signer with ecrecover but never checks isOwner[signer], and executionThreshold() returns 1. Any signature from any key you control passes.',
    solution:
      'Compute txHash = keccak256(abi.encodePacked(dest, value, data, nonce, wallet)). Sign it with YOUR own key. Call submitTransaction with dest = your address, value = full balance, and your single (v,r,s). Balance goes to zero.',
    fix:
      'require(isOwner[signer]); enforce required >= advertisedRequiredSignatures (3); dedupe signers (the > ordering check helps but the missing isOwner check is the hole).',
  },
  {
    challenge: 'Flash Crash',
    win: 'Drain the vault (Setup.isSolved: balance == 0). Launch your own instance at https://ctf.jaeger.lol',
    vuln:
      'The session flag lives in EIP-1153 transient storage, which clears at the END of the transaction, not between calls. emergencyDrain() only checks sessionOpen — no caller auth.',
    solution:
      'In ONE transaction call openSession() then emergencyDrain(). Do it from an attacker contract (or a multicall) so both run in the same tx; sessionOpen is still true when emergencyDrain sends the balance to msg.sender.',
    fix:
      'Do not use a transient flag as authorization. Gate emergencyDrain to the owner / a real flash-loan callback, and clear the session explicitly at the end of the intended flow.',
  },
  {
    challenge: 'Double Down Drain',
    win: 'Drain the vault (Setup.isSolved: balance == 0). Launch your own instance at https://ctf.jaeger.lol',
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

INSTANCER (public):  https://ctf.jaeger.lol   (also https://ctf.pyras.org once DNS is added)
  - Student opens it, clicks "Launch instance" for a challenge.
  - Gets a private RPC at https://ctf.jaeger.lol/i/<id>/ + funded player key + addresses.
  - Instances are isolated and auto-expire after 90 minutes.

HOW A PLAYER SOLVES ONE
  1. Launch an instance -> private RPC URL + player key + contract addresses.
  2. Point Foundry (forge/cast) at the instance RPC URL.
  3. Write the exploit, drive Setup.isSolved() to true (drain the vault).
  4. POST {"address":"<setup>"} to <rpc>/claim -> real flag (boiler{...}).
  5. Submit the flag on the Boiler Blockchain site (auto-checked here).

REFERENCE SOLUTIONS: see the answer key (vuln + solution + fix + flag).

HOSTING / OPS (brach)
  Instancer service:  systemctl --user status bb-instancer
  Instancer code:     ~/active/bb-challenges/instancer.py  (stdlib, port 8600)
  Rebuild images:     ~/active/bb-challenges/deploy-brach.sh
  Tunnel:             cloudflared user service -> ctf.jaeger.lol / ctf.pyras.org
  Reset:              automatic. Each launch is a fresh container; expired ones
                      are reaped (TTL 90m). No manual reset needed.
  Flags live in the instancer CHALLENGES map and this Worker's FLAGS map.`;

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
      // Auto-mark: does the submitted flag match the real flag for this challenge?
      const expected = getFlags(env)[row.challenge];
      const flagCorrect = expected && row.flag && row.flag === expected ? 1 : 0;
      await env.DB.prepare(
        `INSERT INTO submissions
           (created_at, name, email, challenge, onchain, links, exploit, flag, flag_correct, writeup, ip, ua)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
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
      return json({ submissions: results }, 200, env);
    }

    // ---- admin CSV ----
    if (url.pathname === '/export' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      const { results } = await env.DB.prepare(
        `SELECT * FROM submissions ORDER BY created_at DESC LIMIT 5000`
      ).all();
      const cols = ['id', 'created_at', 'name', 'email', 'challenge', 'flag', 'flag_correct', 'onchain', 'links', 'exploit', 'writeup'];
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
      const flags = getFlags(env);
      const answers = ANSWERS.map((a) => (flags[a.challenge] ? { ...a, flag: flags[a.challenge] } : a));
      return json({ answers }, 200, env);
    }

    // ---- internal guide (token-gated) ----
    if (url.pathname === '/guide' && request.method === 'GET') {
      if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401, env);
      const flags = getFlags(env);
      const flagBlock = Object.entries(flags).map(([k, v]) => `  ${k}: ${v}`).join('\n');
      const guide = GUIDE + (flagBlock ? `\n\nFLAGS\n${flagBlock}` : '');
      return json({ guide, instances: INSTANCES }, 200, env);
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
  const tokenEl = document.getElementById('token');
  try { tokenEl.value = localStorage.getItem('bb_admin_token') || ''; } catch {}
  const msg = document.getElementById('msg');
  function headers(){ return { Authorization: 'Bearer ' + tokenEl.value }; }
  async function load(){
    try { localStorage.setItem('bb_admin_token', tokenEl.value); } catch {}
    msg.textContent = 'Loading…'; msg.className='count';
    const res = await fetch('/list', { headers: headers() });
    if(!res.ok){ msg.textContent = 'Auth failed ('+res.status+')'; msg.className='err'; return; }
    const { submissions } = await res.json();
    const cols = ['id','created_at','name','email','challenge','flag_correct','flag','onchain','links','exploit','writeup'];
    document.querySelector('thead').innerHTML =
      '<tr>' + cols.map(c=>'<th>'+(c==='flag_correct'?'ok':c)+'</th>').join('') + '</tr>';
    const esc = s => String(s??'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
    document.querySelector('tbody').innerHTML = submissions.map(r =>
      '<tr>' + cols.map(c => {
        const v = esc(r[c]);
        if(c==='flag_correct') return r.flag_correct==1
          ? '<td style="color:#4ade80;font-weight:700">✓</td>'
          : (r.flag ? '<td style="color:#ff6b6b">✗</td>' : '<td></td>');
        if(c==='challenge') return '<td class="chal">'+v+'</td>';
        if(c==='writeup') return '<td class="writeup">'+v+'</td>';
        if(c==='exploit') return '<td class="writeup"><pre style="margin:0;white-space:pre-wrap;font-size:.78rem">'+v+'</pre></td>';
        if(c==='flag'||c==='onchain'||c==='links') return '<td><code>'+v+'</code></td>';
        return '<td>'+v+'</td>';
      }).join('') + '</tr>'
    ).join('');
    const solved = submissions.filter(r=>r.flag_correct==1).length;
    msg.textContent = submissions.length + ' submissions · ' + solved + ' correct flags'; msg.className='count';
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
