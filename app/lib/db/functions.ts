import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"

type Table = keyof typeof db.query
type Relation<TTable extends Table> = NonNullable<Parameters<typeof db.query[TTable]['findMany']>[0]>['with']

export const getQuery = <TTable extends Table> (
  table: TTable,
  options?: {
    with?: Relation<TTable>
  }
) => {
  return createServerFn()
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
      if (!context?.session) {
        throw new Error('Unauthorized')
      }
      
      const query = db.query[table]

      if (!query) {
        throw new Error(`Table ${String(table)} not found`)
      }
      
      const result = await query.findMany({
        with: options?.with
      })

      return JSON.parse(JSON.stringify(result))
    })
}
