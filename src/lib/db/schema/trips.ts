import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { vehicles } from "./vehicles"
import { employees } from "./employees"
import { relations } from "drizzle-orm"
import { organizations } from "./users"

export const trips = pgTable("trips", {
  id: table.text().primaryKey(),
  date: table.date().notNull(),
  type: table.text().notNull(), // depot, district
  vehicleId: table
    .text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  driverId: table
    .text("driver_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  helperId: table
    .text("helper_id")
    .references(() => employees.id, { onDelete: "cascade" }),
  attachments: table.text(),
  fuelPrice: table.numeric("fuel_price"),
  items: table.jsonb(),
  expenses: table.jsonb(),
  metadata: table.jsonb(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const tripRelations = relations(trips, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [trips.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(employees, {
    fields: [trips.driverId],
    references: [employees.id],
  }),
  helper: one(employees, {
    fields: [trips.helperId],
    references: [employees.id],
  }),
}))
