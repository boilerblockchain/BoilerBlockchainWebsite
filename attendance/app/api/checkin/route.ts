import { db } from "@/lib/db/client";
import { checkIn } from "@/lib/attendanceService";
import { getPublicClient } from "@/lib/server/publicClient";
import { isCheckInMethod } from "@/lib/checkin/types";
import { json, errorResponse } from "@/lib/http";

export const runtime = "nodejs";

/**
 * The single public check-in endpoint. QR and (later) NFC both post here.
 * Verifies the wallet signature + session + single-use nonce, then records
 * attendance in the database.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      meetingId?: string;
      walletAddress?: string;
      method?: string;
      sessionToken?: string;
      nonce?: string;
      signature?: string;
      displayName?: string;
    };

    if (
      !body.meetingId ||
      !body.walletAddress ||
      !body.sessionToken ||
      !body.nonce ||
      !body.signature
    ) {
      return json({ error: "Missing required check-in fields." }, 400);
    }
    const method = body.method ?? "QR";
    if (!isCheckInMethod(method)) {
      return json({ error: `Unsupported check-in method: ${method}` }, 400);
    }

    const result = await checkIn(
      {
        db,
        publicClient: getPublicClient(),
      },
      {
        meetingId: body.meetingId,
        walletAddress: body.walletAddress,
        method,
        sessionToken: body.sessionToken,
        nonce: body.nonce,
        signature: body.signature as `0x${string}`,
        displayName: body.displayName,
      },
    );

    return json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
