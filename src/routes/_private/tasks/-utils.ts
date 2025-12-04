import { authOrgMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { addOrder, addPagination, addWhere, QueryParamBaseType } from "@/lib/db/functions";
import { taskEntities, tasks, users } from "@/lib/db/schema";
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

    const assigneeTaskUser = alias(taskEntities, 'assignee_task_users')
    const assigneeUser = alias(users, 'assignee_users')
    const ownerTaskUser = alias(taskEntities, 'owner_task_users')
    const ownerUser = alias(users, 'owner_users')
    
    let query = db.select({
      ...getTableColumns(tasks),
        assignee: getTableColumns(assigneeUser),
        owner: getTableColumns(ownerUser),
        count: sql<number>`count(*) over()`
    }).from(tasks)

    if(where?.assignee){
      query.innerJoin(assigneeTaskUser, and(
        eq(tasks.id, assigneeTaskUser.taskId),
        eq(assigneeTaskUser.entityId, where?.assignee),
        eq(assigneeTaskUser.role, 'assignee'))
      )
    }else{
      query.leftJoin(assigneeTaskUser, and(
        eq(tasks.id, assigneeTaskUser.taskId),
        eq(assigneeTaskUser.role, 'assignee'))
      )
    }

    if(where?.owner){
      query.innerJoin(ownerTaskUser, and(
        eq(tasks.id, ownerTaskUser.taskId),
        eq(ownerTaskUser.entityId, where?.owner),
        eq(ownerTaskUser.role, 'owner'))
      )
    }else{
      query.leftJoin(ownerTaskUser, and(
        eq(tasks.id, ownerTaskUser.taskId),
        eq(ownerTaskUser.role, 'owner'))
      )
    }

    query.leftJoin(assigneeUser, eq(assigneeTaskUser?.entityId, assigneeUser?.id))
    query.leftJoin(ownerUser, eq(ownerTaskUser?.entityId, ownerUser?.id))

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

        // if(values?.assignee || values?.owner){
        //   await tx.insert(taskEntities).values([
        //     ...values?.assignee ? [{
        //       id: generateId(),
        //       taskId: result?.id,
        //       entityId: values?.assignee,
        //       role: "assignee",
        //       createdBy: context?.user?.id
        //     }] : [],
        //     ...values?.owner ? [{
        //       id: generateId(),
        //       taskId: result?.id,
        //       entityId: values?.owner,
        //       role: "owner",
        //       createdBy: context?.user?.id
        //     }] : []
        //   ])
        // }

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
    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx.update(tasks).set({
          ...values,
          updatedBy: context?.user?.id,
        }).where(eq(tasks.id, id)).returning()

        const existing = await tx.query.taskEntities.findMany({
          where: eq(taskEntities.taskId, id)
        })

        const assignee = existing?.find((taskUser) => taskUser?.role === 'assignee')
        const owner = existing?.find((taskUser) => taskUser?.role === 'owner')

        // if(!assignee && values?.assignee){
        //   await tx.insert(taskEntities).values({
        //     id: generateId(),
        //     taskId: id,
        //     entityId: values?.assignee,
        //     role: "assignee",
        //     createdBy: context?.user?.id
        //   })
        // }
        if(assignee && values?.assignee && assignee?.entityId !== values?.assignee){
          await tx.update(taskEntities).set({
            entityId: values?.assignee,
            updatedBy: context?.user?.id,
          }).where(eq(taskEntities.id, assignee?.id))
        }
        if(assignee && !values?.assignee){
          await tx.delete(taskEntities).where(eq(taskEntities.id, assignee?.id))
        }

        // if(!owner && values?.owner){
        //   await tx.insert(taskEntities).values({
        //     id: generateId(),
        //     taskId: id,
        //     entityId: values?.owner,
        //     role: "owner",
        //     createdBy: context?.user?.id
        //   })
        // }
        if(owner && values?.owner && owner?.entityId !== values?.owner){
          await tx.update(taskEntities).set({
            entityId: values?.owner,
            updatedBy: context?.user?.id,
          }).where(eq(taskEntities.id, owner?.id))
        }
        if(owner && !values?.owner){
          await tx.delete(taskEntities).where(eq(taskEntities.id, owner?.id))
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
