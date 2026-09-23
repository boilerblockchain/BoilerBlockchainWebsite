ALTER TABLE "checkin_sessions" ADD COLUMN "single_use" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "checkin_sessions" ADD COLUMN "consumed_at" timestamp with time zone;