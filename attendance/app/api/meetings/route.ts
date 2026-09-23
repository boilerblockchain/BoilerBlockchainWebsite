import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { attendance, meetings } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { json, errorResponse } from "@/lib/http";
import { normalizeAddress } from "@/lib/checkin/address";

export const runtime = "nodejs";

/** List meetings with attendee counts (officer only). */
export async function GET() {
  try {
    await requireOfficer();
    const rows = await db
      .select({
        id: meetings.id,
        name: meetings.name,
        startsAt: meetings.startsAt,
        endsAt: meetings.endsAt,
        status: meetings.status,
        createdBy: meetings.createdBy,
        createdAt: meetings.createdAt,
        attendees: sql<number>`count(${attendance.id})::int`,
      })
      .from(meetings)
      .leftJoin(attendance, eq(attendance.meetingId, meetings.id))
      .groupBy(meetings.id)
      .orderBy(desc(meetings.createdAt));
    return json({ meetings: rows });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Create a meeting (officer only). Starts in `draft`. */
export async function POST(req: Request) {
  try {
    const session = await requireOfficer();
    const body = (await req.json()) as {
      name?: string;
      startsAt?: string;
      endsAt?: string;
    };
    if (!body.name || !body.startsAt || !body.endsAt) {
      return json({ error: "name, startsAt and endsAt are required." }, 400);
    }
    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);
    if (Number.isNaN(+startsAt) || Number.isNaN(+endsAt) || endsAt <= startsAt) {
      return json({ error: "Invalid start/end times." }, 400);
    }

    const [created] = await db
      .insert(meetings)
      .values({
        name: body.name.trim(),
        startsAt,
        endsAt,
        status: "draft",
        createdBy: normalizeAddress(session.address),
        chainId: serverEnv.chainId,
      })
      .returning();

    return json({ meeting: created }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
