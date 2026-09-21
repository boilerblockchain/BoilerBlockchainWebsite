/**
 * Centralized environment access. Server-only values (private key, DB url)
 * must never be imported into client components. Keep this file server-side.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

function optionalInt(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export const serverEnv = {
  get chainId(): number {
    return optionalInt("CHAIN_ID", 84532);
  },
  get rpcUrl(): string {
    return process.env.RPC_URL ?? "https://sepolia.base.org";
  },
  /**
   * HMAC key for officer session cookies. Falls back to a value derived from
   * the database URL so the app works out of the box; set OFFICER_SESSION_SECRET
   * explicitly in production for a stable, dedicated secret.
   */
  get officerSessionSecret(): string {
    return process.env.OFFICER_SESSION_SECRET ?? required("DATABASE_URL");
  },
  get databaseUrl(): string {
    return required("DATABASE_URL");
  },
  get appUrl(): string {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get sessionTokenTtlSeconds(): number {
    // Long enough to cover scan → connect wallet → sign on a phone. The QR
    // rotates at half this (see ensureActiveSession), so a freshly scanned
    // code always has at least half its life remaining.
    return optionalInt("SESSION_TOKEN_TTL_SECONDS", 240);
  },
  get challengeTtlSeconds(): number {
    return optionalInt("CHALLENGE_TTL_SECONDS", 300);
  },
  /**
   * Lifetime of the single-use token minted by one NFC tap. Shorter than the
   * QR session: it covers tap → page load → connect wallet, after which the
   * challenge nonce takes over.
   */
  get nfcSessionTtlSeconds(): number {
    return optionalInt("NFC_SESSION_TTL_SECONDS", 120);
  },
};

/** Values safe to expose to the browser. */
export const publicChainId = (): number => {
  const v = process.env.NEXT_PUBLIC_CHAIN_ID;
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : 84532;
};
