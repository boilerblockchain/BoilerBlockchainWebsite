import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { meetings } from "@/lib/db/schema";
import { requireOfficer } from "@/lib/auth";
import { ensureActiveSession } from "@/lib/checkin/session";
import { serverEnv } from "@/lib/env";
import { withBasePath } from "@/lib/basePath";
import { json, errorResponse } from "@/lib/http";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Return the current rotating check-in session token + QR target URL.
 * The officer dashboard polls this; because the token has a short TTL it
 * rotates automatically, so old screenshots stop working.
 */
/**
 * Base URL for QR links.
 *
 * In production the app is reached through a rewrite from the main site, so
 * the inbound host is the proxy target, not the URL a phone should open.
 * NEXT_PUBLIC_APP_URL therefore wins when it is set. Without it we fall back
 * to the request, which is what makes localhost and LAN-IP dev work with no
 * configuration.
 */
function requestOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/+$/, "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : serverEnv.appUrl;
}

export async function GET(req: Request, { params }: Ctx) {
  try {
    await requireOfficer();
    const { id } = await params;

    const [meeting] = await db
      .select({ id: meetings.id, status: meetings.status })
      .from(meetings)
      .where(eq(meetings.id, id))
      .limit(1);
    if (!meeting) return json({ error: "Meeting not found." }, 404);
    if (meeting.status !== "active") {
      return json(
        { error: "Start the meeting before generating a check-in code." },
        409,
      );
    }

    const session = await ensureActiveSession(db, {
      meetingId: id,
      ttlSeconds: serverEnv.sessionTokenTtlSeconds,
      method: "QR",
    });

    const checkInUrl = `${requestOrigin(req)}${withBasePath(`/checkin/${id}`)}?token=${session.token}`;
    return json({
      token: session.token,
      expiresAt: session.expiresAt,
      checkInUrl,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
