import { getDatas, QueryParamType } from "@/lib/db/functions"
import { trips } from "@/lib/db/schema"
import { createServerFn } from "@tanstack/react-start"
import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { and, sql } from "drizzle-orm"
import { getWhereArgs } from "@/lib/db/functions"
import * as schema from "@/lib/db/schema"
import { AnyType } from "@/lib/types"

export const getTripsSummary = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: { where?: AnyType }) => data)
  .handler(async ({ context, data }) => {
    const { where } = data
    const tableSchema = schema.trips as AnyType

    const whereArg = and(...getWhereArgs(context?.session?.activeOrganizationId, tableSchema, where))

    const result = await db
      .select({
        totalTrips: sql<number>`COALESCE(SUM(${trips.count}::numeric), 0)`,
        totalFuel: sql<number>`COALESCE(SUM(${trips.fuel}::numeric), 0)`,
        totalExpense: sql<number>`COALESCE(SUM(${trips.expense}::numeric), 0)`,
        totalIncome: sql<number>`COALESCE(SUM(${trips.income}::numeric), 0)`,
      })
      .from(trips)
      .where(whereArg)

    return result[0] ? {
      totalTrips: Number(result[0].totalTrips),
      totalFuel: Number(result[0].totalFuel),
      totalExpense: Number(result[0].totalExpense),
      totalIncome: Number(result[0].totalIncome)
    } : {
      totalTrips: 0,
      totalFuel: 0,
      totalExpense: 0,
      totalIncome: 0
    }
  })