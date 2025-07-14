import { createServerFn } from "@tanstack/react-start"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, desc, eq, inArray, isNull } from "drizzle-orm"
import { defaultPageSize } from "../variables"
import { AnyType, PaginationType, SearchType, SortType, WhereType } from "../types"
import { authOrgMiddleware } from "../auth/middleware"

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

export const getOrderArgs = (tableSchema?: AnyType, sort?: SortType) => {
  const order: any[] = []

  if (sort?.field && sort.field !== "createdAt" && tableSchema?.[sort.field]) {
    order.push(sort.order === "desc" ? desc(tableSchema[sort.field]) : tableSchema[sort.field])
  }

  if (tableSchema?.createdAt) {
    order.push(sort?.order === "asc" ? tableSchema.createdAt : desc(tableSchema.createdAt))
  }

  return order
}

export const getWhereArgs = (activeOrganizationId: string, tableSchema: AnyType, where?: WhereType) => {
  const baseConditions = [
    isNull(tableSchema?.deletedAt),
    eq(tableSchema?.organizationId, activeOrganizationId)
  ]
  const dynamicConditions = Object.entries(where ?? {}).flatMap(([key, value]) => {
    const column = tableSchema?.[key]
    if (!column || !value || !value.length) return []

    return Array.isArray(value) ? inArray(column, value) : eq(column, value)
  })
  
  return [...baseConditions, ...dynamicConditions]
}

export const addPagination = (query: AnyType, pagination?: PaginationType) => {
  const paginationArgs = getPaginationArgs(pagination)

  if(paginationArgs?.limit !== undefined){
    query.limit(paginationArgs.limit)
  }

  if(paginationArgs.offset !== undefined){
    query.offset(paginationArgs.offset)
  }

  return query
}

export const addOrder = (query: AnyType, tableSchema?: AnyType, sort?: SortType) => {
  return query.orderBy(...getOrderArgs(tableSchema, sort))
}

const getDatasFn = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: { table: TableType; relation?: unknown; sort?: SortType, pagination?: PaginationType, where?: WhereType }) => data)
  .handler(async ({ context, data }) => {
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
    const whereArg = and(...getWhereArgs(context?.session?.activeOrganizationId, tableSchema, where))

    // query
    const args: FindManyArgs = {
      ...relationArgs,
      ...getPaginationArgs(pagination),
      orderBy: getOrderArgs(tableSchema, sort),
      where: whereArg
    }
    
    const result = await (query.findMany as (args?: FindManyArgs) => Promise<any>)(args)
    const count = await db.$count(tableSchema, whereArg)
    
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

export const postData = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    table: TableType
    values: Record<string, any>
  }) => data)
  .handler(async ({ data }) => {
    const { table, values } = data
    const tableSchema = schema[table] as AnyType

    const result = await db.insert(tableSchema).values(values)

    return result
  })