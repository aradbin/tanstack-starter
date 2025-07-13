import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"

export const tasks = pgTable("tasks", {
  id: table.text().primaryKey(),
  title: table.text().notNull(),
  description: table.text(),
  status: table.text().default("todo").notNull(),
  priority: table.text().default("medium").notNull(),
  ...timestamps,
})
