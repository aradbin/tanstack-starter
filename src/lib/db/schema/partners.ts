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
  role: table.text().notNull().default("icnQHDZRky9yfegqfrKvvkGebVx12bRn"), // default: customer, contact, vendor
  type: table.text().notNull(), // Individual, Limited, Partnership
  metadata: table.jsonb(),
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
  partnerEntities: many(partnerEntities),
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