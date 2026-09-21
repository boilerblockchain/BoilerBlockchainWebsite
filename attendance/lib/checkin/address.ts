import { getAddress, isAddress } from "viem";

/**
 * Lowercase, validated wallet address for storage + comparison.
 * Throws on malformed input so bad addresses never reach the DB.
 */
export function normalizeAddress(address: string): string {
  if (!isAddress(address)) {
    throw new Error(`Invalid wallet address: ${address}`);
  }
  return address.toLowerCase();
}

/** Checksummed form for display / on-chain calls. */
export function checksumAddress(address: string): `0x${string}` {
  return getAddress(address);
}
