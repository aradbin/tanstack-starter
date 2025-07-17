import { authOrgMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { createData } from "@/lib/db/functions";
import { tasks } from "@/lib/db/schema";
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
      const count = await db.$count(tasks, and(eq(tasks.organizationId, context?.session?.activeOrganizationId)))
      
      return await createData({
        data: {
          table: "tasks",
          values: {
            ...values,
            number: count + 1,
          },
          title: "Task"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })
