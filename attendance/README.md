# Boiler Blockchain — Attendance

Wallet-verified meeting attendance. Members check in by scanning a rotating QR
code and **signing a message with their wallet** — the signature proves they
control the address (no passwords, no gas, no transaction). Attendance is
verified and saved to the database.

Built QR-first but architected so **NFC drops in later** with no changes to the
core — see [`NFC_INTEGRATION.md`](./NFC_INTEGRATION.md).

## How it works

```
Officer creates + starts a meeting
        │
        ▼
Rotating QR  ──►  /checkin/{meetingId}?token={sessionToken}
        │                      │
   member scans         page validates the token is fresh + meeting active
        │                      │
        ▼                      ▼
member connects wallet  ──►  requests a single-use challenge (nonce)
        │                      │
   signs EIP-712 (nonce)  ──►  POST /api/checkin
                               │
                        attendanceService.checkIn():
                          validate meeting → validate session token
                          → verify signature recovers to the wallet
                          → consume nonce (single-use)
                          → record attendance (UNIQUE meeting+wallet)
```

The only "web3" here is **identity**: your wallet is your ID, and the signature
proves it's really you. Nothing is written on-chain.

### Security properties

| Threat | Mitigation |
| --- | --- |
| Forwarded screenshot of an old QR | Rotating session token with short TTL (`SESSION_TOKEN_TTL_SECONDS`) |
| Reused check-in token | Token checked against the active, unexpired session each call |
| Reused signing nonce | `checkin_challenges.used` flipped atomically on first use |
| Duplicate attendance | `UNIQUE(meeting_id, wallet_address)` + service-level check |
| Check-in on a closed meeting | Requires `status = active` and now ∈ [startsAt, endsAt] |
| Forged wallet address | EIP-712 signature must recover to the claimed wallet |
| Unauthorized officer actions | Officer allowlist + signed session cookie |

## Tech stack

Next.js (App Router) · wagmi + viem (wallet connect + signing) · Postgres
(drizzle-orm) · Tailwind. Deploys to Vercel; runs anywhere Node 20+ + Postgres
are available. No blockchain node, wallet funding, or gas required.

## Setup

### 1. Install

```bash
npm install
```

### 2. Provision a database

Any Postgres works. On Vercel, add **Neon** from the Marketplace; locally, use a
Postgres container. Put the connection string in `.env.local` (see step 3), then
create the tables:

```bash
npm run db:migrate      # applies ./drizzle migrations
```

### 3. Configure environment

Copy `.env.example` → `.env.local` and fill in:

- `DATABASE_URL` — from step 2.
- `NEXT_PUBLIC_APP_URL` — the URL phones will reach. In local dev this must be
  your **LAN address** (e.g. `http://192.168.1.20:3000`), not `localhost`, so a
  phone can open the QR link.
- `CHAIN_ID` / `NEXT_PUBLIC_CHAIN_ID` — leave at `84532`. This only scopes the
  signature so it can't be replayed on another network; nothing is transacted.

### 4. Add officers to the allowlist

```bash
npm run add-officer -- 0xYourOfficerWallet admin "Your name"
npm run add-officer -- 0xAnotherOfficer officer
```

### 5. Run

```bash
npm run dev
```

- Officers: `/officer` — connect an allowlisted wallet, sign in, create + start a
  meeting, project the QR.
- Members: scan the QR → connect wallet → **Check in**.
- Anyone: `/profile` — a wallet's attendance history.

## Verify end-to-end

1. `/officer` → create a meeting → **Start**. A rotating QR appears.
2. On your phone, scan the QR → connect a wallet → **Check in** → success.
3. The attendee appears in the officer roster and on `/profile`.
4. Confirm the guardrails: an old QR fails, a duplicate check-in is a no-op, and
   **Revoke** removes a check-in.

## Tests

```bash
npm test
```

Vitest + in-memory Postgres (PGlite) cover signature verification, single-use
nonces, duplicate prevention, and expired sessions.

## Deploy (Vercel)

1. Set the same env vars (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, chain ids, and a
   dedicated `OFFICER_SESSION_SECRET`) in the Vercel project.
2. `npm run db:migrate` against the production database and re-add officers.
3. Deploy (`vercel --prod`).

## Project layout

```
app/                     Next.js routes (pages + API)
  api/                   checkin, meetings, officer login, revoke, attendance
  officer/  checkin/  profile/
lib/
  attendanceService.ts   shared, method-agnostic core: checkIn(...)
  checkin/               session (QR), challenge (nonce), signature, types, typed data
  auth.ts                officer allowlist + signed session cookie
  db/                    drizzle schema + client
scripts/                 add-officer
test/                    Vitest suite (PGlite)
```
