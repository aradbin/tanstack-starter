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

export const customers = pgTable("customers", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text().notNull().unique(),
  businessType: table.text("business_type").notNull(), // individual, company
  address: table.text(),
  phone: table.text(),
  image: table.text(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const customerContacts = pgTable("customer_contacts", {
  id: table.text().primaryKey(),
  customerId: table
    .text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  contactId: table
    .text("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),
  ...timestamps,
})
