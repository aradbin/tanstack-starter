import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "../auth/middleware"
import { db } from "."
import * as schema from "./schema"

export const getMembers = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (context?.session) {
      schema.members
      const members = await db.query.members.findMany()
      
      return members
    }

    return null
  })
