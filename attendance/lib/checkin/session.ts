import { randomBytes } from "node:crypto";
import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { checkinSessions } from "@/lib/db/schema";
import type { AppDb } from "@/lib/db/types";
import type { CheckInMethod } from "@/lib/checkin/types";

/**
 * Rotating check-in session — the ONLY method-specific part of the pipeline.
 * For QR, the token is embedded in the QR URL. For NFC later, the same token
 * shape will be written to a tag; the interface below stays identical so the
 * downstream challenge → signature → attendance → EAS flow is untouched.
 */
export interface ActiveSession {
  token: string;
  expiresAt: Date;
}

/**
 * Return the current active, unexpired session for a meeting, creating a fresh
 * one (and retiring stale ones) when none is valid. Because the token has a
 * short TTL, a screenshot of an older QR stops validating once it rotates.
 */
export async function ensureActiveSession(
  db: AppDb,
  args: { meetingId: string; ttlSeconds: number; method?: CheckInMethod },
): Promise<ActiveSession> {
  const method = args.method ?? "QR";
  const now = new Date();
  // Rotate the displayed QR at half its TTL so any token a member scans still
  // has at least half its lifetime left to complete connect + sign.
  const rotateAfter = new Date(now.getTime() - (args.ttlSeconds * 1000) / 2);

  const existing = await db
    .select({
      token: checkinSessions.token,
      expiresAt: checkinSessions.expiresAt,
    })
    .from(checkinSessions)
    .where(
      and(
        eq(checkinSessions.meetingId, args.meetingId),
        eq(checkinSessions.method, method),
        eq(checkinSessions.active, true),
        gt(checkinSessions.expiresAt, now),
        // only reuse a token that isn't yet past its rotation point
        gt(checkinSessions.createdAt, rotateAfter),
      ),
    )
    .orderBy(desc(checkinSessions.expiresAt))
    .limit(1);

  if (existing.length === 1) {
    return { token: existing[0].token, expiresAt: existing[0].expiresAt };
  }

  // Retire any stale/active sessions for this meeting+method, then mint one.
  await db
    .update(checkinSessions)
    .set({ active: false })
    .where(
      and(
        eq(checkinSessions.meetingId, args.meetingId),
        eq(checkinSessions.method, method),
        eq(checkinSessions.active, true),
      ),
    );

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + args.ttlSeconds * 1000);
  await db.insert(checkinSessions).values({
    meetingId: args.meetingId,
    method,
    token,
    expiresAt,
    active: true,
  });

  return { token, expiresAt };
}

/**
 * Mint a fresh single-use session. Unlike `ensureActiveSession` this never
 * reuses or retires anything: each NFC tap gets its own token, so a queue of
 * members tapping in sequence doesn't invalidate the person still signing.
 */
export async function mintSingleUseSession(
  db: AppDb,
  args: { meetingId: string; ttlSeconds: number; method?: CheckInMethod },
): Promise<ActiveSession> {
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + args.ttlSeconds * 1000);
  await db.insert(checkinSessions).values({
    meetingId: args.meetingId,
    method: args.method ?? "NFC",
    token,
    expiresAt,
    active: true,
    singleUse: true,
  });
  return { token, expiresAt };
}

/**
 * Validate a session token presented at check-in: it must exist, be active,
 * be unexpired, belong to the given meeting, and — if it is single-use — not
 * have been consumed yet. The token itself is NOT proof of attendance; it only
 * proves the QR was fresh (or the tag was tapped) and the meeting live.
 */
export async function validateSessionToken(
  db: AppDb,
  args: { meetingId: string; token: string },
): Promise<boolean> {
  const rows = await db
    .select({ id: checkinSessions.id })
    .from(checkinSessions)
    .where(
      and(
        eq(checkinSessions.meetingId, args.meetingId),
        eq(checkinSessions.token, args.token),
        eq(checkinSessions.active, true),
        gt(checkinSessions.expiresAt, new Date()),
        or(
          eq(checkinSessions.singleUse, false),
          isNull(checkinSessions.consumedAt),
        ),
      ),
    )
    .limit(1);

  return rows.length === 1;
}

/**
 * Validate a token and, for a single-use (NFC) session, atomically burn it.
 * Called when a challenge is issued rather than at final check-in, so the
 * member keeps the full challenge TTL to connect a wallet and sign.
 *
 * The UPDATE ... WHERE consumed_at IS NULL is the race guard: two requests
 * carrying the same tapped token, only one comes back with a row.
 */
export async function claimSessionToken(
  db: AppDb,
  args: { meetingId: string; token: string },
): Promise<boolean> {
  const now = new Date();
  const burned = await db
    .update(checkinSessions)
    .set({ consumedAt: now })
    .where(
      and(
        eq(checkinSessions.meetingId, args.meetingId),
        eq(checkinSessions.token, args.token),
        eq(checkinSessions.active, true),
        eq(checkinSessions.singleUse, true),
        gt(checkinSessions.expiresAt, now),
        isNull(checkinSessions.consumedAt),
      ),
    )
    .returning({ id: checkinSessions.id });

  if (burned.length === 1) return true;

  // Not a live single-use token. Either it is a shared QR session (valid, and
  // nothing to burn) or it is spent/expired/wrong — validate decides which.
  return validateSessionToken(db, args);
}
