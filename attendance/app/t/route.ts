import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { mintSingleUseSession } from "@/lib/checkin/session";
import { resolveActiveMeeting } from "@/lib/checkin/nfcSession";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The NFC tag target. Every tag holds this one URL, forever:
 *
 *     https://attendance.boilerblockchain.org/t
 *
 * A tap lands here, we look up whichever meeting is running, mint a fresh
 * single-use token for this tap alone, and bounce the member into the normal
 * check-in page. The tag never carries a meeting id or a token, so it survives
 * every meeting without being re-encoded, and no two taps produce the same
 * link.
 */
export async function GET() {
  const meeting = await resolveActiveMeeting(db);
  if (!meeting) {
    redirect("/t/closed");
  }

  const session = await mintSingleUseSession(db, {
    meetingId: meeting.id,
    ttlSeconds: serverEnv.nfcSessionTtlSeconds,
    method: "NFC",
  });

  redirect(`/checkin/${meeting.id}?token=${session.token}&method=NFC`);
}
