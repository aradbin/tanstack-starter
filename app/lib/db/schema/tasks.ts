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
  status: table.text().default("todo").notNull(),
  priority: table.text().default("medium").notNull(),
  dueDate: table.date("due_date").defaultNow().notNull(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})

export const taskUsers = pgTable("task_users", {
  id: table.text().primaryKey(),
  taskId: table
    .text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: table
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: table.text().default("assignee").notNull(),
  ...timestamps
})

export const taskRelations = relations(tasks, ({ many, one }) => ({
  taskUsers: many(taskUsers),
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id]
  })
}))

export const taskUserRelations = relations(taskUsers, ({ one }) => ({
  task: one(tasks, {
    fields: [taskUsers.taskId],
    references: [tasks.id]
  }),
  user: one(users, {
    fields: [taskUsers.userId], 
    references: [users.id]
  })
}))
