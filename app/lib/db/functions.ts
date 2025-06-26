import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"

export type TableType = keyof typeof db.query
export type RelationType<TTable extends TableType> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']
type QueryParam<TTable extends TableType> = {
  table: TTable
  relations?: RelationType<TTable>
}

export const getQuery = async <TTable extends TableType>(data: QueryParam<TTable>) => {
  return await getQueryFn({ data })
}

const getQueryFn = createServerFn()
  .middleware([authMiddleware])
  .validator((data: { table: TableType; relations?: unknown }) => data)
  .handler(async ({ data }) => {
    const { table, relations } = data
    
    const query = db.query[table]

    if (!query) {
      throw new Error(`Table ${String(table)} not found`)
    }

    type TTable = typeof table
    type Relation = RelationType<TTable>
    type FindManyArgs = Parameters<typeof db.query[TTable]['findMany']>[0]

    const args: FindManyArgs = {
      ...(relations ? { with: relations as Relation } : {}),
    }

    return await (query.findMany as (args?: FindManyArgs) => Promise<any>)(args)
  })
