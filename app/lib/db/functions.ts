import { createServerFn } from "@tanstack/react-start"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { and, desc, eq, ilike, inArray, isNull, or } from "drizzle-orm"
import { defaultPageSize } from "../variables"
import { AnyType, PaginationType, SearchType, SortType, WhereType } from "../types"
import { authOrgMiddleware } from "../auth/middleware"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
export interface QueryParamBaseType {
  table: TableType
  relation?: AnyType
  sort?: SortType
  pagination?: PaginationType
  where?: WhereType
  search?: SearchType
}
export interface QueryParamType extends QueryParamBaseType {
  relation?: RelationType<TableType>
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
  const searchConditions = search?.term && search?.key && Array.isArray(search?.key)
    ? [or(...search.key?.filter((key) => tableSchema?.[key])?.map((key) => ilike(tableSchema[key], `%${search.term}%`)))]
    : []
  
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

export const addWhere = (query: AnyType, activeOrganizationId: string, tableSchema: AnyType, where?: WhereType, search?: SearchType) => {
  return query.where(and(...getWhereArgs(activeOrganizationId, tableSchema, where, search)))
}

const getDatasFn = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: QueryParamBaseType) => data)
  .handler(async ({ context, data }) => {
    const { table, relation, sort, pagination, where, search } = data
    const tableSchema = schema[table] as AnyType
    const query = db.query[table]

    type TTable = typeof table
    type FindManyArgs = Parameters<typeof db.query[TTable]['findMany']>[0]

    // relation
    const relationArgs = relation ? { with: relation } : {};

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

export const getDataFn = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: QueryParamBaseType & { id: AnyType }) => data)
  .handler(async ({ context, data }) => {
    const { table, id, relation } = data
    const tableSchema = schema[table] as AnyType
    const query = db.query[table]

    type TTable = typeof table
    type Relation = RelationType<TTable>
    type FindFirstArgs = Parameters<typeof db.query[TTable]['findFirst']>[0]

    // relation
    const relationArgs = relation ? { with: relation } : {};

    // where
    const whereArg = and(...getWhereArgs(context?.session?.activeOrganizationId, tableSchema, { id }))

    // query
    const args: FindFirstArgs = {
      ...relationArgs,
      where: whereArg
    }

    return await (query.findFirst as (args?: FindFirstArgs) => Promise<any>)(args)
  })

export const getData = async (
  input: { data: QueryParamType & { id: AnyType } }
) => {
  return await getDataFn(input)
}

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
        createdBy: context?.user?.id,
      })

      return {
        ...result,
        message: `${title ? title+" " : ""}Created Successfully`
      }
    } catch(error) {
      console.error(error)
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
  .handler(async ({ context, data }) => {
    const { table, values, id, title } = data
    const tableSchema = schema[table] as AnyType

    try {
      const result = await db.update(tableSchema).set({
        ...values,
      updatedBy: context?.user?.id
    }).where(eq(tableSchema.id, id))

      return {
        ...result,
        message: `${title ? title+" " : ""}Updated Successfully`
      }
    } catch(error) {
      console.error(error)
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
  .handler(async ({ context, data }) => {
    const { table, id, title } = data
    const tableSchema = schema[table] as AnyType

    try {
      const result = await db.update(tableSchema).set({
        deletedAt: new Date(),
        deletedBy: context?.user?.id
      }).where(eq(tableSchema.id, id))

      return {
        ...result,
        message: `${title ? title+" " : ""}Deleted Successfully`
      }
    } catch(error) {
      console.error(error)
      throw new Error("Something went wrong. Please try again")
    }
  })
