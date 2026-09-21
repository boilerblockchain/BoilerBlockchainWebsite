import { and, desc, eq, gte, lte } from "drizzle-orm";
import { meetings } from "@/lib/db/schema";
import type { AppDb } from "@/lib/db/types";

/**
 * NFC session delivery. The sibling of `session.ts` described in
 * NFC_INTEGRATION.md: it is the only method-specific step, and everything
 * downstream (challenge → signature → attendance) is shared with QR.
 *
 * The tag holds one static URL with no meeting id and no token, so it is
 * programmed once and never touched again. Resolving which meeting a tap
 * belongs to happens here, at tap time.
 */

/**
 * The meeting a tap should check into: active, and inside its own window.
 *
 * If two meetings overlap, the one that started most recently wins. Officers
 * running back-to-back sessions therefore get the current one, not the
 * leftover. Returns null when nothing is open, which the route renders as
 * "no meeting is running" rather than a dead link.
 */
export async function resolveActiveMeeting(
  db: AppDb,
  now: Date = new Date(),
): Promise<{ id: string; name: string } | null> {
  const rows = await db
    .select({ id: meetings.id, name: meetings.name })
    .from(meetings)
    .where(
      and(
        eq(meetings.status, "active"),
        lte(meetings.startsAt, now),
        gte(meetings.endsAt, now),
      ),
    )
    .orderBy(desc(meetings.startsAt))
    .limit(1);

  return rows[0] ?? null;
}
