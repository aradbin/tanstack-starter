import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

export const getMembers = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if(context?.session){
      const members = await db.query.members.findMany({
        with: {
          user: true
        }
      })
      
      return members
    }
  })
