import { describe, it, expect, afterEach } from "vitest";
import { issueChallenge, consumeChallenge } from "@/lib/checkin/challenge";
import { createTestDb, seedMeeting } from "./helpers";
import type { AppDb } from "@/lib/db/types";

let close: (() => Promise<void>) | null = null;
afterEach(async () => {
  await close?.();
  close = null;
});

async function setup(): Promise<{ db: AppDb; meetingId: string }> {
  const t = await createTestDb();
  close = t.close;
  const meetingId = await seedMeeting(t.db);
  return { db: t.db, meetingId };
}

const WALLET = "0x000000000000000000000000000000000000dEaD";

describe("challenge nonce", () => {
  it("can be consumed exactly once", async () => {
    const { db, meetingId } = await setup();
    const { nonce } = await issueChallenge(db, {
      meetingId,
      walletAddress: WALLET,
      ttlSeconds: 60,
    });

    const first = await consumeChallenge(db, { nonce, meetingId, walletAddress: WALLET });
    const second = await consumeChallenge(db, { nonce, meetingId, walletAddress: WALLET });

    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  it("rejects an expired nonce", async () => {
    const { db, meetingId } = await setup();
    const { nonce } = await issueChallenge(db, {
      meetingId,
      walletAddress: WALLET,
      ttlSeconds: -1, // already expired
    });
    const ok = await consumeChallenge(db, { nonce, meetingId, walletAddress: WALLET });
    expect(ok).toBe(false);
  });

  it("rejects a nonce claimed by a different wallet", async () => {
    const { db, meetingId } = await setup();
    const { nonce } = await issueChallenge(db, {
      meetingId,
      walletAddress: WALLET,
      ttlSeconds: 60,
    });
    const ok = await consumeChallenge(db, {
      nonce,
      meetingId,
      walletAddress: "0x0000000000000000000000000000000000000001",
    });
    expect(ok).toBe(false);
  });
});
