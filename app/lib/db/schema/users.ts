import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"

export const users = pgTable("users", {
  id: table.text().primaryKey(),
  email: table.text().notNull().unique(),
  name: table.text().notNull(),
  dob: table.date(),
  avatar: table.text(),
  emailVerified: table
    .boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  metadata: table.jsonb().notNull().default({}),
  ...timestamps,
})

export const sessions = pgTable("sessions", {
  id: table.text().primaryKey(),
  expiresAt: table.timestamp("expires_at").notNull(),
  token: table.text().notNull().unique(),
  ipAddress: table.text("ip_address"),
  userAgent: table.text("user_agent"),
  userId: table
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const accounts = pgTable("accounts", {
  id: table.text().primaryKey(),
  accountId: table.text("account_id").notNull(),
  providerId: table.text("provider_id").notNull(),
  accessToken: table.text("access_token"),
  refreshToken: table.text("refresh_token"),
  idToken: table.text("id_token"),
  accessTokenExpiresAt: table.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: table.timestamp("refresh_token_expires_at"),
  scope: table.text(),
  password: table.text(),
  userId: table
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const verifications = pgTable("verifications", {
  id: table.text().primaryKey(),
  identifier: table.text().notNull(),
  value: table.text().notNull(),
  expiresAt: table.timestamp("expires_at").notNull(),
  ...timestamps,
})
