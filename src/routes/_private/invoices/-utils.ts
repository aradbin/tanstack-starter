import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { addOrder, addPagination, addWhere, QueryParamBaseType } from "@/lib/db/functions"
import { invoiceEntities, invoices, partners } from "@/lib/db/schema"
import { AnyType } from "@/lib/types"
import { createServerFn } from "@tanstack/react-start"
import { and, eq, getTableColumns } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const getInvoices = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: QueryParamBaseType) => data)
  .handler(async ({ context, data }): Promise<AnyType> => {
    const { sort, pagination, where, search } = data

    const customerInvoiceEntity = alias(invoiceEntities, 'customer_invoice_entity')
    const customerPartner = alias(partners, 'customer_partner')

    let query = db.select({
      ...getTableColumns(invoices),
      customer: getTableColumns(customerPartner),
    }).from(invoices)

    query.innerJoin(customerInvoiceEntity, and(...[
      eq(invoices.id, customerInvoiceEntity.invoiceId),
      eq(customerInvoiceEntity.role, 'customer'),
      eq(customerInvoiceEntity.entityType, 'partners'),
    ]))

    query.leftJoin(customerPartner, eq(customerInvoiceEntity?.entityId, customerPartner?.id))

    query = addWhere(query, context?.session?.activeOrganizationId, invoices, where, search)
    query = addOrder(query, invoices, sort)
    query = addPagination(query, pagination)

    const result = await query
    const count = result?.length

    return {
      result,
      count,
    }
  })