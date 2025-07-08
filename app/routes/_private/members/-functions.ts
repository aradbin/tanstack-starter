import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";

export const getMembers = createServerFn()
  .handler(async () => {
    const result = await db.query.members.findMany({
      with: {
        user: true
      }
    })
    const count = await db.$count(members)

    return {
      result,
      count
    }
  })