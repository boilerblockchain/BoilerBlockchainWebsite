import { describe, it, expect, afterEach } from "vitest";
import {
  claimSessionToken,
  mintSingleUseSession,
  validateSessionToken,
} from "@/lib/checkin/session";
import { resolveActiveMeeting } from "@/lib/checkin/nfcSession";
import { createTestDb, seedMeeting, seedSession } from "./helpers";
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

describe("resolveActiveMeeting (which meeting a tap belongs to)", () => {
  it("finds the running meeting", async () => {
    const { db, meetingId } = await setup();
    const found = await resolveActiveMeeting(db);
    expect(found?.id).toBe(meetingId);
  });

  it("returns null when nothing is active", async () => {
    const t = await createTestDb();
    close = t.close;
    await seedMeeting(t.db, { status: "draft" });
    expect(await resolveActiveMeeting(t.db)).toBeNull();
  });

  it("prefers the most recently started meeting when two overlap", async () => {
    const { db } = await setup();
    const later = await seedMeeting(db, { name: "Later" });
    const found = await resolveActiveMeeting(db);
    expect(found?.id).toBe(later);
  });
});

describe("single-use NFC sessions", () => {
  it("mints a distinct token for every tap", async () => {
    const { db, meetingId } = await setup();
    const a = await mintSingleUseSession(db, { meetingId, ttlSeconds: 120 });
    const b = await mintSingleUseSession(db, { meetingId, ttlSeconds: 120 });
    expect(a.token).not.toBe(b.token);
  });

  it("does not invalidate an earlier tap still being signed", async () => {
    const { db, meetingId } = await setup();
    const first = await mintSingleUseSession(db, { meetingId, ttlSeconds: 120 });
    await mintSingleUseSession(db, { meetingId, ttlSeconds: 120 });
    // The member who tapped first is mid-signature when the next person taps.
    expect(await validateSessionToken(db, { meetingId, token: first.token })).toBe(
      true,
    );
  });

  it("burns the token on first claim, so a forwarded link is dead", async () => {
    const { db, meetingId } = await setup();
    const { token } = await mintSingleUseSession(db, { meetingId, ttlSeconds: 120 });

    expect(await claimSessionToken(db, { meetingId, token })).toBe(true);
    // Whoever the tapper forwarded it to gets nothing.
    expect(await claimSessionToken(db, { meetingId, token })).toBe(false);
    expect(await validateSessionToken(db, { meetingId, token })).toBe(false);
  });

  it("only one of two racing claims on the same tap wins", async () => {
    const { db, meetingId } = await setup();
    const { token } = await mintSingleUseSession(db, { meetingId, ttlSeconds: 120 });

    const results = await Promise.all([
      claimSessionToken(db, { meetingId, token }),
      claimSessionToken(db, { meetingId, token }),
    ]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("rejects an expired tap token", async () => {
    const { db, meetingId } = await setup();
    const { token } = await mintSingleUseSession(db, { meetingId, ttlSeconds: -1 });
    expect(await claimSessionToken(db, { meetingId, token })).toBe(false);
  });

  it("leaves a shared QR session reusable across the room", async () => {
    const { db, meetingId } = await setup();
    const token = await seedSession(db, meetingId, { expiresInMs: 30_000 });

    expect(await claimSessionToken(db, { meetingId, token })).toBe(true);
    // Everyone else scanning the same projected code still gets through.
    expect(await claimSessionToken(db, { meetingId, token })).toBe(true);
  });
});
