import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { serverEnv } from "@/lib/env";

/**
 * Single shared postgres.js connection + drizzle instance.
 * Cached on globalThis so Next.js hot-reload / serverless reuse doesn't open
 * a new pool on every request.
 */
declare global {
  var __attendanceDb__: ReturnType<typeof createDb> | undefined;
}

function createDb() {
  const client = postgres(serverEnv.databaseUrl, {
    max: 5,
    // Neon/hosted PG requires TLS; postgres.js negotiates from the URL.
    prepare: false,
  });
  return { db: drizzle(client, { schema }), client };
}

const cached = globalThis.__attendanceDb__ ?? createDb();
if (process.env.NODE_ENV !== "production") {
  globalThis.__attendanceDb__ = cached;
}

export const db = cached.db;
export { schema };
