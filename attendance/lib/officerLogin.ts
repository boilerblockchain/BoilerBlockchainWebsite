/**
 * Isomorphic EIP-712 typed data for officer login. Shared by the browser
 * (signing) and the server (verifying). No server-only imports.
 */
export function buildOfficerLoginTypedData(args: {
  address: `0x${string}`;
  issuedAt: number;
}) {
  return {
    domain: {
      name: "BoilerBlockchainAttendance",
      version: "1",
    },
    types: {
      OfficerLogin: [
        { name: "address", type: "address" },
        { name: "issuedAt", type: "uint256" },
        { name: "statement", type: "string" },
      ],
    } as const,
    primaryType: "OfficerLogin" as const,
    message: {
      address: args.address,
      issuedAt: BigInt(args.issuedAt),
      statement: "Sign in to the Boiler Blockchain attendance dashboard.",
    },
  };
}
