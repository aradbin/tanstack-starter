import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { organizations } from "./users"

export const assets = pgTable("assets", {
  id: table.text().primaryKey(),
  image: table.text(),
  metadata: table.jsonb(),
  typeId: table.text("type_id").notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})
