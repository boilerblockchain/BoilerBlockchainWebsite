import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { privateKeyToAccount } from "viem/accounts";
import type { PrivateKeyAccount } from "viem";
import * as schema from "@/lib/db/schema";
import { meetings, checkinSessions } from "@/lib/db/schema";
import type { AppDb } from "@/lib/db/types";
import { buildCheckInTypedData } from "@/lib/checkin/typedData";

export const TEST_CHAIN_ID = 84532;

/** Fresh in-memory Postgres with the real migrations applied. */
export async function createTestDb(): Promise<{
  db: AppDb;
  close: () => Promise<void>;
}> {
  const pg = new PGlite();
  const db = drizzle(pg, { schema });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await migrate(db as any, { migrationsFolder: "./drizzle" });
  return {
    db: db as unknown as AppDb,
    close: async () => {
      await pg.close();
    },
  };
}

/** Insert a meeting (active by default) and return its id. */
export async function seedMeeting(
  db: AppDb,
  opts: Partial<{ status: "draft" | "active" | "ended"; name: string }> = {},
): Promise<string> {
  const now = Date.now();
  const [m] = await db
    .insert(meetings)
    .values({
      name: opts.name ?? "Test meeting",
      startsAt: new Date(now - 60_000),
      endsAt: new Date(now + 60 * 60_000),
      status: opts.status ?? "active",
      createdBy: "0x0000000000000000000000000000000000000001",
      chainId: TEST_CHAIN_ID,
    })
    .returning({ id: meetings.id });
  return m.id;
}

/** Insert a fresh, valid session token for a meeting. */
export async function seedSession(
  db: AppDb,
  meetingId: string,
  opts: Partial<{ token: string; expiresInMs: number; active: boolean }> = {},
): Promise<string> {
  const token = opts.token ?? `token_${Math.random().toString(16).slice(2)}`;
  await db.insert(checkinSessions).values({
    meetingId,
    method: "QR",
    token,
    expiresAt: new Date(Date.now() + (opts.expiresInMs ?? 30_000)),
    active: opts.active ?? true,
  });
  return token;
}

/** A deterministic test EOA. */
export function testAccount(
  pk: `0x${string}` = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
): PrivateKeyAccount {
  return privateKeyToAccount(pk);
}

/** Produce a valid check-in signature for the given account. */
export async function signCheckIn(
  account: PrivateKeyAccount,
  meetingId: string,
  nonce: string,
): Promise<`0x${string}`> {
  const typed = buildCheckInTypedData({
    meetingId,
    wallet: account.address,
    nonce,
  });
  return account.signTypedData({
    domain: typed.domain,
    types: typed.types,
    primaryType: typed.primaryType,
    message: typed.message,
  });
}
