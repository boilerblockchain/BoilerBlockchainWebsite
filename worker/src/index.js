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

const MAX_FIELD = 4000; // per-field char cap
const FIELDS = ['name', 'email', 'challenge', 'onchain', 'links', 'writeup'];

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
      await env.DB.prepare(
        `INSERT INTO submissions
           (created_at, name, email, challenge, onchain, links, writeup, ip, ua)
         VALUES (?,?,?,?,?,?,?,?,?)`
      )
        .bind(
          new Date().toISOString(),
          row.name,
          row.email,
          row.challenge,
          row.onchain,
          row.links,
          row.writeup,
          request.headers.get('CF-Connecting-IP') || '',
          (request.headers.get('User-Agent') || '').slice(0, 300)
        )
        .run();
      return json({ ok: true }, 201, env);
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
      const cols = ['id', 'created_at', 'name', 'email', 'challenge', 'onchain', 'links', 'writeup'];
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
  a { color:#C77DFF; }
  .wrap { padding:1.5rem; }
  .count { color:#888; font-size:.85rem; }
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
  <span id="msg" class="count"></span>
</header>
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
    const cols = ['id','created_at','name','email','challenge','onchain','links','writeup'];
    document.querySelector('thead').innerHTML =
      '<tr>' + cols.map(c=>'<th>'+c+'</th>').join('') + '</tr>';
    const esc = s => String(s??'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
    document.querySelector('tbody').innerHTML = submissions.map(r =>
      '<tr>' + cols.map(c => {
        const v = esc(r[c]);
        if(c==='challenge') return '<td class="chal">'+v+'</td>';
        if(c==='writeup') return '<td class="writeup">'+v+'</td>';
        if(c==='onchain'||c==='links') return '<td><code>'+v+'</code></td>';
        return '<td>'+v+'</td>';
      }).join('') + '</tr>'
    ).join('');
    msg.textContent = submissions.length + ' submissions'; msg.className='count';
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
  if(tokenEl.value) load();
</script>
</body>
</html>`;
