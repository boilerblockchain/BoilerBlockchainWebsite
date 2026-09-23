import {
  recoverTypedDataAddress,
  type PublicClient,
} from "viem";
import { buildCheckInTypedData } from "@/lib/checkin/typedData";
import { normalizeAddress } from "@/lib/checkin/address";

export interface VerifyCheckInArgs {
  meetingId: string;
  walletAddress: string;
  nonce: string;
  signature: `0x${string}`;
  /**
   * Optional public client. When provided, enables ERC-1271 verification for
   * smart-contract wallets (e.g. Coinbase Smart Wallet). EOAs verify without
   * any network access via off-chain ecrecover.
   */
  publicClient?: PublicClient;
}

/**
 * Verify the member's EIP-712 signature recovers to the claimed wallet.
 * This is what prevents forging someone else's address: the nonce is bound to
 * a wallet, and only the holder of that wallet's key can produce a matching
 * signature over the typed data.
 */
export async function verifyCheckInSignature(
  args: VerifyCheckInArgs,
): Promise<boolean> {
  const expected = normalizeAddress(args.walletAddress);
  const typed = buildCheckInTypedData({
    meetingId: args.meetingId,
    wallet: expected as `0x${string}`,
    nonce: args.nonce,
  });

  // Fast path: off-chain EOA recovery, no RPC needed.
  try {
    const recovered = await recoverTypedDataAddress({
      domain: typed.domain,
      types: typed.types,
      primaryType: typed.primaryType,
      message: typed.message,
      signature: args.signature,
    });
    if (recovered.toLowerCase() === expected) return true;
  } catch {
    // Fall through to ERC-1271 (e.g. smart-wallet signatures aren't ECDSA).
  }

  // Smart-contract wallet path (ERC-1271 / ERC-6492), requires a client.
  if (args.publicClient) {
    try {
      return await args.publicClient.verifyTypedData({
        address: expected as `0x${string}`,
        domain: typed.domain,
        types: typed.types,
        primaryType: typed.primaryType,
        message: typed.message,
        signature: args.signature,
      });
    } catch {
      return false;
    }
  }

  return false;
}
