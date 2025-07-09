import { db } from "@/lib/db";
import { getOrderArgs, getPaginationArgs, getWhereArgs } from "@/lib/db/functions";
import { members } from "@/lib/db/schema";
import { PaginationType, SortType, WhereType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";

export const getMembers = createServerFn()
  .validator((data: { sort?: SortType, pagination?: PaginationType, where?: WhereType }) => data)
  .handler(async ({ data }) => {
    const { pagination, sort, where } = data
    const whereArgs = getWhereArgs(members, where)
    const result = await db.query.members.findMany({
      with: {
        user: true
      },
      ...getPaginationArgs(pagination),
      ...getOrderArgs(members, sort),
      ...whereArgs
    })
    const count = await db.$count(members, whereArgs.where)

    return {
      result,
      count
    }
  })