import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

const timestamps = {
  created_at: table.timestamp().defaultNow().notNull(),
  updated_at: table.timestamp(),
  deleted_at: table.timestamp(),
}

export const usersTable = pgTable("users", {
  id: table.uuid().notNull().primaryKey(),
  email: table.varchar().notNull().unique(),
  name: table.varchar().notNull(),
  dob: table.date(),
  avatar: table.varchar(),
  metadata: table.jsonb().notNull().default({}),
  ...timestamps,
})
