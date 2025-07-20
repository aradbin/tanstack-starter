import { authOrgMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { getDatas, QueryParamBaseType } from "@/lib/db/functions";
import { tasks, taskUsers } from "@/lib/db/schema";
import { AnyType, OptionType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
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
