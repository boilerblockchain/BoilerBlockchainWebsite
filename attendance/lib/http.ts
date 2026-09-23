import { CheckInError } from "@/lib/checkin/types";

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const CHECKIN_STATUS: Record<CheckInError["code"], number> = {
  MEETING_NOT_FOUND: 404,
  MEETING_NOT_ACTIVE: 409,
  SESSION_INVALID: 410, // Gone: the QR/token is no longer valid
  CHALLENGE_INVALID: 409,
  SIGNATURE_INVALID: 401,
  MEMBER_NAME_REQUIRED: 422, // Unprocessable: a name is needed before we record this new member
  ALREADY_CHECKED_IN: 200,
};

/** Map thrown errors (including the officer-guard Response) to a Response. */
export function errorResponse(err: unknown): Response {
  if (err instanceof Response) return err;
  if (err instanceof CheckInError) {
    return json({ error: err.message, code: err.code }, CHECKIN_STATUS[err.code]);
  }
  const message = err instanceof Error ? err.message : "Unexpected error";
  return json({ error: message }, 400);
}
