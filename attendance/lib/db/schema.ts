import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

/**
 * `method` is shared by check-in sessions and attendance rows. Adding a new
 * check-in method later (e.g. "NFC") is a single `ALTER TYPE ... ADD VALUE`
 * migration — no table or logic changes. See NFC_INTEGRATION.md.
 */
export const checkInMethod = pgEnum("check_in_method", ["QR", "NFC"]);

export const meetingStatus = pgEnum("meeting_status", [
  "draft",
  "active",
  "ended",
]);

/**
 * A wallet's self-declared display name, captured the first time it checks in.
 * Lets officers see who an address belongs to instead of a raw 0x… string.
 * The name is only ever written alongside a signature-verified check-in, so it
 * can't be spoofed for an address the caller doesn't control.
 */
export const members = pgTable("members", {
  // Wallet address, stored lowercased.
  address: text("address").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const meetings = pgTable("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  status: meetingStatus("status").notNull().default("draft"),
  createdBy: text("created_by").notNull(), // officer wallet (lowercased)
  chainId: integer("chain_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * A rotating check-in session. The QR encodes the meeting id + `token`.
 * Only the most recent, unexpired, active session token is accepted, so a
 * screenshot of an older QR stops working once it rotates/expires.
 *
 * NFC taps mint a `singleUse` session instead of sharing the rotating one:
 * the tag holds no token, so every tap gets its own, and `consumedAt` is
 * stamped the first time it buys a challenge. Forwarding the redirected link
 * therefore costs the sender their own check-in.
 */
export const checkinSessions = pgTable(
  "checkin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    method: checkInMethod("method").notNull().default("QR"),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    active: boolean("active").notNull().default(true),
    // One tap, one challenge. QR sessions are shared by the room and stay false.
    singleUse: boolean("single_use").notNull().default(false),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("checkin_sessions_meeting_idx").on(t.meetingId)],
);

/**
 * A single-use signing challenge (nonce) bound to a wallet + meeting.
 * The member signs it; the backend verifies the signature recovers to the
 * claimed wallet, then flips `used` so it can never be replayed.
 */
export const checkinChallenges = pgTable(
  "checkin_challenges",
  {
    // The nonce itself is the primary key.
    nonce: text("nonce").primaryKey(),
    walletAddress: text("wallet_address").notNull(), // lowercased
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    used: boolean("used").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("checkin_challenges_wallet_idx").on(t.walletAddress)],
);

/**
 * Attendance records. A row is written only after the member's wallet signature
 * is verified. UNIQUE(meeting_id, wallet_address) makes duplicate check-ins
 * impossible. Officers can revoke a bad check-in with the `revoked` flag.
 */
export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    walletAddress: text("wallet_address").notNull(), // lowercased
    method: checkInMethod("method").notNull(),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    revoked: boolean("revoked").notNull().default(false),
  },
  (t) => [
    unique("attendance_meeting_wallet_unique").on(t.meetingId, t.walletAddress),
    index("attendance_wallet_idx").on(t.walletAddress),
  ],
);

export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = typeof meetings.$inferInsert;
export type CheckinSession = typeof checkinSessions.$inferSelect;
export type CheckinChallenge = typeof checkinChallenges.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
