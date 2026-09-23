import { randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { checkinChallenges, meetings } from "@/lib/db/schema";
import type { AppDb } from "@/lib/db/types";
import { normalizeAddress } from "@/lib/checkin/address";

export interface IssuedChallenge {
  nonce: string;
  expiresAt: Date;
}

/**
 * Issue a single-use signing challenge bound to a wallet + meeting.
 * The nonce is high-entropy and only valid for `ttlSeconds`.
 */
export async function issueChallenge(
  db: AppDb,
  args: { meetingId: string; walletAddress: string; ttlSeconds: number },
): Promise<IssuedChallenge> {
  const wallet = normalizeAddress(args.walletAddress);

  // Meeting must exist (FK), but we do NOT require active here — activeness is
  // enforced at check-in time so a stale challenge can't bypass it.
  const meeting = await db
    .select({ id: meetings.id })
    .from(meetings)
    .where(eq(meetings.id, args.meetingId))
    .limit(1);
  if (meeting.length === 0) {
    throw new Error("MEETING_NOT_FOUND");
  }

  const nonce = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + args.ttlSeconds * 1000);

  await db.insert(checkinChallenges).values({
    nonce,
    walletAddress: wallet,
    meetingId: args.meetingId,
    expiresAt,
    used: false,
  });

  return { nonce, expiresAt };
}

/**
 * Atomically consume a challenge: it must exist, be unused, be unexpired, and
 * match the claimed wallet + meeting. The single UPDATE ... WHERE used=false
 * guarantees a nonce can only be consumed once, even under concurrent replays.
 *
 * @returns true if consumed; false if invalid/expired/already used.
 */
export async function consumeChallenge(
  db: AppDb,
  args: { nonce: string; meetingId: string; walletAddress: string },
): Promise<boolean> {
  const wallet = normalizeAddress(args.walletAddress);

  const updated = await db
    .update(checkinChallenges)
    .set({ used: true })
    .where(
      and(
        eq(checkinChallenges.nonce, args.nonce),
        eq(checkinChallenges.used, false),
        eq(checkinChallenges.walletAddress, wallet),
        eq(checkinChallenges.meetingId, args.meetingId),
        gt(checkinChallenges.expiresAt, new Date()),
      ),
    )
    .returning({ nonce: checkinChallenges.nonce });

  return updated.length === 1;
}
