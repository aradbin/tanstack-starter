import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"
import { relations } from "drizzle-orm"

export const partners = pgTable("partners", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text(),
  phone: table.text(),
  address: table.text(),
  image: table.text(),
  type: table.text().notNull(), // individual, limited, partnership
  metadata: table.jsonb(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const partnerRoles = pgTable("partner_roles", {
  id: table.text().primaryKey(),
  role: table.text().notNull(), // contact, customer, vendor, lead
  metadata: table.jsonb(),
  partnerId: table
    .text("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const partnerEntities = pgTable("partner_entities", {
  id: table.text().primaryKey(),
  role: table.text().notNull(), // owner, manager, employee
  metadata: table.jsonb(),
  partnerId: table
    .text("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  entityId: table
    .text("entity_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const partnerRelations = relations(partners, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [partners.organizationId],
    references: [organizations.id],
  }),
  partnerRoles: many(partnerRoles),
  partnerEntities: many(partnerEntities),
}))

export const partnerRoleRelations = relations(partnerRoles, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerRoles.partnerId],
    references: [partners.id],
  }),
  organization: one(organizations, {
    fields: [partnerRoles.organizationId],
    references: [organizations.id],
  }),
}))

export const partnerEntityRelations = relations(partnerEntities, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerEntities.partnerId],
    references: [partners.id],
  }),
  entity: one(partners, {
    fields: [partnerEntities.entityId],
    references: [partners.id],
  }),
  organization: one(organizations, {
    fields: [partnerEntities.organizationId],
    references: [organizations.id],
  }),
}))