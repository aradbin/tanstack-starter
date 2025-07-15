import { createServerFn } from "@tanstack/react-start"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, desc, eq, ilike, inArray, isNull } from "drizzle-orm"
import { defaultPageSize } from "../variables"
import { AnyType, PaginationType, SearchType, SortType, WhereType } from "../types"
import { authOrgMiddleware } from "../auth/middleware"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
export type QueryParamType = {
  table: TableType
  relation?: RelationType<TableType>
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

export const getWhereArgs = (activeOrganizationId: string, tableSchema: AnyType, where?: WhereType, search?: SearchType) => {
  const baseConditions = [
    isNull(tableSchema?.deletedAt),
    eq(tableSchema?.organizationId, activeOrganizationId)
  ]
  const dynamicConditions = Object.entries(where ?? {}).flatMap(([key, value]) => {
    const column = tableSchema?.[key]
    if (!column || value === undefined || value === null) return []

    return Array.isArray(value) ? inArray(column, value) : eq(column, value)
  })
  const searchConditions = [
    ...(search?.term && search?.key && tableSchema?.[search?.key]) ? [ilike(tableSchema?.[search?.key], `%${search.term}%`)] : []
  ]
  
  return [...baseConditions, ...dynamicConditions, ...searchConditions]
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
  .validator((data: { table: TableType; relation?: unknown; sort?: SortType, pagination?: PaginationType, where?: WhereType, search?: SearchType }) => data)
  .handler(async ({ context, data }) => {
    const { table, relation, sort, pagination, where, search } = data
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
    const whereArg = and(...getWhereArgs(context?.session?.activeOrganizationId, tableSchema, where, search))

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

export const getDatas = async (
  input: { data: QueryParamType }
) => {
  return await getDatasFn(input)
}

export const getData = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: { table: TableType; id: AnyType }) => data)
  .handler(async ({ context, data }) => {
    const { table, id } = data
    const tableSchema = schema[table] as AnyType
    return await db.query.tasks.findFirst({
      where: and(...getWhereArgs(context?.session?.activeOrganizationId, tableSchema, { id }))
    })
  })

export const createData = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    table: TableType
    values: Record<string, any>
    title?: string
  }) => data)
  .handler(async ({ context, data }) => {
    const { table, values, title } = data
    const tableSchema = schema[table] as AnyType

    try {
      const result = await db.insert(tableSchema).values({
        ...values,
        organizationId: context?.session?.activeOrganizationId,
      })

      return {
        ...result,
        message: `${title ? title+" " : ""}Created Successfully`
      }
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })

export const updateData = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    table: TableType
    values: Record<string, any>
    id: AnyType
    title?: string
  }) => data)
  .handler(async ({ data }) => {
    const { table, values, id, title } = data
    const tableSchema = schema[table] as AnyType

    try {
      const result = await db.update(tableSchema).set(values).where(eq(tableSchema.id, id))

      return {
        ...result,
        message: `${title ? title+" " : ""}Updated Successfully`
      }
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })

export const deleteData = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    table: TableType
    id: AnyType
    title?: string
  }) => data)
  .handler(async ({ data }) => {
    const { table, id, title } = data
    const tableSchema = schema[table] as AnyType

    try {
      const result = await db.update(tableSchema).set({
        deletedAt: new Date()
      }).where(eq(tableSchema.id, id))

      return {
        ...result,
        message: `${title ? title+" " : ""}Deleted Successfully`
      }
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })
