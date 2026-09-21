/**
 * Isomorphic EIP-712 typed-data definition for a check-in signature.
 * Imported by BOTH the browser (to sign) and the server (to verify) so the
 * two can never drift. No server-only imports here.
 */

export const CHECKIN_DOMAIN_NAME = "BoilerBlockchainAttendance";
export const CHECKIN_DOMAIN_VERSION = "1";

export const CHECKIN_TYPES = {
  CheckIn: [
    { name: "meetingId", type: "string" },
    { name: "wallet", type: "address" },
    { name: "nonce", type: "string" },
  ],
} as const;

export interface CheckInTypedDataArgs {
  meetingId: string;
  wallet: `0x${string}`;
  nonce: string;
}

/**
 * No chainId in the domain on purpose: attendance is off-chain, so the member's
 * wallet can be on any network. The domain name + single-use nonce already scope
 * the signature to this app and this check-in.
 */
export function buildCheckInTypedData({
  meetingId,
  wallet,
  nonce,
}: CheckInTypedDataArgs) {
  return {
    domain: {
      name: CHECKIN_DOMAIN_NAME,
      version: CHECKIN_DOMAIN_VERSION,
    },
    types: CHECKIN_TYPES,
    primaryType: "CheckIn" as const,
    message: { meetingId, wallet, nonce },
  };
}
