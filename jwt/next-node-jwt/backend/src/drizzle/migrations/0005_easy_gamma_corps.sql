DROP INDEX "unique_user_ip_agent";--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP COLUMN "user_agent";--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP COLUMN "ip_address";