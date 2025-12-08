import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"
import { assets } from "./assets"
import { employees } from "./employees"

/**
 * Main trips table - stores depot trip information
 */
export const trips = pgTable("trips", {
  id: table.text().primaryKey(),

  // Trip date
  date: table.date().notNull(),

  // Route configuration snapshot at trip creation
  // Stores all available routes as they were when trip was created
  // This allows adding missing trip items later with historical accuracy
  routeConfigSnapshot: table.jsonb("route_config_snapshot").$type<{
    routes: Array<{
      from: string
      to: string
      expense: {
        toll: number
        tips: number
        fuel: number // liters per trip
      }
      income: {
        fixed: number   // fixed income per trip
        fuel: number    // fuel-based income (liters)
      }
    }>
    fuelPrice: number // price per liter at trip creation
  }>(),

  // Relationships
  vehicleId: table.text("vehicle_id").references(() => assets.id),
  driverId: table.text("driver_id").references(() => employees.id),
  helperId: table.text("helper_id").references(() => employees.id),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),

  // Notes and attachments
  notes: table.text(),
  attachments: table.text(), // JSON array of file URLs

  ...timestamps,
})

/**
 * Trip items - individual route segments taken during a trip
 * Optimized with pre-calculated totals for fast queries and invoice generation
 */
export const tripItems = pgTable("trip_items", {
  id: table.text().primaryKey(),
  tripId: table.text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),

  // Route information
  from: table.text().notNull(),
  to: table.text().notNull(),
  count: table.integer().notNull().default(1),

  // Expense rates (from route config snapshot)
  tollRate: table.numeric("toll_rate", { precision: 10, scale: 2 }),
  tipsRate: table.numeric("tips_rate", { precision: 10, scale: 2 }),
  fuelLitersRate: table.numeric("fuel_liters_rate", { precision: 10, scale: 2 }), // liters per trip
  fuelPricePerLiter: table.numeric("fuel_price_per_liter", { precision: 10, scale: 2 }),

  // Income rates (from route config snapshot)
  incomeFixedRate: table.numeric("income_fixed_rate", { precision: 10, scale: 2 }), // fixed income per trip
  incomeFuelRate: table.numeric("income_fuel_rate", { precision: 10, scale: 2 }), // fuel liters for income

  // Pre-calculated expense totals (rate * count)
  tollTotal: table.numeric("toll_total", { precision: 10, scale: 2 }),
  tipsTotal: table.numeric("tips_total", { precision: 10, scale: 2 }),
  fuelLitersTotal: table.numeric("fuel_liters_total", { precision: 10, scale: 2 }),
  fuelExpenseTotal: table.numeric("fuel_expense_total", { precision: 10, scale: 2 }),

  // Pre-calculated income totals
  incomeFixedTotal: table.numeric("income_fixed_total", { precision: 10, scale: 2 }), // incomeFixedRate * count
  incomeFuelTotal: table.numeric("income_fuel_total", { precision: 10, scale: 2 }), // incomeFuelRate * count * fuelPrice
  incomeTotal: table.numeric("income_total", { precision: 10, scale: 2 }), // incomeFixedTotal + incomeFuelTotal

  ...timestamps,
})

/**
 * Trip expenses - additional expenses beyond route-based costs
 */
export const tripExpenses = pgTable("trip_expenses", {
  id: table.text().primaryKey(),
  tripId: table.text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),

  // Expense categorization
  expenseType: table.text("expense_type").notNull(), // 'fuel', 'toll', 'tips', 'maintenance', 'other'
  description: table.text().notNull(),
  amount: table.numeric({ precision: 10, scale: 2 }).notNull(),

  // Optional metadata
  metadata: table.jsonb().$type<{
    receipt?: string
    vendor?: string
    paymentMethod?: string
  }>(),

  ...timestamps,
})

// Relations
export const tripsRelations = relations(trips, ({ one, many }) => ({
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
  items: many(tripItems),
  expenses: many(tripExpenses),
}))

export const tripItemsRelations = relations(tripItems, ({ one }) => ({
  trip: one(trips, {
    fields: [tripItems.tripId],
    references: [trips.id],
  }),
}))

export const tripExpensesRelations = relations(tripExpenses, ({ one }) => ({
  trip: one(trips, {
    fields: [tripExpenses.tripId],
    references: [trips.id],
  }),
}))
