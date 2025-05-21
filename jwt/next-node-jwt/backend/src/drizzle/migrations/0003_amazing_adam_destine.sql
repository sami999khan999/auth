DROP TABLE "roles" CASCADE;--> statement-breakpoint
DROP TABLE "user_roles" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" "roles_enum" DEFAULT 'USER';