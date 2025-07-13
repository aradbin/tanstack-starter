import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"

export const tasks = pgTable("tasks", {
  id: table.serial().primaryKey(),
  number: table.integer().notNull(),
  title: table.text().notNull(),
  description: table.text(),
  status: table.text().default("todo").notNull(),
  priority: table.text().default("medium").notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})
