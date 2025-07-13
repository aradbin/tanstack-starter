import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { AnyType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

export const createTask = createServerFn({ method: "POST" })
  .validator((data: {
    values: AnyType
  }) => data)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if(context?.session?.activeOrganizationId) {
      const { values } = data
    
      const count = await db.$count(tasks, and(eq(tasks.organization_id, context?.session?.activeOrganizationId)))

      try {
        const result = await db.insert(tasks).values({
          ...values,
          number: count + 1,
          organization_id: context?.session?.activeOrganizationId,
        })

        return {
          ...result,
          message: "Task created successfully"
        }
      } catch (error) {
        throw new Error("Something went wrong. Please try again") 
      }
    }

    throw new Error("No Active Organization");
  })
