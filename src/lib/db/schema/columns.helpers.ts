import { timestamp } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
  deletedAt: timestamp("deleted_at"),
  createdBy: table.text("created_by"),
  updatedBy: table.text("updated_by"),
  deletedBy: table.text("deleted_by"),
}
