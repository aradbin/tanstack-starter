import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { defaultPageSize } from "../variables"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
type QueryParam<TTable extends TableType> = {
  table: TTable
  relations?: RelationType<TTable>
  params?: any
}

const getQueryFn = createServerFn()
  .middleware([authMiddleware])
  .validator((data: { table: TableType; relations?: unknown; params?: any }) => data)
  .handler(async ({ context, data }) => {
    const { table, relations, params } = data
    
    const tableSchema = schema[table] as any
    const query = db.query[table]

    if (!query) {
      throw new Error(`Table ${String(table)} not found`)
    }

    type TTable = typeof table
    type Relation = RelationType<TTable>
    type FindManyArgs = Parameters<typeof db.query[TTable]['findMany']>[0]

    const args: FindManyArgs = {
      ...(relations ? { with: relations as Relation } : {}),
      where: and(
        // eq(tableSchema?.organizationId, context?.session?.activeOrganizationId),
        isNull(tableSchema?.deletedAt)
      ),
      ...((params?.page || params?.pageSize) ? {
        limit: params?.pageSize ?? defaultPageSize,
        offset: ((params?.page ?? 1) - 1) * (params?.pageSize ?? defaultPageSize),
        
      } : {}),
    }

    return await (query.findMany as (args?: FindManyArgs) => Promise<any>)(args)
  })

export const getQuery = async <TTable extends TableType>(data: QueryParam<TTable>) => {
  return await getQueryFn({ data })
}
