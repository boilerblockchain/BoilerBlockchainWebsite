import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { attendance, meetings, members } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth";
import { json, errorResponse } from "@/lib/http";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** Meeting detail + attendance roster (officer only). */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    await requireOfficer();
    const { id } = await params;
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, id))
      .limit(1);
    if (!meeting) return json({ error: "Meeting not found." }, 404);

    const roster = await db
      .select({
        id: attendance.id,
        walletAddress: attendance.walletAddress,
        name: members.name,
        method: attendance.method,
        checkedInAt: attendance.checkedInAt,
        revoked: attendance.revoked,
      })
      .from(attendance)
      .leftJoin(members, eq(members.address, attendance.walletAddress))
      .where(eq(attendance.meetingId, id))
      .orderBy(desc(attendance.checkedInAt));

    return json({ meeting, roster });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Start or end a meeting (officer only). */
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireOfficer();
    const { id } = await params;
    const body = (await req.json()) as { action?: "start" | "end" };

    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, id))
      .limit(1);
    if (!meeting) return json({ error: "Meeting not found." }, 404);

    const now = new Date();
    if (body.action === "start") {
      // Ensure the check-in window includes "now" so it opens immediately.
      const startsAt = meeting.startsAt > now ? now : meeting.startsAt;
      const endsAt = meeting.endsAt <= now ? new Date(now.getTime() + 2 * 60 * 60 * 1000) : meeting.endsAt;
      const [updated] = await db
        .update(meetings)
        .set({ status: "active", startsAt, endsAt })
        .where(eq(meetings.id, id))
        .returning();
      return json({ meeting: updated });
    }
    if (body.action === "end") {
      const [updated] = await db
        .update(meetings)
        .set({ status: "ended", endsAt: now })
        .where(eq(meetings.id, id))
        .returning();
      return json({ meeting: updated });
    }
    return json({ error: "action must be 'start' or 'end'." }, 400);
  } catch (err) {
    return errorResponse(err);
  }
}
