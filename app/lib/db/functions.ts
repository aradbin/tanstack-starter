import { createServerFn } from "@tanstack/react-start"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, desc, eq, inArray, isNull } from "drizzle-orm"
import { defaultPageSize } from "../variables"
import { AnyType, PaginationType, SearchType, SortType, WhereType } from "../types"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
export type QueryParamType<TTable extends TableType> = {
  table: TTable
  relation?: RelationType<TTable>
  sort?: SortType
  pagination?: PaginationType
  where?: WhereType
  search?: SearchType
}

export const getPaginationArgs = (pagination?: PaginationType): { limit?: number; offset?: number } => {
  if(!pagination || pagination?.hasPagination === false){
    return {}
  }

  return {
    limit: pagination?.pageSize ?? defaultPageSize,
    offset: ((pagination?.page ?? 1) - 1) * (pagination?.pageSize ?? defaultPageSize),
  }
}

export const getOrderArgs = (schema?: AnyType, sort?: SortType): { orderBy?: AnyType } => {
  return {
    orderBy: [
      ...sort?.field ? sort?.order === 'desc' ? [desc(schema[sort?.field])] : [schema[sort?.field]] : sort?.order === 'asc' ? [schema.createdAt] : [desc(schema.createdAt)],
    ]
  }
}

export const getWhereArgs = (schema?: AnyType, where?: WhereType): { where?: AnyType } => {
  const baseConditions = [
    isNull(schema?.deletedAt),
    // eq(schema?.organizationId, context?.session?.activeOrganizationId)
  ]
  const dynamicConditions = Object.entries(where ?? {}).flatMap(([key, value]) => {
    const column = schema?.[key]
    if (!column || !value || !value.length) return []

    return Array.isArray(value) ? inArray(column, value) : eq(column, value)
  })
  
  return {
    where: and(...baseConditions, ...dynamicConditions),
  }
}

const getDatasFn = createServerFn()
  .validator((data: { table: TableType; relation?: unknown; sort?: SortType, pagination?: PaginationType, where?: WhereType }) => data)
  .handler(async ({ data }) => {
    const { table, relation, sort, pagination, where } = data
    const tableSchema = schema[table] as AnyType
    const query = db.query[table]

    type TTable = typeof table
    type Relation = RelationType<TTable>
    type FindManyArgs = Parameters<typeof db.query[TTable]['findMany']>[0]

    // relation
    const relationArgs = {
      ...(relation ? { with: relation as Relation } : {}),
    }

    // where
    const whereArg = getWhereArgs(tableSchema, where)

    // query
    const args: FindManyArgs = {
      ...relationArgs,
      ...whereArg,
      ...getPaginationArgs(pagination),
      ...getOrderArgs(tableSchema, sort),
    }
    
    const result = await (query.findMany as (args?: FindManyArgs) => Promise<any>)(args)
    const count = await db.$count(tableSchema, whereArg?.where)
    
    return {
      result,
      count,
    }
  })

export const getDatas = async <TTable extends TableType>(
  input: { data: QueryParamType<TTable> }
) => {
  return await getDatasFn(input)
}
