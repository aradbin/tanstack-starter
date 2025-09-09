import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { relations } from "drizzle-orm"
import { organizations } from "./users"

export const eventsTypes = pgTable("event_types", {
  id: table.text().primaryKey(),
  name: table.text().notNull().unique(),
  parentId: table
    .text("parent_id")
    .references(() => eventsTypes.id, { onDelete: "cascade" }),
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
  attachments: table.text(),
  metadata: table.jsonb(),
  typeId: table
    .text("type_id")
    .notNull()
    .references(() => eventsTypes.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const eventParticipants = pgTable("event_participants", {
  id: table.text().primaryKey(),
  role: table.text(), // organizer, attendee
  participantType: table.text("participant_type").notNull(), // employee, guest, customer, contact, asset
  participantId: table.text("participant_id").notNull(),
  eventId: table
    .text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const eventRelations = relations(events, ({ one, many }) => ({
  eventParticipants: many(eventParticipants),
  type: one(eventsTypes, {
    fields: [events.typeId],
    references: [eventsTypes.id],
  }),
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
}))

export const eventParticipantRelations = relations(
  eventParticipants,
  ({ one }) => ({
    event: one(events, {
      fields: [eventParticipants.eventId],
      references: [events.id],
    }),
  })
)
