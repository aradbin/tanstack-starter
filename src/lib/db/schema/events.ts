import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { relations } from "drizzle-orm"
import { organizations } from "./users"

export const eventTypes = pgTable("event_types", {
  id: table.text().primaryKey(),
  name: table.text().notNull().unique(),
  parentId: table
    .text("parent_id")
    .references(() => eventTypes.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
})

export const events = pgTable("events", {
  id: table.text().primaryKey(),
  title: table.text(),
  description: table.text(),
  from: table.timestamp().notNull(),
  to: table.timestamp().notNull(),
  location: table.text(),
  status: table.text(), // scheduled, completed, canceled, postponed
  attachments: table.text(),
  metadata: table.jsonb(),
  typeId: table
    .text("type_id")
    .notNull()
    .references(() => eventTypes.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const eventEntities = pgTable("event_entities", {
  id: table.text().primaryKey(),
  role: table.text(), // organizer, attendee, speaker, driver, vehicle
  status: table.text(), // invited, confirmed, declined, attended, absent
  entityType: table.text("entity_type").notNull(), // table name: employees, customers, assets
  entityId: table.text("entity_id").notNull(),
  eventId: table
    .text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const eventRelations = relations(events, ({ one, many }) => ({
  eventEntities: many(eventEntities),
  type: one(eventTypes, {
    fields: [events.typeId],
    references: [eventTypes.id],
  }),
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
}))

export const eventEntityRelations = relations(
  eventEntities,
  ({ one }) => ({
    event: one(events, {
      fields: [eventEntities.eventId],
      references: [events.id],
    }),
  })
)
