import { randomBytes } from "node:crypto";
import { and, desc, eq, gt } from "drizzle-orm";
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
 * Validate a session token presented at check-in: it must exist, be active,
 * be unexpired, and belong to the given meeting. The token itself is NOT proof
 * of attendance — it only proves the QR was fresh and the meeting live.
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
      ),
    )
    .limit(1);

  return rows.length === 1;
}
