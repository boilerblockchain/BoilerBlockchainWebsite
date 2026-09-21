import { and, eq } from "drizzle-orm";
import type { PublicClient } from "viem";
import { attendance, meetings, members } from "@/lib/db/schema";
import type { AppDb } from "@/lib/db/types";
import {
  CheckInError,
  type CheckInRequest,
  type CheckInResult,
} from "@/lib/checkin/types";
import { normalizeAddress } from "@/lib/checkin/address";
import { consumeChallenge } from "@/lib/checkin/challenge";
import { verifyCheckInSignature } from "@/lib/checkin/verifySignature";

export interface CheckInDeps {
  db: AppDb;
  /**
   * Optional public client. When provided, enables ERC-1271 verification for
   * smart-contract wallets. EOAs verify without any network access.
   */
  publicClient?: PublicClient;
  now?: () => Date;
}

/**
 * The single, method-agnostic entry point every check-in method funnels into
 * (QR today, NFC later). The "web3" here is purely identity: a wallet signature
 * proves the member controls the address, and attendance is recorded off-chain.
 *
 *   validate meeting → validate session → verify signature → consume nonce
 *   → record attendance (dedup)
 *
 * `method` is passed through and stored but never branches the logic.
 */
export async function checkIn(
  deps: CheckInDeps,
  request: CheckInRequest,
): Promise<CheckInResult> {
  const now = deps.now?.() ?? new Date();
  const wallet = normalizeAddress(request.walletAddress);

  // 1. Meeting must exist.
  const meetingRows = await deps.db
    .select()
    .from(meetings)
    .where(eq(meetings.id, request.meetingId))
    .limit(1);
  if (meetingRows.length === 0) {
    throw new CheckInError("MEETING_NOT_FOUND", "Meeting not found.");
  }
  const meeting = meetingRows[0];

  // 2. Meeting must be active and within its window.
  if (
    meeting.status !== "active" ||
    now < meeting.startsAt ||
    now > meeting.endsAt
  ) {
    throw new CheckInError(
      "MEETING_NOT_ACTIVE",
      "This meeting is not currently open for check-in.",
    );
  }

  // Note: QR freshness is enforced when the challenge (nonce) is issued
  // (/api/checkin/challenge validates the session token). Here we rely on the
  // single-use nonce, so a member's wallet-signing time doesn't race the QR
  // rotation — they get the full challenge TTL to complete signing.

  // 3. Signature must recover to the claimed wallet (no forged addresses).
  const sigOk = await verifyCheckInSignature({
    meetingId: request.meetingId,
    walletAddress: wallet,
    nonce: request.nonce,
    signature: request.signature,
    publicClient: deps.publicClient,
  });
  if (!sigOk) {
    throw new CheckInError(
      "SIGNATURE_INVALID",
      "Signature did not match the connected wallet.",
    );
  }

  // 4. Resolve the member's display name. The signature above proves the caller
  //    controls this wallet, so a name written here can't be spoofed for someone
  //    else. A brand-new address must supply a name; a known one keeps its own.
  const [existingMember] = await deps.db
    .select({ name: members.name })
    .from(members)
    .where(eq(members.address, wallet))
    .limit(1);

  if (!existingMember) {
    const name = request.displayName?.trim() ?? "";
    if (!name) {
      throw new CheckInError(
        "MEMBER_NAME_REQUIRED",
        "Please enter your name so we know who's checking in.",
      );
    }
    await deps.db
      .insert(members)
      .values({ address: wallet, name: name.slice(0, 100), createdAt: now, updatedAt: now })
      // Concurrent first check-ins race here; keep whichever name landed first.
      .onConflictDoNothing({ target: members.address });
  }

  // 5. Consume the single-use nonce (atomic; blocks replays).
  const nonceOk = await consumeChallenge(deps.db, {
    nonce: request.nonce,
    meetingId: request.meetingId,
    walletAddress: wallet,
  });
  if (!nonceOk) {
    throw new CheckInError(
      "CHALLENGE_INVALID",
      "This check-in request has already been used or expired.",
    );
  }

  // 6. Record attendance. UNIQUE(meeting, wallet) + onConflictDoNothing makes
  //    duplicate check-ins a no-op rather than an error.
  const inserted = await deps.db
    .insert(attendance)
    .values({
      meetingId: request.meetingId,
      walletAddress: wallet,
      method: request.method,
      checkedInAt: now,
    })
    .onConflictDoNothing({
      target: [attendance.meetingId, attendance.walletAddress],
    })
    .returning({ id: attendance.id });

  if (inserted.length === 0) {
    const existing = await deps.db
      .select({ id: attendance.id })
      .from(attendance)
      .where(
        and(
          eq(attendance.meetingId, request.meetingId),
          eq(attendance.walletAddress, wallet),
        ),
      )
      .limit(1);
    return { attendanceId: existing[0]?.id ?? "", alreadyCheckedIn: true };
  }

  return { attendanceId: inserted[0].id, alreadyCheckedIn: false };
}
