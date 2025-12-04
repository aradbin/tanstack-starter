import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"
import { timestamps } from "./columns.helpers"
import { organizations, users } from "./users"
import { relations } from "drizzle-orm"

export const tasks = pgTable("tasks", {
  id: table.text().primaryKey(),
  number: table.integer().notNull(),
  title: table.text().notNull(),
  description: table.text(),
  status: table.text().default("todo").notNull(), // todo, inprogress, done
  priority: table.text().default("medium").notNull(), // low, medium, high
  dueDate: table.date("due_date").defaultNow().notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const taskEntities = pgTable("task_entities", {
  id: table.text().primaryKey(),
  role: table.text(), // assignee, owner
  entityType: table.text("entity_type").notNull(), // table name: users, employees, partners, assets
  entityId: table.text("entity_id").notNull(),
  taskId: table
    .text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps
})

export const taskRelations = relations(tasks, ({ many, one }) => ({
  taskEntities: many(taskEntities),
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id]
  })
}))

export const taskEntityRelations = relations(taskEntities, ({ one }) => ({
  task: one(tasks, {
    fields: [taskEntities.taskId],
    references: [tasks.id]
  }),
}))
