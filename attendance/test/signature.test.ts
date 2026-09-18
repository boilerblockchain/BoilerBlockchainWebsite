import { describe, it, expect } from "vitest";
import { verifyCheckInSignature } from "@/lib/checkin/verifySignature";
import { testAccount, signCheckIn } from "./helpers";

const MEETING = "11111111-1111-1111-1111-111111111111";
const NONCE = "deadbeef";

describe("verifyCheckInSignature", () => {
  it("accepts a signature that recovers to the claimed wallet", async () => {
    const account = testAccount();
    const signature = await signCheckIn(account, MEETING, NONCE);
    const ok = await verifyCheckInSignature({
      meetingId: MEETING,
      walletAddress: account.address,
      nonce: NONCE,
      signature,
    });
    expect(ok).toBe(true);
  });

  it("rejects when the claimed wallet differs from the signer (forged address)", async () => {
    const signer = testAccount();
    const signature = await signCheckIn(signer, MEETING, NONCE);
    const someoneElse = "0x000000000000000000000000000000000000dEaD";
    const ok = await verifyCheckInSignature({
      meetingId: MEETING,
      walletAddress: someoneElse,
      nonce: NONCE,
      signature,
    });
    expect(ok).toBe(false);
  });

  it("rejects when the nonce is tampered with", async () => {
    const account = testAccount();
    const signature = await signCheckIn(account, MEETING, NONCE);
    const ok = await verifyCheckInSignature({
      meetingId: MEETING,
      walletAddress: account.address,
      nonce: "not-the-signed-nonce",
      signature,
    });
    expect(ok).toBe(false);
  });
});
