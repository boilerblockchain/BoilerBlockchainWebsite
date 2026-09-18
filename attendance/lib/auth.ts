import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { recoverTypedDataAddress } from "viem";
import { db } from "@/lib/db/client";
import { officers, type Officer } from "@/lib/db/schema";
import { serverEnv } from "@/lib/env";
import { normalizeAddress } from "@/lib/checkin/address";
import { buildOfficerLoginTypedData } from "@/lib/officerLogin";

export const OFFICER_COOKIE = "bb_officer";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8h
const LOGIN_MAX_SKEW_SECONDS = 5 * 60; // login message freshness

interface SessionPayload {
  address: string;
  role: string;
  exp: number; // unix seconds
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(data: string): string {
  return base64url(
    createHmac("sha256", serverEnv.officerSessionSecret).update(data).digest(),
  );
}

function encodeSession(payload: SessionPayload): string {
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(),
    ) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Look up an address in the officer allowlist. */
export async function findOfficer(address: string): Promise<Officer | null> {
  const wallet = normalizeAddress(address);
  const rows = await db
    .select()
    .from(officers)
    .where(eq(officers.address, wallet))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Verify an officer login signature (fresh + recovers to an allowlisted
 * address), and if valid, return an encoded session token to set as a cookie.
 */
export async function verifyOfficerLogin(args: {
  address: string;
  issuedAt: number;
  signature: `0x${string}`;
}): Promise<{ token: string; officer: Officer } | null> {
  const nowSec = Math.floor(Date.now() / 1000);
  if (
    args.issuedAt > nowSec + 30 ||
    args.issuedAt < nowSec - LOGIN_MAX_SKEW_SECONDS
  ) {
    return null; // stale or future-dated login message
  }

  const wallet = normalizeAddress(args.address);
  const officer = await findOfficer(wallet);
  if (!officer) return null;

  const typed = buildOfficerLoginTypedData({
    address: wallet as `0x${string}`,
    issuedAt: args.issuedAt,
  });
  let recovered: string;
  try {
    recovered = await recoverTypedDataAddress({
      domain: typed.domain,
      types: typed.types,
      primaryType: typed.primaryType,
      message: typed.message,
      signature: args.signature,
    });
  } catch {
    return null;
  }
  if (recovered.toLowerCase() !== wallet) return null;

  const token = encodeSession({
    address: wallet,
    role: officer.role,
    exp: nowSec + SESSION_TTL_SECONDS,
  });
  return { token, officer };
}

/** Read the current officer session from the request cookies, or null. */
export async function getSessionOfficer(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(OFFICER_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

/**
 * Guard for officer-only API routes. Returns the session or throws a Response
 * (401) that the route can return directly.
 */
export async function requireOfficer(): Promise<SessionPayload> {
  const session = await getSessionOfficer();
  if (!session) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return session;
}

export { SESSION_TTL_SECONDS };
