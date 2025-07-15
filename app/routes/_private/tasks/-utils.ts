import { authOrgMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { createData } from "@/lib/db/functions";
import { tasks } from "@/lib/db/schema";
import { AnyType, FormFieldType, OptionType } from "@/lib/types";
import { formatDateForInput } from "@/lib/utils";
import { stringRequiredValidation, stringValidation } from "@/lib/validations";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { ArrowDown, ArrowRight, ArrowUp, Circle, CircleCheckBig, Timer } from "lucide-react";

export const taskStatuses = ['todo', 'inprogress', 'done']
export const taskPriorities = ['low', 'medium', 'high']
export const taskStatusOptions: OptionType[] = [
  { label: "To Do", value: "todo", icon: Circle },
  { label: "In Progress", value: "inprogress", icon: Timer },
  { label: "Done", value: "done", icon: CircleCheckBig },
]
export const taskPriorityOptions: OptionType[] = [
  { label: "Low", value: "low", icon: ArrowDown },
  { label: "Medium", value: "medium", icon: ArrowRight },
  { label: "High", value: "high", icon: ArrowUp },
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
