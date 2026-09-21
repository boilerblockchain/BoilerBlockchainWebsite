/**
 * Shared check-in contracts. These are method-agnostic on purpose: QR today,
 * NFC later. `method` flows through untouched and is only ever compared, never
 * branched on inside the core attendance logic.
 */

export const CHECK_IN_METHODS = ["QR", "NFC"] as const;
export type CheckInMethod = (typeof CHECK_IN_METHODS)[number];

export function isCheckInMethod(v: unknown): v is CheckInMethod {
  return typeof v === "string" && (CHECK_IN_METHODS as readonly string[]).includes(v);
}

/**
 * The single shape every check-in method resolves to before it hits the
 * shared attendance service. A method-specific layer (QR session, later NFC
 * session) is responsible for producing/validating `sessionToken`; everything
 * downstream is identical.
 */
export interface CheckInRequest {
  meetingId: string;
  walletAddress: string;
  method: CheckInMethod;
  /** The rotating session token carried by the QR (or NFC tag, later). */
  sessionToken: string;
  /** Single-use signing nonce the member signed. */
  nonce: string;
  /** EIP-712 signature over the check-in typed data. */
  signature: `0x${string}`;
  /**
   * The member's self-declared display name. Required the first time an address
   * checks in; ignored (the stored name is kept) once the address is known.
   */
  displayName?: string;
}

export interface CheckInResult {
  attendanceId: string;
  alreadyCheckedIn: boolean;
}

/** A typed error the API layer maps to HTTP status codes. */
export class CheckInError extends Error {
  constructor(
    public readonly code:
      | "MEETING_NOT_FOUND"
      | "MEETING_NOT_ACTIVE"
      | "SESSION_INVALID"
      | "CHALLENGE_INVALID"
      | "SIGNATURE_INVALID"
      | "MEMBER_NAME_REQUIRED"
      | "ALREADY_CHECKED_IN",
    message: string,
  ) {
    super(message);
    this.name = "CheckInError";
  }
}
