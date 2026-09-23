import { eq } from "drizzle-orm";
import { isAddress } from "viem";
import { db } from "@/lib/db/client";
import { members } from "@/lib/db/schema";
import { json, errorResponse } from "@/lib/http";
import { normalizeAddress } from "@/lib/checkin/address";

export const runtime = "nodejs";

/**
 * Public: look up the display name on file for a wallet. Returns `name: null`
 * for an address we've never seen, which the check-in page uses to decide
 * whether to ask a first-time member for their name.
 */
export async function GET(req: Request) {
  try {
    const address = new URL(req.url).searchParams.get("address");
    if (!address || !isAddress(address)) {
      return json({ error: "Valid ?address= is required." }, 400);
    }

    const [member] = await db
      .select({ name: members.name })
      .from(members)
      .where(eq(members.address, normalizeAddress(address)))
      .limit(1);

    return json({ address, name: member?.name ?? null });
  } catch (err) {
    return errorResponse(err);
  }
}
