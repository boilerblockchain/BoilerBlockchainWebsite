# Challenge submissions backend (Cloudflare Worker + D1)

Free. Stores form submissions from the `/challenges` page in a D1 database and
serves an admin dashboard at `/admin`. No server to keep running on brach.

## One-time setup

From this `worker/` directory:

```bash
npm i -g wrangler          # or: npx wrangler ...
wrangler login             # opens a browser once

# 1. create the database, then paste the printed database_id into wrangler.toml
wrangler d1 create bb-challenges

# 2. create the table
wrangler d1 execute bb-challenges --remote --file=./schema.sql

# 3. set the admin password (any long random string)
wrangler secret put ADMIN_TOKEN

# 3b. set the flag-signing secret. MUST be byte-identical to the instancer's
#     FLAG_SECRET (hosting/flags.env) or no Level 2 flag will ever verify.
wrangler secret put FLAG_SECRET

# 4. lock the form to your site origin: edit ALLOWED_ORIGIN in wrangler.toml
#    e.g. "https://boilerblockchain.org"  (leave "*" only while testing)

# 5. deploy
wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g.
`https://bb-challenges.<your-subdomain>.workers.dev`.

## Point the site at it

Build the site with the Worker URL:

```bash
VITE_CHALLENGES_API="https://bb-challenges.<your-subdomain>.workers.dev" npm run build
```

(or hardcode the fallback in `src/components/sections/Challenges.jsx`).

## Reading submissions

Open `https://bb-challenges.<your-subdomain>.workers.dev/admin`, paste the
`ADMIN_TOKEN`, click Load. Export CSV from the same page. The token is checked
server-side; the form itself (`/submit`) is public.

## Endpoints

| Method | Path      | Auth        | Purpose                     |
|--------|-----------|-------------|-----------------------------|
| POST   | `/submit` | none        | store a submission          |
| GET    | `/admin`  | none (page) | dashboard (prompts token)   |
| GET    | `/list`   | Bearer      | JSON of submissions         |
| GET    | `/export` | Bearer      | CSV of submissions          |
| GET    | `/answers`| Bearer      | answer key (no flags to leak)|
| GET    | `/guide`  | Bearer      | internal run sheet          |

## How Level 2 flags are marked

Every launched instance mints its own flag,
`boiler{<challenge-slug>_<nonce>_<signature>}`, where the signature is an HMAC
over the slug and nonce keyed with `FLAG_SECRET`. The instancer and this Worker
hold the same secret and never talk to each other: the Worker verifies a flag it
has never seen by recomputing the signature.

That means there is no master flag to leak, a flag from one challenge will not
validate for another, and a flag cannot be invented. It also makes flag-passing
visible: a correct flag handed in by a second person is stored with
`flag_reused = 1` and shows a ⚠ in the dashboard's *shared* column. The
submitter is not told, so the copy stays worth catching.

Rotate by setting a new `FLAG_SECRET` on both sides. Every previously claimed
flag stops verifying, so rotate between cohorts, not mid-run.

## Local dev

```bash
wrangler d1 execute bb-challenges --local --file=./schema.sql
wrangler dev
```
