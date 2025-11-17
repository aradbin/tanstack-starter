import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { getWhereArgs } from "@/lib/db/functions"
import { invoiceEntities, invoicePayments, invoices, services } from "@/lib/db/schema"
import { AnyType } from "@/lib/types"
import { formatMonth } from "@/lib/utils"
import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"
import { format, isPast } from "date-fns"
import { and, eq } from "drizzle-orm"

export const createDepotTripInvoice = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: {
      from: string,
      to: string,
      date: string,
      dueDate: string,
    }
  }) => data)
  .handler(async ({ context, data }): Promise<AnyType> => {
    const { values } = data
    
    try {
      return await db.transaction(async (tx) => {
        const trips: typeof services.$inferSelect[] = await tx.query.services.findMany({
          where: and(...getWhereArgs(context?.session?.activeOrganizationId, services, {
            typeId: "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM",
            from: {
              gte: new Date(values?.from),
              lte: new Date(values?.to)
            }
          }))
        })
        
        let amount = 0
        let invoiceItems = {
          title: `Prime Mover Bill for the Month of ${formatMonth(new Date(values?.to))}`,
          items: [
            { key: "PL", particulars: "Line Trailer: Trip (CPA to Portlink)", quantity: 0, unitPrice: 0, total: 0 },
            { key: "PCT (Import)", particulars: "Line Trailer: Other Depot (Import) PCT Trip", quantity: 0, unitPrice: 0, total: 0 },
            { key: "PCT (Export)", particulars: "Line Trailer: Other Depot (Export) PCT Trip", quantity: 0, unitPrice: 0, total: 0 },
            { key: "otherDepotTripAmount", particulars: "Line Trailer: Other Depot Trip amount", quantity: 0, unitPrice: 0, total: 0 },
            { key: "otherDepotTripFuel", particulars: "Line Trailer: Other Depot Trip Fuel", quantity: 0, unitPrice: 0, total: 0 },
          ]
        }
        const invoiceFuels: AnyType = {
          title: "Line Trailer: Other Depot Trip Fuel Details",
          items: {}
        }
        trips?.forEach((trip: AnyType) => {
          trip?.metadata?.items?.forEach((item: AnyType) => {
            amount += item?.count * ((item?.route?.income?.fuel * trip?.metadata?.fuelPrice) + item?.route?.income?.fixed)

            if(item?.route?.income?.fixed){
              let key = "otherDepotTripAmount"
              if(["PL", "PCT (Import)", "PCT (Export)"].includes(item?.route?.to)){
                key = item?.route?.to
              }
              const itemIndex = invoiceItems?.items?.findIndex((invoiceItem: AnyType) => invoiceItem?.key === key)
              invoiceItems.items[itemIndex] = {
                ...invoiceItems.items[itemIndex],
                particulars: invoiceItems.items[itemIndex]?.particulars,
                quantity: invoiceItems.items[itemIndex]?.quantity + item?.count,
                unitPrice: item?.route?.income?.fixed,
                total: ((invoiceItems.items[itemIndex].quantity + item?.count) * item?.route?.income?.fixed)
              }
            }

            if(item?.route?.income?.fuel){
              const otherDepotTripFuelIndex = invoiceItems?.items?.findIndex((invoiceItem: AnyType) => invoiceItem?.key === "otherDepotTripFuel")
              invoiceItems.items[otherDepotTripFuelIndex] = {
                ...invoiceItems.items[otherDepotTripFuelIndex],
                particulars: invoiceItems.items[otherDepotTripFuelIndex]?.particulars,
                quantity: invoiceItems.items[otherDepotTripFuelIndex]?.quantity + (item?.count * item?.route?.income?.fuel),
                unitPrice: trip?.metadata?.fuelPrice,
                total: (invoiceItems.items[otherDepotTripFuelIndex]?.quantity + (item?.count * item?.route?.income?.fuel)) * trip?.metadata?.fuelPrice
              }
              invoiceFuels.items[item?.route?.to] = {
                tripFuel: item?.route?.income?.fuel,
                tripCount: (invoiceFuels?.items?.[item?.route?.to]?.count || 0) + item?.count,
                fuelQuantity: ((invoiceFuels?.items?.[item?.route?.to]?.count || 0) + item?.count) * item?.route?.income?.fuel,
              }
            }
          })
        })

        const invoiceFuelItems: AnyType = {
          title: "Line Trailer: Other Depot Trip Fuel Details",
          items: {}
        }

        trips[0]?.metadata?.["routes"]?.forEach((route: AnyType) => {
          invoiceFuelItems.items[route?.to] = {
            tripFuel: route?.income?.fuel || 0,
            tripCount: invoiceFuels?.items?.[route?.to]?.tripCount || 0,
            fuelQuantity: ((invoiceFuels?.items?.[route?.to]?.tripCount || 0) * (route?.income?.fuel || 0)) || 0,
          }
        })

        const [result] = await tx.insert(invoices).values({
          id: generateId(),
          number: `INV-DEPOT-${format(new Date(values.to), "MMyyyy")}`,
          amount: `${amount}`,
          paid: "0",
          date: values?.date,
          dueDate: values?.dueDate,
          status: isPast(new Date(values?.dueDate)) ? "overdue" : "unpaid",
          metadata: {
            from: values?.from,
            to: values?.to,
            invoiceItems,
            invoiceFuelItems,
          },
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()

        await tx.insert(invoiceEntities).values([
          ...trips?.map((trip) => ({
            id: generateId(),
            role: "trip",
            entityType: "services",
            entityId: trip?.id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id,
            invoiceId: result?.id,
          })),
          ...[{
            id: generateId(),
            role: "customer",
            entityType: "partners",
            entityId: "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf",
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id,
            invoiceId: result?.id,
          }]
        ])

        return {
          ...result,
          customer: {
            id: "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf",
            name: "Portlink Logistic Centre Limited",
            address: "Bhatiary, Satkania, Chittagong"
          },
          message: "Trip Invoice Generated Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })

  export const createInvoicePayment = createServerFn({ method: "POST" })
    .middleware([authOrgMiddleware])
    .validator((data: AnyType) => data)
    .handler(async ({ context, data }) => {
      try {
        return await db.transaction(async (tx) => {
          await tx.insert(invoicePayments).values({
            id: generateId(),
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id,
            ...data,
          })

          const payments = await tx.query.invoicePayments.findMany({
            where: and(...getWhereArgs(context?.session?.activeOrganizationId, invoicePayments, {
              invoiceId: data?.invoiceId
            }))
          })

          await tx.update(invoices).set({
            paid: `${payments?.reduce((acc, payment) => acc + Number(payment.amount), 0)}`,
            updatedBy: context?.user?.id
          }).where(eq(invoices.id, data?.invoiceId))
        })
      } catch {
        throw new Error("Something went wrong. Please try again")
      }
    })
