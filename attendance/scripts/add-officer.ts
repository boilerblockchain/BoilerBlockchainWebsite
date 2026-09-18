import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { isAddress } from "viem";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../lib/db/schema";
import { officers } from "../lib/db/schema";

/**
 * Add or update an officer in the allowlist.
 *
 *   npm run add-officer -- 0xWalletAddress [officer|admin] ["Label"]
 */
async function main() {
  const address = process.argv[2];
  const role = (process.argv[3] as "officer" | "admin") ?? "officer";
  const label = process.argv[4];

  if (!address || !isAddress(address)) {
    console.error("Usage: npm run add-officer -- 0xAddress [officer|admin] [label]");
    process.exit(1);
  }
  if (role !== "officer" && role !== "admin") {
    console.error("Role must be 'officer' or 'admin'.");
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client, { schema });

  await db
    .insert(officers)
    .values({ address: address.toLowerCase(), role, label })
    .onConflictDoUpdate({
      target: officers.address,
      set: { role, label },
    });

  console.log(`Officer ${address} added/updated as ${role}.`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
