import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"

export const contacts = pgTable("contacts", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text().notNull().unique(),
  address: table.text(),
  phone: table.text(),
  image: table.text(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})
