import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { meetings } from "@/lib/db/schema";
import { validateSessionToken } from "@/lib/checkin/session";
import { json, errorResponse } from "@/lib/http";

export const runtime = "nodejs";

/**
 * Public: is this QR session token still valid for check-in?
 * The token is NOT proof of attendance — this only tells the check-in page
 * whether to proceed to wallet signing.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const meetingId = url.searchParams.get("meetingId");
    const token = url.searchParams.get("token");
    if (!meetingId || !token) {
      return json({ valid: false, error: "Missing meetingId or token." }, 400);
    }

    const [meeting] = await db
      .select({ name: meetings.name, status: meetings.status })
      .from(meetings)
      .where(eq(meetings.id, meetingId))
      .limit(1);
    if (!meeting) return json({ valid: false, error: "Meeting not found." }, 404);

    const active = meeting.status === "active";
    const tokenOk = active && (await validateSessionToken(db, { meetingId, token }));

    return json({
      valid: tokenOk,
      meetingName: meeting.name,
      meetingStatus: meeting.status,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
