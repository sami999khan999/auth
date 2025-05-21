ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_unique";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "user_agent" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "ip_address" text;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_ip_agent" ON "refresh_tokens" USING btree ("user_id","user_agent","ip_address");