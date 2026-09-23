import { cookies } from "next/headers";
import { json, errorResponse } from "@/lib/http";
import {
  verifyOfficerLogin,
  getSessionOfficer,
  OFFICER_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/auth";

export const runtime = "nodejs";

/** Whoami — returns the current officer session, if any. */
export async function GET() {
  const session = await getSessionOfficer();
  if (!session) return json({ authenticated: false });
  return json({
    authenticated: true,
    address: session.address,
    role: session.role,
  });
}

/** Log in with an EIP-712 signature from an allowlisted officer wallet. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      address?: string;
      issuedAt?: number;
      signature?: string;
    };
    if (!body.address || !body.issuedAt || !body.signature) {
      return json({ error: "Missing address, issuedAt, or signature." }, 400);
    }

    const result = await verifyOfficerLogin({
      address: body.address,
      issuedAt: body.issuedAt,
      signature: body.signature as `0x${string}`,
    });
    if (!result) {
      return json({ error: "Not an authorized officer or stale signature." }, 401);
    }

    const store = await cookies();
    store.set(OFFICER_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return json({
      authenticated: true,
      address: result.officer.address,
      role: result.officer.role,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Log out. */
export async function DELETE() {
  const store = await cookies();
  store.delete(OFFICER_COOKIE);
  return json({ authenticated: false });
}
