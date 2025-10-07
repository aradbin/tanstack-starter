import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations } from "./users"
import { relations } from "drizzle-orm"

export const invoices = pgTable("invoices", {
  id: table.text().primaryKey(),
  number: table.text().notNull(),
  amount: table.numeric().notNull(),
  paid: table.numeric().default("0").notNull(),
  dueDate: table.date("due_date").notNull(),
  status: table.text().notNull(), // paid, unpaid, overdue, draft, canceled, partial, refunded
  attachments: table.text(),
  metadata: table.jsonb(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const invoiceEntities = pgTable("invoice_entities", {
  id: table.text().primaryKey(),
  entityType: table.text("entity_type").notNull(), // table name: customers, employees, assets
  entityId: table.text("entity_id").notNull(),
  invoiceId: table
    .text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const invoicePayments = pgTable("invoice_payments", {
  id: table.text().primaryKey(),
  amount: table.numeric().notNull(),
  date: table.date().notNull(),
  method: table.text().notNull(), // credit_card, bank_transfer, cash, check, paypal, stripe
  reference: table.text(), // transaction id, check number, etc.
  metadata: table.jsonb(),
  invoiceId: table
    .text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  invoiceEntities: many(invoiceEntities),
  invoicePayments: many(invoicePayments),
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
}))

export const invoiceEntityRelations = relations(invoiceEntities, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceEntities.invoiceId],
    references: [invoices.id],
  }),
}))

export const invoicePaymentRelations = relations(invoicePayments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoicePayments.invoiceId],
    references: [invoices.id],
  }),
}))