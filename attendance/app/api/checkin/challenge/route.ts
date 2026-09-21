import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { meetings } from "@/lib/db/schema";
import { claimSessionToken } from "@/lib/checkin/session";
import { issueChallenge } from "@/lib/checkin/challenge";
import { serverEnv } from "@/lib/env";
import { json, errorResponse } from "@/lib/http";
import { normalizeAddress } from "@/lib/checkin/address";

export const runtime = "nodejs";

/**
 * Public: issue a single-use signing challenge (nonce) for a wallet + meeting.
 * Requires a valid, fresh session token so challenges can't be farmed off a
 * stale/forwarded QR. The returned nonce is what the member signs.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      meetingId?: string;
      walletAddress?: string;
      sessionToken?: string;
    };
    if (!body.meetingId || !body.walletAddress || !body.sessionToken) {
      return json(
        { error: "meetingId, walletAddress and sessionToken are required." },
        400,
      );
    }

    const [meeting] = await db
      .select({ status: meetings.status })
      .from(meetings)
      .where(eq(meetings.id, body.meetingId))
      .limit(1);
    if (!meeting) return json({ error: "Meeting not found." }, 404);
    if (meeting.status !== "active") {
      return json({ error: "Meeting is not open for check-in." }, 409);
    }

    // Burns the token when it is single-use (one NFC tap buys one challenge);
    // a shared QR session is only validated.
    const sessionOk = await claimSessionToken(db, {
      meetingId: body.meetingId,
      token: body.sessionToken,
    });
    if (!sessionOk) {
      return json(
        { error: "This check-in code is expired or already used. Scan or tap again." },
        410,
      );
    }

    const { nonce, expiresAt } = await issueChallenge(db, {
      meetingId: body.meetingId,
      walletAddress: normalizeAddress(body.walletAddress),
      ttlSeconds: serverEnv.challengeTtlSeconds,
    });

    return json({ nonce, expiresAt });
  } catch (err) {
    return errorResponse(err);
  }
}
