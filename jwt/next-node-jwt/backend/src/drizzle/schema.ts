import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles_enum", ["ADMIN", "USER"]);

export const UsersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  user_role: rolesEnum("user_role").default("USER"),
  password_hash: text("password_hash").notNull(),
  is_email_valid: boolean("is_email_valid").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const RefreshTokensTable = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),

    token_hash: text("token_hash").notNull().unique(),
    user_agent: text("user_agent").default(""),
    ip_address: text("ip_address"),
    is_revoked: boolean("is_revoked").default(false),
    expires_at: timestamp("expires_at").notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      unique_user_ip_agent: uniqueIndex("unique_user_ip_agent").on(
        table.user_id,
        table.user_agent,
        table.ip_address
      ),
    };
  }
);

export const RefreshTOkenTableRelation = relations(
  RefreshTokensTable,
  ({ one }) => {
    return {
      user: one(UsersTable, {
        fields: [RefreshTokensTable.user_id],
        references: [UsersTable.id],
      }),
    };
  }
);
