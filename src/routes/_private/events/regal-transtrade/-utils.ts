import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { addOrder, addPagination, addWhere, QueryParamBaseType } from "@/lib/db/functions"
import { assets, employees, eventParticipants, events } from "@/lib/db/schema"
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

    const vehicleEventParticipant = alias(eventParticipants, 'vehicle_event_participant')
    const vehicleAsset = alias(assets, 'vehicle_asset')
    const driverEventParticipant = alias(eventParticipants, 'driver_event_participant')
    const driverEmployee = alias(employees, 'driver_employee')
    const helperEventParticipant = alias(eventParticipants, 'helper_event_participant')
    const helperEmployee = alias(employees, 'helper_employee')
    
    let query = db.select({
      ...getTableColumns(events),
      vehicle: getTableColumns(vehicleAsset),
      driver: getTableColumns(driverEmployee),
      helper: getTableColumns(helperEmployee),
    }).from(events)

    query.innerJoin(vehicleEventParticipant, and(...[
      eq(events.id, vehicleEventParticipant.eventId),
      eq(vehicleEventParticipant.role, 'vehicle'),
      eq(vehicleEventParticipant.participantType, 'assets'),
      ...where?.vehicleId ? [eq(vehicleEventParticipant.participantId, where?.vehicleId)] : [],
    ]))
    query.innerJoin(driverEventParticipant, and(...[
      eq(events.id, driverEventParticipant.eventId),
      eq(driverEventParticipant.role, 'driver'),
      eq(driverEventParticipant.participantType, 'employees'),
      ...where?.driverId ? [eq(driverEventParticipant.participantId, where?.driverId)] : [],
    ]))
    if(where?.helperId){
      query.innerJoin(helperEventParticipant, and(...[
        eq(events.id, helperEventParticipant.eventId),
        eq(helperEventParticipant.role, 'helper'),
        eq(helperEventParticipant.participantType, 'employees'),
        eq(helperEventParticipant.participantId, where?.helperId)
      ]))
    }else{
      query.leftJoin(helperEventParticipant, and(...[
        eq(events.id, helperEventParticipant.eventId),
        eq(helperEventParticipant.role, 'helper'),
        eq(helperEventParticipant.participantType, 'employees'),
      ]))
    }

    query.leftJoin(vehicleAsset, eq(vehicleEventParticipant?.participantId, vehicleAsset?.id))
    query.leftJoin(driverEmployee, eq(driverEventParticipant?.participantId, driverEmployee?.id))
    query.leftJoin(helperEmployee, eq(helperEventParticipant?.participantId, helperEmployee?.id))

    query = addWhere(query, context?.session?.activeOrganizationId, events, where, search)
    query = addOrder(query, events, sort)
    query = addPagination(query, pagination)

    const result = await query
    const count = result?.length
    const totalTrips = result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + (item.count || 0), 0)
    const totalFuel = result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + ((item?.route?.expense?.fuel * item.count) || 0), 0)
    const totalExpenses = result?.flatMap((trip: AnyType) => trip?.metadata?.expenses || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0)

    return {
      result,
      count,
      totalTrips,
      totalFuel,
      totalExpenses,
    }
  })

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
          metadata: {
            items: values?.items,
            expenses: values?.expenses,
            ...values?.routes ? { routes: values?.routes } : {},
            ...values?.fuelPrice ? { fuelPrice: values?.fuelPrice } : {},
            ...values?.payments ? { payments: values?.payments } : {},
            ...values?.customer ? { customer: values?.customer } : {},
            ...values?.reference ? { reference: values?.reference } : {},
          },
          typeId: values?.type === "depot" ? "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM" : "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I",
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()

        await tx.insert(eventParticipants).values([
          ...values?.vehicleId ? [{
            id: generateId(),
            role: "vehicle",
            participantType: "assets",
            participantId: values?.vehicleId,
            eventId: result?.id,
            createdBy: context?.user?.id
          }] : [],
          ...values?.driverId ? [{
            id: generateId(),
            role: "driver",
            participantType: "employees",
            participantId: values?.driverId,
            eventId: result?.id,
            createdBy: context?.user?.id
          }] : [],
          ...values?.helperId ? [{
            id: generateId(),
            role: "helper",
            participantType: "employees",
            participantId: values?.helperId,
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
            ...values?.reference ? { reference: values?.reference } : {},
          },
          updatedBy: context?.user?.id,
        }).where(eq(events.id, id)).returning()

        const existing = await tx.query.eventParticipants.findMany({
          where: eq(eventParticipants.eventId, id)
        })

        const vehicle = existing?.find((participant) => participant?.role === 'vehicle' && participant?.participantType === 'assets')
        const driver = existing?.find((participant) => participant?.role === 'driver' && participant?.participantType === 'employees')
        const helper = existing?.find((participant) => participant?.role === 'helper' && participant?.participantType === 'employees')

        if(!vehicle && values?.vehicleId){
          await tx.insert(eventParticipants).values({
            id: generateId(),
            role: "vehicle",
            participantType: "assets",
            participantId: values?.vehicleId,
            eventId: id,
            createdBy: context?.user?.id
          })
        }
        if(vehicle && values?.vehicleId && vehicle?.participantId !== values?.vehicleId){
          await tx.update(eventParticipants).set({
            participantId: values?.vehicleId,
            updatedBy: context?.user?.id,
          }).where(eq(eventParticipants.id, vehicle?.id))
        }
        if(vehicle && !values?.vehicleId){
          await tx.delete(eventParticipants).where(eq(eventParticipants.id, vehicle?.id))
        }

        if(!driver && values?.driverId){
          await tx.insert(eventParticipants).values({
            id: generateId(),
            role: "driver",
            participantType: "employees",
            participantId: values?.driverId,
            eventId: id,
            createdBy: context?.user?.id
          })
        }
        if(driver && values?.driverId && driver?.participantId !== values?.driverId){
          await tx.update(eventParticipants).set({
            participantId: values?.driverId,
            updatedBy: context?.user?.id,
          }).where(eq(eventParticipants.id, driver?.id))
        }
        if(driver && !values?.driverId){
          await tx.delete(eventParticipants).where(eq(eventParticipants.id, driver?.id))
        }

        if(!helper && values?.helperId){
          await tx.insert(eventParticipants).values({
            id: generateId(),
            role: "helper",
            participantType: "employees",
            participantId: values?.helperId,
            eventId: id,
            createdBy: context?.user?.id
          })
        }
        if(helper && values?.helperId && helper?.participantId !== values?.helperId){
          await tx.update(eventParticipants).set({
            participantId: values?.helperId,
            updatedBy: context?.user?.id,
          }).where(eq(eventParticipants.id, helper?.id))
        }
        if(helper && !values?.helperId){
          await tx.delete(eventParticipants).where(eq(eventParticipants.id, helper?.id))
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
