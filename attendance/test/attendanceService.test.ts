import { describe, it, expect, afterEach } from "vitest";
import { eq } from "drizzle-orm";
import { checkIn, type CheckInDeps } from "@/lib/attendanceService";
import { attendance, members } from "@/lib/db/schema";
import { issueChallenge } from "@/lib/checkin/challenge";
import type { CheckInRequest } from "@/lib/checkin/types";
import type { AppDb } from "@/lib/db/types";
import {
  createTestDb,
  seedMeeting,
  seedSession,
  testAccount,
  signCheckIn,
} from "./helpers";

let close: (() => Promise<void>) | null = null;
afterEach(async () => {
  await close?.();
  close = null;
});

async function harness() {
  const t = await createTestDb();
  close = t.close;
  const db = t.db;
  const meetingId = await seedMeeting(db);
  const token = await seedSession(db, meetingId);
  const account = testAccount();
  const deps: CheckInDeps = { db };
  return { db, meetingId, token, account, deps };
}

async function freshRequest(
  db: AppDb,
  meetingId: string,
  token: string,
  account: ReturnType<typeof testAccount>,
): Promise<CheckInRequest> {
  const { nonce } = await issueChallenge(db, {
    meetingId,
    walletAddress: account.address,
    ttlSeconds: 120,
  });
  const signature = await signCheckIn(account, meetingId, nonce);
  return {
    meetingId,
    walletAddress: account.address,
    method: "QR" as const,
    sessionToken: token,
    nonce,
    signature,
    displayName: "Test Member",
  };
}

describe("attendanceService.checkIn", () => {
  it("records attendance on a valid check-in", async () => {
    const { db, meetingId, token, account, deps } = await harness();
    const result = await checkIn(deps, await freshRequest(db, meetingId, token, account));

    expect(result.alreadyCheckedIn).toBe(false);
    expect(result.attendanceId).toBeTruthy();

    const rows = await db
      .select()
      .from(attendance)
      .where(eq(attendance.meetingId, meetingId));
    expect(rows).toHaveLength(1);
    expect(rows[0].walletAddress).toBe(account.address.toLowerCase());
    expect(rows[0].method).toBe("QR");
  });

  it("prevents duplicate check-ins for the same wallet + meeting", async () => {
    const { db, meetingId, token, account, deps } = await harness();

    const first = await checkIn(deps, await freshRequest(db, meetingId, token, account));
    const second = await checkIn(deps, await freshRequest(db, meetingId, token, account));

    expect(first.alreadyCheckedIn).toBe(false);
    expect(second.alreadyCheckedIn).toBe(true);

    const rows = await db
      .select()
      .from(attendance)
      .where(eq(attendance.meetingId, meetingId));
    expect(rows).toHaveLength(1);
  });

  it("rejects a forged wallet (signature mismatch)", async () => {
    const { db, meetingId, token, account, deps } = await harness();
    const req = await freshRequest(db, meetingId, token, account);
    req.walletAddress = "0x000000000000000000000000000000000000dEaD";

    await expect(checkIn(deps, req)).rejects.toMatchObject({
      code: "SIGNATURE_INVALID",
    });
  });

  it("rejects a reused nonce", async () => {
    const { db, meetingId, token, account, deps } = await harness();
    const req = await freshRequest(db, meetingId, token, account);
    await checkIn(deps, req); // consumes the nonce

    const other = testAccount(
      "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    );
    const replay = {
      meetingId,
      walletAddress: other.address,
      method: "QR" as const,
      sessionToken: token,
      nonce: req.nonce,
      signature: await signCheckIn(other, meetingId, req.nonce),
      displayName: "Other Member",
    };
    await expect(checkIn(deps, replay)).rejects.toMatchObject({
      code: "CHALLENGE_INVALID",
    });
  });

  it("requires a name the first time a wallet checks in", async () => {
    const { db, meetingId, token, account, deps } = await harness();
    const req = await freshRequest(db, meetingId, token, account);
    req.displayName = "   "; // whitespace-only is treated as missing

    await expect(checkIn(deps, req)).rejects.toMatchObject({
      code: "MEMBER_NAME_REQUIRED",
    });

    const rows = await db.select().from(attendance);
    expect(rows).toHaveLength(0);
  });

  it("stores the name for a new wallet and reuses it on later check-ins", async () => {
    const { db, meetingId, token, account, deps } = await harness();
    const first = await freshRequest(db, meetingId, token, account);
    first.displayName = "Ada Lovelace";
    await checkIn(deps, first);

    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.address, account.address.toLowerCase()));
    expect(member.name).toBe("Ada Lovelace");

    // A later check-in doesn't need to resend the name.
    const second = await freshRequest(db, meetingId, token, account);
    delete second.displayName;
    const result = await checkIn(deps, second);
    expect(result.alreadyCheckedIn).toBe(true);
  });

  it("rejects check-in when the meeting is not active", async () => {
    const t = await createTestDb();
    close = t.close;
    const db = t.db;
    const meetingId = await seedMeeting(db, { status: "ended" });
    const token = await seedSession(db, meetingId);
    const account = testAccount();
    const deps: CheckInDeps = { db };
    const req = await freshRequest(db, meetingId, token, account);

    await expect(checkIn(deps, req)).rejects.toMatchObject({
      code: "MEETING_NOT_ACTIVE",
    });
  });
});
