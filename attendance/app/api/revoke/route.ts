import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { attendance } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth";
import { json, errorResponse } from "@/lib/http";

export const runtime = "nodejs";

/** Revoke a check-in (officer action): flags the attendance row as revoked. */
export async function POST(req: Request) {
  try {
    await requireOfficer();
    const body = (await req.json()) as { attendanceId?: string };
    if (!body.attendanceId) {
      return json({ error: "attendanceId is required." }, 400);
    }

    const [row] = await db
      .select({ id: attendance.id })
      .from(attendance)
      .where(eq(attendance.id, body.attendanceId))
      .limit(1);
    if (!row) return json({ error: "Attendance record not found." }, 404);

    await db
      .update(attendance)
      .set({ revoked: true })
      .where(eq(attendance.id, body.attendanceId));

    return json({ revoked: true });
  } catch (err) {
    return errorResponse(err);
  }
}
