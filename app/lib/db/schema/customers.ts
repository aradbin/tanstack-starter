import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"
import { relations } from "drizzle-orm"

export const contacts = pgTable("contacts", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text(),
  phone: table.text(),
  address: table.text(),
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
  email: table.text(),
  phone: table.text(),
  address: table.text(),
  image: table.text(),
  businessType: table.text("business_type").notNull(), // individual, company
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const customerContacts = pgTable("customer_contacts", {
  id: table.text().primaryKey(),
  email: table.text(),
  phone: table.text(),
  designation: table.text(),
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

export const customerRelations = relations(customers, ({ many, one }) => ({
  customerContacts: many(customerContacts),
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id]
  })
}))

export const customerContactRelations = relations(customerContacts, ({ one }) => ({
  customer: one(customers, {
    fields: [customerContacts.customerId],
    references: [customers.id]
  }),
  contact: one(contacts, {
    fields: [customerContacts.contactId],
    references: [contacts.id]
  })
}))
