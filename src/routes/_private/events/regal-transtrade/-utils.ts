import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { addOrder, addPagination, addWhere, QueryParamBaseType } from "@/lib/db/functions"
import { assets, customers, employees, eventEntities, events } from "@/lib/db/schema"
import { AnyType } from "@/lib/types"
import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"
import { endOfDay } from "date-fns"
import { and, eq, getTableColumns } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const getTrips = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: QueryParamBaseType) => data)
  .handler(async ({ context, data }): Promise<AnyType> => {
    const { sort, pagination, where, search } = data

    const vehicleEventEntity = alias(eventEntities, 'vehicle_event_entity')
    const vehicleAsset = alias(assets, 'vehicle_asset')
    const driverEventEntity = alias(eventEntities, 'driver_event_entity')
    const driverEmployee = alias(employees, 'driver_employee')
    const helperEventEntity = alias(eventEntities, 'helper_event_entity')
    const helperEmployee = alias(employees, 'helper_employee')
    
    let query = db.select({
      ...getTableColumns(events),
      vehicle: getTableColumns(vehicleAsset),
      driver: getTableColumns(driverEmployee),
      helper: getTableColumns(helperEmployee),
    }).from(events)

    query.innerJoin(vehicleEventEntity, and(...[
      eq(events.id, vehicleEventEntity.eventId),
      eq(vehicleEventEntity.role, 'vehicle'),
      eq(vehicleEventEntity.entityType, 'assets'),
      ...where?.vehicleId ? [eq(vehicleEventEntity.entityId, where?.vehicleId)] : [],
    ]))
    query.innerJoin(driverEventEntity, and(...[
      eq(events.id, driverEventEntity.eventId),
      eq(driverEventEntity.role, 'driver'),
      eq(driverEventEntity.entityType, 'employees'),
      ...where?.driverId ? [eq(driverEventEntity.entityId, where?.driverId)] : [],
    ]))
    if(where?.helperId){
      query.innerJoin(helperEventEntity, and(...[
        eq(events.id, helperEventEntity.eventId),
        eq(helperEventEntity.role, 'helper'),
        eq(helperEventEntity.entityType, 'employees'),
        eq(helperEventEntity.entityId, where?.helperId)
      ]))
    }else{
      query.leftJoin(helperEventEntity, and(...[
        eq(events.id, helperEventEntity.eventId),
        eq(helperEventEntity.role, 'helper'),
        eq(helperEventEntity.entityType, 'employees'),
      ]))
    }

    query.leftJoin(vehicleAsset, eq(vehicleEventEntity?.entityId, vehicleAsset?.id))
    query.leftJoin(driverEmployee, eq(driverEventEntity?.entityId, driverEmployee?.id))
    query.leftJoin(helperEmployee, eq(helperEventEntity?.entityId, helperEmployee?.id))

    query = addWhere(query, context?.session?.activeOrganizationId, events, where, search)
    query = addOrder(query, events, sort)
    query = addPagination(query, pagination)

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
        const [result] = await tx.insert(events).values({
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
            ...values?.customer ? { customer: values?.customer } : {},
            ...values?.phone ? { phone: values?.phone } : {},
            ...values?.reference ? { reference: values?.reference } : {},
          },
          typeId: values?.type === "depot" ? "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM" : "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I",
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()

        let customerId: string | undefined = "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf" // depot
        
        if(values?.type === "district"){
          let hasCustomer = await tx.query.customers.findMany({
            where: and(
              eq(customers.organizationId, context?.session?.activeOrganizationId),
              eq(customers.name, values?.customer),
              eq(customers.phone, values?.phone),
            )
          })
          if(!hasCustomer?.length){
            hasCustomer = await tx.insert(customers).values({
              id: generateId(),
              name: values?.customer,
              phone: values?.phone,
              businessType: "individual",
              organizationId: context?.session?.activeOrganizationId,
              createdBy: context?.user?.id,
            }).returning()
          }
          customerId = hasCustomer?.[0]?.id
        }

        await tx.insert(eventEntities).values([
          {
            id: generateId(),
            role: "customer",
            status: "attended",
            entityType: "customers",
            entityId: customerId,
            eventId: result?.id,
            createdBy: context?.user?.id
          },
          ...values?.vehicleId ? [{
            id: generateId(),
            role: "vehicle",
            status: "attended",
            entityType: "assets",
            entityId: values?.vehicleId,
            eventId: result?.id,
            createdBy: context?.user?.id
          }] : [],
          ...values?.driverId ? [{
            id: generateId(),
            role: "driver",
            status: "attended",
            entityType: "employees",
            entityId: values?.driverId,
            eventId: result?.id,
            createdBy: context?.user?.id
          }] : [],
          ...values?.helperId ? [{
            id: generateId(),
            role: "helper",
            status: "attended",
            entityType: "employees",
            entityId: values?.helperId,
            eventId: result?.id,
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
        const [result] = await tx.update(events).set({
          from: new Date(values?.date),
          to: endOfDay(new Date(values?.date)),
          metadata: {
            items: values?.items,
            expenses: values?.expenses,
            ...values?.routes ? { routes: values?.routes } : {},
            ...values?.fuelPrice ? { fuelPrice: values?.fuelPrice } : {},
            ...values?.payments ? { payments: values?.payments } : {},
            ...values?.customer ? { customer: values?.customer } : {},
            ...values?.phone ? { phone: values?.phone } : {},
            ...values?.reference ? { reference: values?.reference } : {},
          },
          updatedBy: context?.user?.id,
        }).where(eq(events.id, id)).returning()

        const existing = await tx.query.eventEntities.findMany({
          where: eq(eventEntities.eventId, id)
        })

        const vehicle = existing?.find((entity) => entity?.role === 'vehicle' && entity?.entityType === 'assets')
        const driver = existing?.find((entity) => entity?.role === 'driver' && entity?.entityType === 'employees')
        const helper = existing?.find((entity) => entity?.role === 'helper' && entity?.entityType === 'employees')
        const customer = existing?.find((entity) => entity?.role === 'customer' && entity?.entityType === 'customers')

        if(!vehicle && values?.vehicleId){
          await tx.insert(eventEntities).values({
            id: generateId(),
            role: "vehicle",
            status: "attended",
            entityType: "assets",
            entityId: values?.vehicleId,
            eventId: id,
            createdBy: context?.user?.id
          })
        }
        if(vehicle && values?.vehicleId && vehicle?.entityId !== values?.vehicleId){
          await tx.update(eventEntities).set({
            entityId: values?.vehicleId,
            updatedBy: context?.user?.id,
          }).where(eq(eventEntities.id, vehicle?.id))
        }
        if(vehicle && !values?.vehicleId){
          await tx.delete(eventEntities).where(eq(eventEntities.id, vehicle?.id))
        }

        if(!driver && values?.driverId){
          await tx.insert(eventEntities).values({
            id: generateId(),
            role: "driver",
            status: "attended",
            entityType: "employees",
            entityId: values?.driverId,
            eventId: id,
            createdBy: context?.user?.id
          })
        }
        if(driver && values?.driverId && driver?.entityId !== values?.driverId){
          await tx.update(eventEntities).set({
            entityId: values?.driverId,
            updatedBy: context?.user?.id,
          }).where(eq(eventEntities.id, driver?.id))
        }
        if(driver && !values?.driverId){
          await tx.delete(eventEntities).where(eq(eventEntities.id, driver?.id))
        }

        if(!helper && values?.helperId){
          await tx.insert(eventEntities).values({
            id: generateId(),
            role: "helper",
            status: "attended",
            entityType: "employees",
            entityId: values?.helperId,
            eventId: id,
            createdBy: context?.user?.id
          })
        }
        if(helper && values?.helperId && helper?.entityId !== values?.helperId){
          await tx.update(eventEntities).set({
            entityId: values?.helperId,
            updatedBy: context?.user?.id,
          }).where(eq(eventEntities.id, helper?.id))
        }
        if(helper && !values?.helperId){
          await tx.delete(eventEntities).where(eq(eventEntities.id, helper?.id))
        }

        if(values?.customer){
          let customerId: string | undefined = "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf" // depot
        
          if(values?.type === "district"){
            let hasCustomer = await tx.query.customers.findMany({
              where: and(
                eq(customers.organizationId, context?.session?.activeOrganizationId),
                eq(customers.name, values?.customer),
                eq(customers.phone, values?.phone),
              )
            })
            if(!hasCustomer?.length){
              hasCustomer = await tx.insert(customers).values({
                id: generateId(),
                name: values?.customer,
                phone: values?.phone,
                businessType: "individual",
                organizationId: context?.session?.activeOrganizationId,
                createdBy: context?.user?.id,
              }).returning()
            }
            customerId = hasCustomer?.[0]?.id
          }
          if(!customer){
            await tx.insert(eventEntities).values({
              id: generateId(),
              role: "customer",
              status: "attended",
              entityType: "customers",
              entityId: customerId,
              eventId: id,
              createdBy: context?.user?.id
            })
          }
          if(customer && customer?.entityId !== customerId){
            await tx.update(eventEntities).set({
              entityId: customerId,
              updatedBy: context?.user?.id,
            }).where(eq(eventEntities.id, customer?.id))
          }
        }
        if(customer && !values?.customer){
          await tx.delete(eventEntities).where(eq(eventEntities.id, customer?.id))
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
