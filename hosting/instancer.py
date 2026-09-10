#!/usr/bin/env python3
"""Per-student challenge instancer for Boiler Blockchain CTF.

One public host (e.g. https://ctf.jaeger.lol). Each student launches their own
isolated challenge container; traffic is reverse-proxied under /i/<id>/ so every
instance is independent. Instances auto-expire.

stdlib only. Runs on brach behind the Cloudflare Tunnel.
"""
from __future__ import annotations
import json, os, re, secrets, subprocess, threading, time, urllib.request, urllib.error
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

LISTEN_PORT = int(os.environ.get("INSTANCER_PORT", "8600"))
TTL_SECONDS = int(os.environ.get("TTL_SECONDS", "5400"))      # 90 min
MAX_INSTANCES = int(os.environ.get("MAX_INSTANCES", "150"))
READY_TIMEOUT = 30

# chal slug -> (docker image, real flag)
CHALLENGES = {
    "multisig-mayhem":   ("multisig-mayhem-challenge",   os.environ.get("MULTISIG_FLAG", "")),
    "flash-crash":       ("flash-crash-challenge",       os.environ.get("FLASHCRASH_FLAG", "")),
    "double-down-drain": ("double-down-drain-challenge", os.environ.get("DOUBLEDOWN_FLAG", "")),
}
TITLES = {
    "multisig-mayhem": "Multisig Mayhem",
    "flash-crash": "Flash Crash",
    "double-down-drain": "Double Down Drain",
}

_lock = threading.Lock()
instances: dict[str, dict] = {}   # id -> {port, chal, name, created}

def sh(*args, timeout=60):
    return subprocess.run(args, capture_output=True, text=True, timeout=timeout)

def launch(chal: str) -> dict:
    image, flag = CHALLENGES[chal]
    with _lock:
        if len(instances) >= MAX_INSTANCES:
            raise RuntimeError("instance limit reached, try again shortly")
    iid = secrets.token_hex(4)
    name = f"bbctf-{chal}-{iid}"
    r = sh("docker", "run", "-d", "--rm",
           "-p", "127.0.0.1:0:8545",
           "-e", f"FLAG={flag}",
           "--memory=256m", "--cpus=0.5", "--pids-limit=128",
           "--name", name, image)
    if r.returncode != 0:
        raise RuntimeError(f"docker run failed: {r.stderr.strip()[:200]}")
    # discover the assigned host port
    p = sh("docker", "port", name, "8545")
    m = re.search(r":(\d+)\s*$", p.stdout.strip().splitlines()[-1]) if p.stdout.strip() else None
    if not m:
        sh("docker", "rm", "-f", name)
        raise RuntimeError("could not determine container port")
    port = int(m.group(1))
    # wait until the gateway responds
    ok = False
    for _ in range(READY_TIMEOUT * 2):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=2) as resp:
                if resp.status == 200:
                    ok = True; break
        except Exception:
            time.sleep(0.5)
    if not ok:
        sh("docker", "rm", "-f", name)
        raise RuntimeError("instance did not become ready")
    with _lock:
        instances[iid] = {"port": port, "chal": chal, "name": name, "created": time.time()}
    return {"id": iid, "port": port}

def reaper():
    while True:
        time.sleep(60)
        now = time.time()
        dead = [(i, v["name"]) for i, v in list(instances.items()) if now - v["created"] > TTL_SECONDS]
        for iid, name in dead:
            sh("docker", "rm", "-f", name)
            with _lock:
                instances.pop(iid, None)

class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):  # quiet
        pass

    def _send(self, status, body: bytes, ctype="text/html; charset=utf-8", extra=None):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    # ---- routing ----
    def do_GET(self):
        if self.path == "/" or self.path == "":
            return self._send(200, LANDING.encode())
        if self.path.startswith("/i/"):
            return self.proxy("GET")
        self._send(404, b"not found")

    def do_POST(self):
        if self.path == "/new":
            return self.new_instance()
        if self.path.startswith("/i/"):
            return self.proxy("POST")
        self._send(404, b"not found")

    def do_PUT(self):     self.proxy("PUT")     if self.path.startswith("/i/") else self._send(404, b"")
    def do_OPTIONS(self): self.proxy("OPTIONS") if self.path.startswith("/i/") else self._send(404, b"")

    # ---- launch ----
    def new_instance(self):
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length).decode() if length else ""
        chal = ""
        if raw.strip().startswith("{"):
            try: chal = (json.loads(raw).get("chal") or "").strip()
            except Exception: chal = ""
        else:
            for pair in raw.split("&"):
                if pair.startswith("chal="):
                    chal = pair.split("=", 1)[1]
        chal = re.sub(r"[^a-z-]", "", chal)
        if chal not in CHALLENGES:
            return self._send(400, b"unknown challenge")
        try:
            info = launch(chal)
        except Exception as e:
            return self._send(503, str(e).encode())
        iid = info["id"]; port = info["port"]
        host = self.headers.get("Host", "ctf.jaeger.lol")
        base = f"https://{host}/i/{iid}/"
        # read the container's connection info and rewrite URLs to the proxied ones
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=5) as resp:
                gw = json.loads(resp.read().decode())
        except Exception:
            gw = {}
        gw["rpc_url"] = base
        gw["claim_url"] = base + "claim"
        gw["instance_id"] = iid
        gw["expires_in_seconds"] = TTL_SECONDS
        page = INSTANCE_PAGE(TITLES[chal], base, gw)
        self._send(200, page.encode())

    # ---- reverse proxy to the student's container ----
    def proxy(self, method):
        m = re.match(r"^/i/([0-9a-f]{8})(/.*)?$", self.path)
        if not m:
            return self._send(404, b"no such instance")
        iid, rest = m.group(1), (m.group(2) or "/")
        inst = instances.get(iid)
        if not inst:
            return self._send(410, b"instance expired or not found")
        target = f"http://127.0.0.1:{inst['port']}{rest}"
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length else None
        req = urllib.request.Request(target, data=body, method=method)
        ct = self.headers.get("Content-Type")
        if ct: req.add_header("Content-Type", ct)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                self._send(resp.status, data,
                           ctype=resp.headers.get("Content-Type", "application/json"))
        except urllib.error.HTTPError as e:
            data = e.read()
            self._send(e.code, data, ctype=e.headers.get("Content-Type", "application/json"))
        except Exception as e:
            self._send(502, f"upstream error: {e}".encode())

LANDING = """<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>Boiler Blockchain CTF</title>
<style>
 body{margin:0;background:#0b0b0f;color:#eee;font-family:ui-sans-serif,system-ui,sans-serif}
 .wrap{max-width:720px;margin:0 auto;padding:2rem 1.25rem}
 h1{color:#C77DFF;letter-spacing:.04em}
 .c{border:1px solid #1c1c24;background:#16161c;padding:1rem 1.2rem;margin:.8rem 0}
 .c h3{margin:.2rem 0;color:#C77DFF}
 .c p{color:#aaa;font-size:.9rem;line-height:1.5}
 button{padding:.6rem 1.1rem;background:#7120B0;border:1px solid #7120B0;color:#fff;cursor:pointer;font-size:.9rem}
 button:hover{background:#A855F7}
 small{color:#666}
</style></head><body><div class=wrap>
<h1>Boiler Blockchain — Level 2</h1>
<p style="color:#aaa">Launch your own private instance. Drain the vault, then hit <code>/claim</code> to get your flag. Each instance is yours and expires after 90 minutes.</p>
<div class=c><h3>Multisig Mayhem</h3><p>Warm-up · signature / authorization.</p>
<form method=post action=/new><input type=hidden name=chal value=multisig-mayhem><button>Launch instance</button></form></div>
<div class=c><h3>Flash Crash</h3><p>Medium · EIP-1153 transient storage.</p>
<form method=post action=/new><input type=hidden name=chal value=flash-crash><button>Launch instance</button></form></div>
<div class=c><h3>Double Down Drain</h3><p>Hard · delegatecall + storage layout.</p>
<form method=post action=/new><input type=hidden name=chal value=double-down-drain><button>Launch instance</button></form></div>
<p><small>Point Foundry at the RPC URL you get. Submit your flag on the Boiler Blockchain site.</small></p>
</div></body></html>"""

def INSTANCE_PAGE(title, base, gw):
    j = json.dumps(gw, indent=2)
    return f"""<!doctype html><html><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>{title} — your instance</title>
<style>
 body{{margin:0;background:#0b0b0f;color:#eee;font-family:ui-sans-serif,system-ui,sans-serif}}
 .wrap{{max-width:760px;margin:0 auto;padding:2rem 1.25rem}}
 h1{{color:#C77DFF}} code{{color:#9fe;word-break:break-all}}
 pre{{background:#111;border:1px solid #1c1c24;padding:1rem;overflow:auto;white-space:pre-wrap}}
 a{{color:#C77DFF}}
</style></head><body><div class=wrap>
<h1>{title}</h1>
<p>Your private instance is ready. RPC URL:</p>
<pre><code>{base}</code></pre>
<p>Connection details (funded player key + contract addresses):</p>
<pre>{j}</pre>
<p>Solve it, then: <code>curl -X POST {base}claim -H 'content-type: application/json' -d '{{"address":"&lt;setup_address&gt;"}}'</code></p>
<p><a href=/>&larr; back</a></p>
</div></body></html>"""

if __name__ == "__main__":
    threading.Thread(target=reaper, daemon=True).start()
    ThreadingHTTPServer(("127.0.0.1", LISTEN_PORT), Handler).serve_forever()
