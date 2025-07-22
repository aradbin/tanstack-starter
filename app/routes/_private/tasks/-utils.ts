import { authOrgMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { addOrder, addPagination, addWhere, QueryParamBaseType } from "@/lib/db/functions";
import { tasks, taskUsers, users } from "@/lib/db/schema";
import { AnyType, OptionType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";
import { generateId } from "better-auth";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
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
  .validator((data: QueryParamBaseType) => data)
  .handler(async ({ context, data }) => {
    const { sort, pagination, where, search } = data

    const assigneeTaskUser = alias(taskUsers, 'assignee_task_users')
    const assigneeUser = alias(users, 'assignee_users')
    const reporterTaskUser = alias(taskUsers, 'reporter_task_users')
    const reporterUser = alias(users, 'reporter_users')
    
    let query = db.select({
      ...getTableColumns(tasks),
        assignee: getTableColumns(assigneeUser),
        reporter: getTableColumns(reporterUser),
        count: sql<number>`count(*) over()`
    }).from(tasks)

    if(where?.assignee){
      query.innerJoin(assigneeTaskUser, and(
        eq(tasks.id, assigneeTaskUser.taskId),
        eq(assigneeTaskUser.userId, where?.assignee),
        eq(assigneeTaskUser.role, 'assignee'))
      )
    }else{
      query.leftJoin(assigneeTaskUser, and(
        eq(tasks.id, assigneeTaskUser.taskId),
        eq(assigneeTaskUser.role, 'assignee'))
      )
    }

    if(where?.reporter){
      query.innerJoin(reporterTaskUser, and(
        eq(tasks.id, reporterTaskUser.taskId),
        eq(reporterTaskUser.userId, where?.reporter),
        eq(reporterTaskUser.role, 'reporter'))
      )
    }else{
      query.leftJoin(reporterTaskUser, and(
        eq(tasks.id, reporterTaskUser.taskId),
        eq(reporterTaskUser.role, 'reporter'))
      )
    }

    query.leftJoin(assigneeUser, eq(assigneeTaskUser?.userId, assigneeUser?.id))
    query.leftJoin(reporterUser, eq(reporterTaskUser?.userId, reporterUser?.id))

    query = addWhere(query, context?.session?.activeOrganizationId, tasks, where, search)
    query = addOrder(query, tasks, sort)
    query = addPagination(query, pagination)

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
          id: generateId(),
          ...values,
          number: count + 1,
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()

        if(values?.assignee || values?.reporter){
          await tx.insert(taskUsers).values([
            ...values?.assignee ? [{
              id: generateId(),
              taskId: result?.id,
              userId: values?.assignee,
              role: "assignee",
              createdBy: context?.user?.id
            }] : [],
            ...values?.reporter ? [{
              id: generateId(),
              taskId: result?.id,
              userId: values?.reporter,
              role: "reporter",
              createdBy: context?.user?.id
            }] : []
          ])
        }

        return {
          ...result,
          message: "Task Created Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })

export const updateTask = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: AnyType,
    id: AnyType
  }) => data)
  .handler(async ({ context, data }) => {
    const { values, id } = data
    console.log('values', values, id)
    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx.update(tasks).set({
          ...values,
          updatedBy: context?.user?.id,
        }).where(eq(tasks.id, id)).returning()

        const existing = await tx.query.taskUsers.findMany({
          where: eq(taskUsers.taskId, id)
        })

        const assignee = existing?.find((taskUser) => taskUser?.role === 'assignee')
        const reporter = existing?.find((taskUser) => taskUser?.role === 'reporter')

        if(!assignee && values?.assignee){
          await tx.insert(taskUsers).values({
            id: generateId(),
            taskId: id,
            userId: values?.assignee,
            role: "assignee",
            createdBy: context?.user?.id
          })
        }
        if(assignee && values?.assignee && assignee?.userId !== values?.assignee){
          await tx.update(taskUsers).set({
            userId: values?.assignee,
            updatedBy: context?.user?.id,
          }).where(eq(taskUsers.id, assignee?.id))
        }
        if(assignee && !values?.assignee){
          await tx.delete(taskUsers).where(eq(taskUsers.id, assignee?.id))
        }

        if(!reporter && values?.reporter){
          await tx.insert(taskUsers).values({
            id: generateId(),
            taskId: id,
            userId: values?.reporter,
            role: "reporter",
            createdBy: context?.user?.id
          })
        }
        if(reporter && values?.reporter && reporter?.userId !== values?.reporter){
          await tx.update(taskUsers).set({
            userId: values?.reporter,
            updatedBy: context?.user?.id,
          }).where(eq(taskUsers.id, reporter?.id))
        }
        if(reporter && !values?.reporter){
          await tx.delete(taskUsers).where(eq(taskUsers.id, reporter?.id))
        }

        return {
          ...result,
          message: "Task Updated Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })
