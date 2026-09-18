CREATE TYPE "public"."check_in_method" AS ENUM('QR', 'NFC');--> statement-breakpoint
CREATE TYPE "public"."meeting_status" AS ENUM('draft', 'active', 'ended');--> statement-breakpoint
CREATE TYPE "public"."officer_role" AS ENUM('officer', 'admin');--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"wallet_address" text NOT NULL,
	"method" "check_in_method" NOT NULL,
	"checked_in_at" timestamp with time zone DEFAULT now() NOT NULL,
	"eas_uid" text,
	"revoked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "attendance_meeting_wallet_unique" UNIQUE("meeting_id","wallet_address")
);
--> statement-breakpoint
CREATE TABLE "checkin_challenges" (
	"nonce" text PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"meeting_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checkin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"method" "check_in_method" DEFAULT 'QR' NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "checkin_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" "meeting_status" DEFAULT 'draft' NOT NULL,
	"created_by" text NOT NULL,
	"chain_id" integer NOT NULL,
	"schema_uid" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "officers" (
	"address" text PRIMARY KEY NOT NULL,
	"role" "officer_role" DEFAULT 'officer' NOT NULL,
	"label" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_challenges" ADD CONSTRAINT "checkin_challenges_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_sessions" ADD CONSTRAINT "checkin_sessions_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attendance_wallet_idx" ON "attendance" USING btree ("wallet_address");--> statement-breakpoint
CREATE INDEX "checkin_challenges_wallet_idx" ON "checkin_challenges" USING btree ("wallet_address");--> statement-breakpoint
CREATE INDEX "checkin_sessions_meeting_idx" ON "checkin_sessions" USING btree ("meeting_id");