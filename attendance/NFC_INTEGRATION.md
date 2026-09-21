# NFC check-in

NFC is implemented and shares the whole pipeline with QR. This documents the
design and what is deliberately left open.

## How a tap works

Every tag holds **one static URL, forever**:

```
https://attendance.boilerblockchain.org/t
```

No meeting id, no token. A tap lands on `app/t/route.ts`, which:

1. resolves whichever meeting is currently active (`lib/checkin/nfcSession.ts`),
2. mints a **fresh single-use token for that tap alone**
   (`mintSingleUseSession`), and
3. redirects to the normal `/checkin/{meetingId}?token=…&method=NFC`.

So the tag is programmed once and never re-encoded, each meeting produces a
different link, and no two taps share a link. Cheap NTAG215 tags are fine; no
AES keys, no secure element.

### What this stops, and what it doesn't

The token is burned when the member's signing challenge is issued
(`claimSessionToken`), not at final check-in, so the member keeps the full
challenge TTL to connect a wallet and sign while the link is already spent for
everyone else.

**Stopped:** tapping once and forwarding the link to the group chat. One tap
buys exactly one check-in, so a forwarded link costs the sender their own
attendance.

**Not stopped:** someone standing at the tag tapping repeatedly to harvest a
link per absent friend. Each one costs a physical tap at the reader, and the
roster timestamps cluster visibly. Closing this properly needs an NTAG 424 DNA
tag, whose chip signs a monotonic counter per tap; that is a hardware change,
not a code change. The officer `revoke` flag is the intended remedy meanwhile.

**Also not stopped:** a new wallet self-declaring someone else's name on first
check-in. That is an identity problem, not an NFC one.

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

## Where the code lives

| Piece | File |
| --- | --- |
| Tag target + redirect | `app/t/route.ts` |
| "No meeting running" page | `app/t/closed/page.tsx` |
| Active-meeting resolution | `lib/checkin/nfcSession.ts` |
| Single-use mint + burn | `lib/checkin/session.ts` (`mintSingleUseSession`, `claimSessionToken`) |
| Single-use columns | `drizzle/0003_nfc_single_use_sessions.sql` |
| Tests | `test/nfcSession.test.ts` |

`attendanceService.ts`, `challenge.ts` and `verifySignature.ts` are untouched by
NFC, as intended.

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
