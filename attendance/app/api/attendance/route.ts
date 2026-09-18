import { desc, eq } from "drizzle-orm";
import { isAddress } from "viem";
import { db } from "@/lib/db/client";
import { attendance, meetings } from "@/lib/db/schema";
import { json, errorResponse } from "@/lib/http";
import { normalizeAddress } from "@/lib/checkin/address";

export const runtime = "nodejs";

/** Public: a wallet's attendance history, from the database. */
export async function GET(req: Request) {
  try {
    const address = new URL(req.url).searchParams.get("address");
    if (!address || !isAddress(address)) {
      return json({ error: "Valid ?address= is required." }, 400);
    }

    const rows = await db
      .select({
        id: attendance.id,
        meetingId: attendance.meetingId,
        meetingName: meetings.name,
        method: attendance.method,
        checkedInAt: attendance.checkedInAt,
        revoked: attendance.revoked,
      })
      .from(attendance)
      .innerJoin(meetings, eq(attendance.meetingId, meetings.id))
      .where(eq(attendance.walletAddress, normalizeAddress(address)))
      .orderBy(desc(attendance.checkedInAt));

    return json({ address, attendance: rows });
  } catch (err) {
    return errorResponse(err);
  }
}
