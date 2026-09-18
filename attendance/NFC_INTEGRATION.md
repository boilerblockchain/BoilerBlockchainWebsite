# Adding NFC check-in

This system was built QR-first but **method-agnostic**. Adding NFC is additive:
you write a new *session-delivery* path and pass `method: "NFC"`. You do **not**
touch the attendance core or the signature/nonce logic, and you do **not**
create a second attendance table.

## The seam

Everything funnels through one entry point:

```ts
// lib/attendanceService.ts
checkIn(deps, { meetingId, walletAddress, method, sessionToken, nonce, signature })
```

`method` is a `CheckInMethod` enum value that is **passed through and stored**,
never branched on inside the core. The pipeline is:

```
   QR now  ───────┐
                  ├──►  check-in session  ──►  challenge / signature  ──►  checkIn()
   NFC later ─────┘        (per-method)            (shared)               (shared)
```

Only the **check-in session** box is method-specific. For QR that's
`lib/checkin/session.ts` (a token embedded in a QR URL). NFC needs a sibling
that produces/validates the same kind of token — nothing downstream changes.

## What already supports NFC with zero changes

- **Enum** — `check_in_method` in `lib/db/schema.ts` and `CheckInMethod` in
  `lib/checkin/types.ts` already include `"NFC"`. The DB column already lists it,
  so no migration is needed.
- **Attendance + dedup** — `attendance` stores `method`; the
  `UNIQUE(meeting_id, wallet_address)` constraint means a member can't be
  double-counted whether they tapped or scanned.
- **Challenge / signature** — `lib/checkin/challenge.ts` and
  `lib/checkin/verifySignature.ts` are method-neutral.
- **Check-in API** — `POST /api/checkin` already accepts and validates `method`
  via `isCheckInMethod`, then calls the shared service. An NFC tap that lands on
  the check-in page and posts `method: "NFC"` already works end-to-end.

## Steps to add NFC

1. **Session delivery.** Add `lib/checkin/nfcSession.ts` mirroring
   `session.ts`. Reuse `ensureActiveSession(db, { meetingId, ttlSeconds, method: "NFC" })`
   and `validateSessionToken` as-is — they're already parameterized by `method`.
   The only new work is getting the token onto/off an NFC tag:
   - **Static programmed tag:** write the URL `\/checkin/{meetingId}?token={token}&method=NFC`
     to the tag. For anti-replay, prefer a tag re-programmed per meeting, or a
     phone acting as an HCE tag serving a rotating token from
     `ensureActiveSession` (same rotation guarantee as the QR).
   - **Web NFC read (Android/Chrome):** the check-in page reads the tag via the
     Web NFC API (`NDEFReader`) and extracts the same `token`.

2. **Member entry point.** NFC only replaces the *scan* step. The tap should open
   the **existing** `\/checkin/[meetingId]` page with `?token=…`. That page's flow
   (validate → connect wallet → sign challenge → `POST /api/checkin`) is reused
   verbatim; just pass `method: "NFC"` in the check-in POST (read it from the URL
   or default per entry path).

3. **Done.** No changes to `attendanceService.ts`, `challenge.ts`,
   `verifySignature.ts`, or the `attendance` table.

## Guardrails (please keep)

- **One attendance table.** Do not add `nfc_attendance`. Route everything through
  `checkIn(...)`.
- **Same anti-replay bar as QR.** NFC tokens must rotate/expire like QR session
  tokens (`ensureActiveSession` already does this) so a cloned/old tag payload
  stops validating. The wallet signature + single-use nonce still apply, so a tap
  alone is never proof of attendance.
- **Keep `method` descriptive only.** If you ever find yourself writing
  `if (method === "NFC")` inside the core service, move that logic into the
  session-delivery layer instead.

## iOS note

Web NFC (`NDEFReader`) is Android/Chrome only. On iPhones, the reliable pattern
is an **NFC tag encoded with a URL** — iOS reads the tag natively and opens the
`\/checkin/...` link in Safari, where the normal wallet-sign flow runs. So an
URL-encoded tag works cross-platform without the Web NFC API.
