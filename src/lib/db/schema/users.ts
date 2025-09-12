import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text().notNull().unique(),
  emailVerified: table.boolean("email_verified").default(false).notNull(),
  image: table.text(),
  role: table.text(),
  banned: table.boolean("banned").default(false),
  banReason: table.text("ban_reason"),
  banExpires: table.date("ban_expires"),
  ...timestamps,
})

export const sessions = pgTable("sessions", {
  id: table.text().primaryKey(),
  expiresAt: table.timestamp("expires_at").notNull(),
  token: table.text().notNull().unique(),
  ipAddress: table.text("ip_address"),
  userAgent: table.text("user_agent"),
  impersonatedBy: table.text("impersonated_by"),
  activeOrganizationId: table.text("active_organization_id"),
  activeTeamId: table.text("active_team_id"),
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

export const organizations = pgTable("organizations", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  slug: table.text().unique(),
  logo: table.text(),
  metadata: table.text(),
  ...timestamps,
})

export const organizationRoles = pgTable("organization_roles", {
  id: table.text("id").primaryKey(),
  role: table.text("role").notNull(),
  permission: table.text("permission").notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const teams = pgTable("teams", {
  id: table.text().primaryKey(),
  name: table.text('name').notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
 ...timestamps,
});

export const teamMembers = pgTable("team_members", {
  id: table.text("id").primaryKey(),
  teamId: table.text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  userId: table.text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const members = pgTable("members", {
  id: table.text().primaryKey(),
  role: table.text().default("member").notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: table
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const memberRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}))

export const invitations = pgTable("invitations", {
  id: table.text().primaryKey(),
  email: table.text().notNull(),
  role: table.text(),
  status: table.text().default("pending").notNull(),
  expiresAt: table.timestamp("expires_at").notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  teamId: table.text('team_id'),
  inviterId: table
    .text("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})
