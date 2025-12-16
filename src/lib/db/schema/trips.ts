import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"
import { assets } from "./assets"
import { employees } from "./employees"
import { relations } from "drizzle-orm"

export const trips = pgTable("trips", {
  id: table.text().primaryKey(),
  type: table.text().notNull(), // depot, district
  date: table.date().notNull(),
  vehicleId: table.text("vehicle_id").references(() => assets.id, { onDelete: "cascade" }),
  driverId: table.text("driver_id").references(() => employees.id, { onDelete: "cascade" }),
  helperId: table.text("helper_id").references(() => employees.id, { onDelete: "cascade" }),
  items: table.jsonb(), // trip items
  expenses: table.jsonb(), // trip expenses

  count: table.numeric().default("0"), // total trip count
  fuel: table.numeric().default("0"), // total fuel count
  income: table.numeric().default("0"), // total income
  expense: table.numeric().default("0"), // total expense
  
  routes: table.text().notNull(),
  fuelPrice: table.numeric("fuel_price").notNull(),
  metadata: table.jsonb(),
  attachments: table.text(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const tripRelations = relations(trips, ({ one }) => ({
  vehicle: one(assets, {
    fields: [trips.vehicleId],
    references: [assets.id],
  }),
  driver: one(employees, {
    fields: [trips.driverId],
    references: [employees.id],
  }),
  helper: one(employees, {
    fields: [trips.helperId],
    references: [employees.id],
  }),
  organization: one(organizations, {
    fields: [trips.organizationId],
    references: [organizations.id],
  }),
}))