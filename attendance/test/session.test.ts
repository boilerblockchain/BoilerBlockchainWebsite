import { describe, it, expect, afterEach } from "vitest";
import { validateSessionToken } from "@/lib/checkin/session";
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

describe("validateSessionToken (QR freshness gate)", () => {
  it("accepts a current, unexpired token for the meeting", async () => {
    const { db, meetingId } = await setup();
    const token = await seedSession(db, meetingId, { expiresInMs: 30_000 });
    expect(await validateSessionToken(db, { meetingId, token })).toBe(true);
  });

  it("rejects an expired token", async () => {
    const { db, meetingId } = await setup();
    const token = await seedSession(db, meetingId, { expiresInMs: -1000 });
    expect(await validateSessionToken(db, { meetingId, token })).toBe(false);
  });

  it("rejects a token from a different meeting", async () => {
    const { db, meetingId } = await setup();
    const token = await seedSession(db, meetingId, { expiresInMs: 30_000 });
    const other = await seedMeeting(db, { name: "Other" });
    expect(await validateSessionToken(db, { meetingId: other, token })).toBe(false);
  });

  it("rejects an unknown token", async () => {
    const { db, meetingId } = await setup();
    expect(
      await validateSessionToken(db, { meetingId, token: "nope" }),
    ).toBe(false);
  });
});
