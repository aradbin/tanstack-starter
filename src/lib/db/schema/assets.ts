import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { organizations } from "./users"

export const assets = pgTable("assets", {
  id: table.text().primaryKey(),
  type: table.text().notNull(), // vehicle, building
  // registrationNumber: table.text("registration_number").notNull().unique(),
  // registrationDate: table.date("registration_date"),
  // chassisNumber: table.text("chassis_number"),
  // engineNumber: table.text("engine_number"),
  // fitnessExpiryDate: table.date("fitness_expiry_date"),
  // taxTokenExpiryDate: table.date("tax_token_expiry_date"),
  // insuranceExpiryDate: table.date("insurance_expiry_date"),
  // brand: table.text(),
  // model: table.text(),
  // year: table.integer(),
  // capacity: table.integer(),
  image: table.text(),
  metadata: table.jsonb(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})
