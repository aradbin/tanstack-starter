import { db } from "@/lib/db";
import { addOrder, addPagination, getWhereArgs } from "@/lib/db/functions";
import { members, users } from "@/lib/db/schema";
import { PaginationType, SearchType, SortType, WhereType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

export const getMembers = createServerFn()
  .validator((data: { sort?: SortType, pagination?: PaginationType, where?: WhereType, search: SearchType }) => data)
  .handler(async ({ data }) => {
    const { pagination, sort, where, search } = data
    const whereArgs = and(
      ...getWhereArgs(members, where),
      ...search?.term ? [or(
        ilike(users.name, `%${search.term}%`),
        ilike(users.email, `%${search.term}%`)
      )] : []
    )

    let query = db
      .select({
        ...getTableColumns(members),
        user: getTableColumns(users),
        count: sql<number>`count(*) over()`
      })
      .from(members)
      .leftJoin(users, eq(members.userId, users.id))
      .where(whereArgs)

    query = addPagination(query, pagination)
    query = addOrder(query, members, sort)

    const result = await query

    const count = result?.length > 0 ? result[0].count : 0

    return {
      result,
      count
    }
  })
