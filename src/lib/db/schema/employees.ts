import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { organizations } from "./users"
import { relations } from "drizzle-orm"

export const departments = pgTable("departments", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  parentId: table
    .text("parent_id")
    .references(() => departments.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const designations = pgTable("designations", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  parentId: table
    .text("parent_id")
    .references(() => designations.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const employees = pgTable("employees", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text(),
  phone: table.text(),
  dob: table.date(),
  gender: table.text(),
  joiningDate: table.date("joining_date"),
  image: table.text(),
  metadata: table.jsonb(),
  departmentId: table
    .text("department_id")
    .references(() => departments.id, { onDelete: "cascade" }),
  designationId: table
    .text("designation_id")
    .references(() => designations.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const employeeRelations = relations(employees, ({ one }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  designation: one(designations, {
    fields: [employees.designationId],
    references: [designations.id],
  }),
  organization: one(organizations, {
    fields: [employees.organizationId],
    references: [organizations.id],
  }),
}))
