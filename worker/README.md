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

## Local dev

```bash
wrangler d1 execute bb-challenges --local --file=./schema.sql
wrangler dev
```
