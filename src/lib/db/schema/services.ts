import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { relations } from "drizzle-orm"
import { organizations } from "./users"

export const services = pgTable("services", {
  id: table.text().primaryKey(),
  title: table.text(),
  description: table.text(),
  from: table.timestamp().notNull(),
  to: table.timestamp().notNull(),
  status: table.text(), // scheduled, completed, canceled, postponed
  attachments: table.text(),
  metadata: table.jsonb(),
  typeId: table.text("type_id").notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const serviceEntities = pgTable("service_entities", {
  id: table.text().primaryKey(),
  role: table.text(), // organizer, attendee, speaker, driver, vehicle
  status: table.text(), // invited, confirmed, declined, attended, absent
  entityType: table.text("entity_type").notNull(), // table name: employees, customers, assets
  entityId: table.text("entity_id").notNull(),
  serviceId: table
    .text("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const serviceRelations = relations(services, ({ one, many }) => ({
  serviceEntities: many(serviceEntities),
  organization: one(organizations, {
    fields: [services.organizationId],
    references: [organizations.id],
  }),
}))

export const serviceEntityRelations = relations(
  serviceEntities,
  ({ one }) => ({
    service: one(services, {
      fields: [serviceEntities.serviceId],
      references: [services.id],
    }),
  })
)
