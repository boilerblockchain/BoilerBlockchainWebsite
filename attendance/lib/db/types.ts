import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "./schema";

/**
 * The drizzle database type used across the core services. Route handlers pass
 * the real postgres.js-backed instance; tests pass an in-memory PGlite instance
 * cast to this type (structurally compatible for the query surface we use).
 */
export type AppDb = PostgresJsDatabase<typeof schema>;
