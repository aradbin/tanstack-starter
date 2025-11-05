import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { addOrder, addWhere, getWhereArgs, QueryParamBaseType } from "@/lib/db/functions"
import { assets, employees, invoiceEntities, invoices, serviceEntities, services } from "@/lib/db/schema"
import { AnyType } from "@/lib/types"
import { formatDateForInput, formatMonth } from "@/lib/utils"
import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"
import { endOfDay, endOfMonth, format, isPast, startOfDay, startOfMonth } from "date-fns"
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const getTrips = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: QueryParamBaseType) => data)
  .handler(async ({ context, data }): Promise<AnyType> => {
    const { sort, pagination, where, search } = data

    const vehicleServiceEntity = alias(serviceEntities, 'vehicle_service_entity')
    const vehicleAsset = alias(assets, 'vehicle_asset')
    const driverServiceEntity = alias(serviceEntities, 'driver_service_entity')
    const driverEmployee = alias(employees, 'driver_employee')
    const helperServiceEntity = alias(serviceEntities, 'helper_service_entity')
    const helperEmployee = alias(employees, 'helper_employee')
    
    let query = db.select({
      ...getTableColumns(services),
      vehicle: getTableColumns(vehicleAsset),
      driver: getTableColumns(driverEmployee),
      helper: getTableColumns(helperEmployee),
    }).from(services)

    query.innerJoin(vehicleServiceEntity, and(...[
      eq(services.id, vehicleServiceEntity.serviceId),
      eq(vehicleServiceEntity.role, 'vehicle'),
      eq(vehicleServiceEntity.entityType, 'assets'),
      ...where?.vehicleId ? [eq(vehicleServiceEntity.entityId, where?.vehicleId)] : [],
    ]))
    query.innerJoin(driverServiceEntity, and(...[
      eq(services.id, driverServiceEntity.serviceId),
      eq(driverServiceEntity.role, 'driver'),
      eq(driverServiceEntity.entityType, 'employees'),
      ...where?.driverId ? [eq(driverServiceEntity.entityId, where?.driverId)] : [],
    ]))
    if(where?.helperId){
      query.innerJoin(helperServiceEntity, and(...[
        eq(services.id, helperServiceEntity.serviceId),
        eq(helperServiceEntity.role, 'helper'),
        eq(helperServiceEntity.entityType, 'employees'),
        eq(helperServiceEntity.entityId, where?.helperId)
      ]))
    }else{
      query.leftJoin(helperServiceEntity, and(...[
        eq(services.id, helperServiceEntity.serviceId),
        eq(helperServiceEntity.role, 'helper'),
        eq(helperServiceEntity.entityType, 'employees'),
      ]))
    }

    query.leftJoin(vehicleAsset, eq(vehicleServiceEntity?.entityId, vehicleAsset?.id))
    query.leftJoin(driverEmployee, eq(driverServiceEntity?.entityId, driverEmployee?.id))
    query.leftJoin(helperEmployee, eq(helperServiceEntity?.entityId, helperEmployee?.id))

    query = addWhere(query, context?.session?.activeOrganizationId, services, where, search)
    query = addOrder(query, services, sort)

    const result = await query
    const count = result?.length
    const tripCalculations = getTripCalculations(result, where?.typeId)
    

    return {
      result,
      count,
      ...tripCalculations
    }
  })

export const getTripCalculations = (result: AnyType[], typeId: string) => {
  if(typeId === "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM"){
    return {
      totalTrips: result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + (item.count || 0), 0),
      totalFuel: result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + ((item?.route?.expense?.fuel * item.count) || 0), 0),
      totalFuelExpense: result?.flatMap((trip: AnyType) => trip?.metadata?.expenses?.find((expense: AnyType) => expense.description === "Fuel") || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0),
      totalExpenses: result?.flatMap((trip: AnyType) => trip?.metadata?.expenses || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0)
    }
  }
  if(typeId === "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I"){
    return {
      totalTrips: result?.flatMap((trip: AnyType) => trip?.metadata?.items || [])?.reduce((total: number, _: AnyType) => total + 1, 0),
      totalFare: result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0),
      totalExpenses: result?.flatMap((trip: AnyType) => trip?.metadata?.expenses || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0),
      totalPayments: result?.flatMap((trip: AnyType) => trip?.metadata?.payments || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0),
      totalBalance: result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0) - result?.flatMap((trip: AnyType) => trip?.metadata?.payments || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0)
    }
  }
}

export const createTrip = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: AnyType
  }) => data)
  .handler(async ({ context, data }): Promise<AnyType> => {
    const { values } = data

    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx.insert(services).values({
          id: generateId(),
          from: new Date(values?.date),
          to: endOfDay(new Date(values?.date)),
          status: "completed",
          metadata: {
            items: values?.items,
            expenses: values?.expenses,
            ...values?.routes ? { routes: values?.routes } : {},
            ...values?.fuelPrice ? { fuelPrice: values?.fuelPrice } : {},
            ...values?.payments ? { payments: values?.payments } : {},
            ...values?.customer ? { customer: {
              name: values?.customer,
              ...values?.phone ? { phone: values?.phone } : {},
              ...values?.reference ? { reference: values?.reference } : {},
            } } : {},
          },
          typeId: values?.type === "depot" ? "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM" : "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I",
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()

        await tx.insert(serviceEntities).values([
          ...values?.type === "depot" ? [{
            id: generateId(),
            role: "customer",
            status: "attended",
            entityType: "partners",
            entityId: "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf",
            serviceId: result?.id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          }] : [],
          ...values?.vehicleId ? [{
            id: generateId(),
            role: "vehicle",
            status: "attended",
            entityType: "assets",
            entityId: values?.vehicleId,
            serviceId: result?.id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          }] : [],
          ...values?.driverId ? [{
            id: generateId(),
            role: "driver",
            status: "attended",
            entityType: "employees",
            entityId: values?.driverId,
            serviceId: result?.id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          }] : [],
          ...values?.helperId ? [{
            id: generateId(),
            role: "helper",
            status: "attended",
            entityType: "employees",
            entityId: values?.helperId,
            serviceId: result?.id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          }] : [],
        ])

        return {
          ...result,
          message: "Trip Created Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })

export const updateTrip = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: AnyType,
    id: AnyType
  }) => data)
  .handler(async ({ context, data }): Promise<AnyType> => {
    const { values, id } = data
    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx.update(services).set({
          from: new Date(values?.date),
          to: endOfDay(new Date(values?.date)),
          metadata: {
            items: values?.items,
            expenses: values?.expenses,
            ...values?.routes ? { routes: values?.routes } : {},
            ...values?.fuelPrice ? { fuelPrice: values?.fuelPrice } : {},
            ...values?.payments ? { payments: values?.payments } : {},
            ...values?.customer ? { customer: {
              name: values?.customer,
              ...values?.phone ? { phone: values?.phone } : {},
              ...values?.reference ? { reference: values?.reference } : {},
            } } : {},
          },
          updatedBy: context?.user?.id,
        }).where(eq(services.id, id)).returning()

        const existing = await tx.query.serviceEntities.findMany({
          where: eq(serviceEntities.serviceId, id)
        })

        const vehicle = existing?.find((entity) => entity?.role === 'vehicle' && entity?.entityType === 'assets')
        const driver = existing?.find((entity) => entity?.role === 'driver' && entity?.entityType === 'employees')
        const helper = existing?.find((entity) => entity?.role === 'helper' && entity?.entityType === 'employees')
        const customer = existing?.find((entity) => entity?.role === 'customer' && entity?.entityType === 'customers')

        if(!vehicle && values?.vehicleId){
          await tx.insert(serviceEntities).values({
            id: generateId(),
            role: "vehicle",
            status: "attended",
            entityType: "assets",
            entityId: values?.vehicleId,
            serviceId: id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          })
        }
        if(vehicle && values?.vehicleId && vehicle?.entityId !== values?.vehicleId){
          await tx.update(serviceEntities).set({
            entityId: values?.vehicleId,
            updatedBy: context?.user?.id,
          }).where(eq(serviceEntities.id, vehicle?.id))
        }
        if(vehicle && !values?.vehicleId){
          await tx.delete(serviceEntities).where(eq(serviceEntities.id, vehicle?.id))
        }

        if(!driver && values?.driverId){
          await tx.insert(serviceEntities).values({
            id: generateId(),
            role: "driver",
            status: "attended",
            entityType: "employees",
            entityId: values?.driverId,
            serviceId: id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          })
        }
        if(driver && values?.driverId && driver?.entityId !== values?.driverId){
          await tx.update(serviceEntities).set({
            entityId: values?.driverId,
            updatedBy: context?.user?.id,
          }).where(eq(serviceEntities.id, driver?.id))
        }
        if(driver && !values?.driverId){
          await tx.delete(serviceEntities).where(eq(serviceEntities.id, driver?.id))
        }

        if(!helper && values?.helperId){
          await tx.insert(serviceEntities).values({
            id: generateId(),
            role: "helper",
            status: "attended",
            entityType: "employees",
            entityId: values?.helperId,
            serviceId: id,
            organizationId: context?.session?.activeOrganizationId,
            createdBy: context?.user?.id
          })
        }
        if(helper && values?.helperId && helper?.entityId !== values?.helperId){
          await tx.update(serviceEntities).set({
            entityId: values?.helperId,
            updatedBy: context?.user?.id,
          }).where(eq(serviceEntities.id, helper?.id))
        }
        if(helper && !values?.helperId){
          await tx.delete(serviceEntities).where(eq(serviceEntities.id, helper?.id))
        }

        return {
          ...result,
          message: "Trip Updated Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })

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