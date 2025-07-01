import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { defaultPageSize } from "../variables"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
export type TableFilterProps = {
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[],
  selected: any[]
}
export type QueryParam<TTable extends TableType> = {
  table: TTable
  relations?: RelationType<TTable>
  pagination?: {
    page?: number
    pageSize?: number
    hasPagination?: boolean
  }
  filters?: TableFilterProps[]
}

const getQueryFn = createServerFn()
  .middleware([authMiddleware])
  .validator((data: { table: TableType; relations?: unknown; pagination?: any }) => data)
  .handler(async ({ context, data }) => {
    const { table, relations, pagination } = data
    
    const tableSchema = schema[table] as any
    const query = db.query[table]

    type TTable = typeof table
    type Relation = RelationType<TTable>
    type FindManyArgs = Parameters<typeof db.query[TTable]['findMany']>[0]

    const relationArgs = {
      ...(relations ? { with: relations as Relation } : {}),
    }
    const paginationArgs = {
      ...(pagination?.hasPagination === false ? {} : {
        limit: pagination?.pageSize ?? defaultPageSize,
        offset: ((pagination?.page ?? 1) - 1) * (pagination?.pageSize ?? defaultPageSize),
      }),
    }

    const where = and(
      // eq(tableSchema?.organizationId, context?.session?.activeOrganizationId),
      isNull(tableSchema?.deletedAt)
    )

    const args: FindManyArgs = {
      ...relationArgs,
      ...paginationArgs,
      where,
    }
    
    const result = await (query.findMany as (args?: FindManyArgs) => Promise<any>)(args)
    const count = await db.$count(tableSchema, where)

    return {
      result,
      count,
    }
  })

export const getQuery = async <TTable extends TableType>(data: QueryParam<TTable>) => {
  return await getQueryFn({ data })
}
