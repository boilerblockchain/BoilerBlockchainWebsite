import "server-only";
import { createPublicClient, http, type PublicClient } from "viem";
import { getChainConfig } from "@/lib/chains";
import { serverEnv } from "@/lib/env";

let cached: PublicClient | undefined;

/** Shared viem public client for the configured chain (server-side). */
export function getPublicClient(): PublicClient {
  if (cached) return cached;
  const cfg = getChainConfig(serverEnv.chainId);
  cached = createPublicClient({
    chain: cfg.viemChain,
    transport: http(serverEnv.rpcUrl),
  });
  return cached;
}
