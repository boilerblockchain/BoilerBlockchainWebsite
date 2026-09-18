import { base, baseSepolia } from "viem/chains";
import type { Chain } from "viem";

/**
 * Supported chains. We no longer write on-chain, but the chain id is still part
 * of the EIP-712 signing domain (so a signature for one network can't be
 * replayed on another) and the public client uses it for ERC-1271 checks.
 */
export interface ChainConfig {
  chainId: number;
  name: string;
  viemChain: Chain;
  /** Default public RPC; overridden by RPC_URL env on the server. */
  defaultRpcUrl: string;
}

export const CHAINS: Record<number, ChainConfig> = {
  [baseSepolia.id]: {
    chainId: baseSepolia.id, // 84532
    name: "Base Sepolia",
    viemChain: baseSepolia,
    defaultRpcUrl: "https://sepolia.base.org",
  },
  [base.id]: {
    chainId: base.id, // 8453
    name: "Base",
    viemChain: base,
    defaultRpcUrl: "https://mainnet.base.org",
  },
};

export function getChainConfig(chainId: number): ChainConfig {
  const cfg = CHAINS[chainId];
  if (!cfg) {
    throw new Error(
      `Unsupported chainId ${chainId}. Supported: ${Object.keys(CHAINS).join(", ")}`,
    );
  }
  return cfg;
}
