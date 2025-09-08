import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { organizations } from "./users"

export const assetTypes = pgTable("asset_types", {
  id: table.text().primaryKey(),
  name: table.text().notNull().unique(),
  parentId: table
    .text("parent_id")
    .references(() => assetTypes.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const assets = pgTable("assets", {
  id: table.text().primaryKey(),
  image: table.text(),
  metadata: table.jsonb(),
  // typeId: table
  //   .text("type_id")
  //   .notNull()
  //   .references(() => assetTypes.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})
