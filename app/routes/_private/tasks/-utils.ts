import { authOrgMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { addOrder, addPagination, createData, getWhereArgs } from "@/lib/db/functions";
import { tasks, taskUsers, users } from "@/lib/db/schema";
import { AnyType, OptionType, PaginationType, SearchType, SortType, WhereType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { ArrowDown, ArrowRight, ArrowUp, Circle, CircleCheckBig, Timer } from "lucide-react";

export const taskStatuses = ['todo', 'inprogress', 'done']
export const taskPriorities = ['low', 'medium', 'high']
export const taskStatusOptions: OptionType[] = [
  { name: "To Do", id: "todo", icon: Circle },
  { name: "In Progress", id: "inprogress", icon: Timer },
  { name: "Done", id: "done", icon: CircleCheckBig },
]
export const taskPriorityOptions: OptionType[] = [
  { name: "Low", id: "low", icon: ArrowDown },
  { name: "Medium", id: "medium", icon: ArrowRight },
  { name: "High", id: "high", icon: ArrowUp },
]

export const getTasks = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: { sort?: SortType, pagination?: PaginationType, where?: WhereType, search?: SearchType }) => data)
  .handler(async ({ context, data }) => {
    const { pagination, sort, where, search } = data
    const whereArgs = and(
      ...getWhereArgs(context?.session?.activeOrganizationId, tasks, where),
      ...search?.term ? [ilike(tasks.title, `%${search.term}%`)] : []
    )

    let query = db
      .select({
        ...getTableColumns(tasks),
        taskUsers: {
          ...getTableColumns(taskUsers)
        },
        count: sql<number>`count(*) over()`
      })
      .from(tasks)
      .leftJoin(taskUsers, eq(tasks.id, taskUsers.taskId))
      .leftJoin(users, eq(taskUsers.userId, users.id))
      .where(whereArgs)

    query = addPagination(query, pagination)
    query = addOrder(query, tasks, sort)

    const result = await query

    const count = result?.length > 0 ? result[0].count : 0

    return {
      result,
      count
    }
  })

export const createTask = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: AnyType
  }) => data)
  .handler(async ({ context, data }) => {
    const { values } = data

    try {
      return await db.transaction(async (tx) => {
        const count = await tx.$count(tasks, and(eq(tasks.organizationId, context?.session?.activeOrganizationId)))
        const [result] = await tx.insert(tasks).values({
          ...values,
          number: count + 1,
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()
        
        if(!result?.id){
          throw new Error("Something went wrong. Please try again")
        }

        await tx.insert(taskUsers).values([
          ...values?.assignee ? [{
            taskId: result?.id,
            userId: values?.assignee,
            role: "assignee",
            createdBy: context?.user?.id
          }] : [],
          ...values?.reporter ? [{
            taskId: result?.id,
            userId: values?.reporter,
            role: "reporter",
            createdBy: context?.user?.id
          }] : []
        ])

        return {
          ...result,
          message: "Task Created Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })
