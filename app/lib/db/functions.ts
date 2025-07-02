import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, desc, eq, inArray, isNull } from "drizzle-orm"
import { defaultPageSize } from "../variables"
import { AnyType } from "../types"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
export type TableFilterType = {
  key: string
  title?: string
  options?: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[],
  selected?: AnyType
}
export type QueryParamType<TTable extends TableType> = {
  table: TTable
  relations?: RelationType<TTable>
  pagination?: {
    page?: number
    pageSize?: number
    hasPagination?: boolean
  }
  filters?: TableFilterType[]
}

const getQueryFn = createServerFn()
  .middleware([authMiddleware])
  .validator((data: { table: TableType; relations?: unknown; pagination?: AnyType, filters?: AnyType }) => data)
  .handler(async ({ context, data }) => {
    const { table, relations, pagination, filters } = data
    const tableSchema = schema[table] as AnyType
    const query = db.query[table]

    type TTable = typeof table
    type Relation = RelationType<TTable>
    type FindManyArgs = Parameters<typeof db.query[TTable]['findMany']>[0]

    // relations
    const relationArgs = {
      ...(relations ? { with: relations as Relation } : {}),
    }

    // pagination
    const paginationArgs = {
      ...(pagination?.hasPagination === false ? {} : {
        limit: pagination?.pageSize ?? defaultPageSize,
        offset: ((pagination?.page ?? 1) - 1) * (pagination?.pageSize ?? defaultPageSize),
      }),
    }

    // filters
    const baseConditions = [
      isNull(tableSchema?.deletedAt),
      // eq(tableSchema?.organizationId, context?.session?.activeOrganizationId)
    ]
    const dynamicConditions = filters.flatMap((filter: TableFilterType) => {
      const key = filter.key.toLowerCase()
      const column = tableSchema?.[key]
      if (!column || !filter.selected?.length) return []

      return [inArray(column, filter.selected)]
    })
    const whereArg = {
      where: and(...baseConditions, ...dynamicConditions)
    }

    // ordering
    const orderArgs = {
      orderBy: [desc(tableSchema.createdAt)]
    }

    // query
    const args: FindManyArgs = {
      ...relationArgs,
      ...paginationArgs,
      ...whereArg,
      ...orderArgs,
    }
    
    const result = await (query.findMany as (args?: FindManyArgs) => Promise<any>)(args)
    const count = await db.$count(tableSchema, whereArg?.where)
    
    return {
      result,
      count,
    }
  })

export const getQuery = async <TTable extends TableType>(data: QueryParamType<TTable>) => {
  return await getQueryFn({ data })
}
