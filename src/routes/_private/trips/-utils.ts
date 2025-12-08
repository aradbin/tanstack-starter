/**
 * Optimized server functions for trip management
 * Clean, efficient queries with proper error handling and type safety
 */

import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"
import { and, eq, gte, lte, desc } from "drizzle-orm"
import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import {
  trips,
  tripItems,
  tripExpenses,
} from "@/lib/db/schema"
import type {
  TripInput,
  TripFilters,
  TripQueryResult,
  DepotTripCalculations,
} from "./-types"

/**
 * Get trips with optimized query and aggregations
 */
export const getTrips = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: { filters?: TripFilters }) => data)
  .handler(async ({ context, data }): Promise<TripQueryResult> => {
    const { filters = {} } = data
    const organizationId = context.session.activeOrganizationId

    // Build where conditions
    const conditions = [eq(trips.organizationId, organizationId)]

    if (filters.vehicleId) {
      conditions.push(eq(trips.vehicleId, filters.vehicleId))
    }
    if (filters.driverId) {
      conditions.push(eq(trips.driverId, filters.driverId))
    }
    if (filters.helperId) {
      conditions.push(eq(trips.helperId, filters.helperId))
    }
    if (filters.dateFrom) {
      conditions.push(gte(trips.date, filters.dateFrom.toString()))
    }
    if (filters.dateTo) {
      conditions.push(lte(trips.date, filters.dateTo.toString()))
    }

    // Fetch trips with relations
    const result = await db.query.trips.findMany({
      where: and(...conditions),
      with: {
        vehicle: true,
        driver: true,
        helper: true,
        items: {
          orderBy: (items, { asc }) => [asc(items.createdAt)],
        },
        expenses: {
          orderBy: (expenses, { asc }) => [asc(expenses.expenseType)],
        },
      },
      orderBy: [desc(trips.date), desc(trips.createdAt)],
    })

    // Calculate aggregations
    const calculations = calculateDepotTripAggregates(result)

    return {
      trips: result as any,
      count: result.length,
      calculations,
    }
  })

/**
 * Get single trip by ID
 */
export const getTripById = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    const trip = await db.query.trips.findFirst({
      where: and(
        eq(trips.id, data.id),
        eq(trips.organizationId, context.session.activeOrganizationId)
      ),
      with: {
        vehicle: true,
        driver: true,
        helper: true,
        items: true,
        expenses: true,
      },
    })

    if (!trip) {
      throw new Error("Trip not found")
    }

    return trip as any
  })

/**
 * Create a new trip
 */
export const createTrip = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: { trip: TripInput }) => data)
  .handler(async ({ context, data }) => {
    const { trip: tripData } = data
    const userId = context.user.id
    const organizationId = context.session.activeOrganizationId

    try {
      return await db.transaction(async (tx) => {
        const [newTrip] = await tx
          .insert(trips)
          .values({
            id: generateId(),
            date: tripData.date.toString(),
            routeConfigSnapshot: tripData.routeConfigSnapshot,
            vehicleId: tripData.vehicleId,
            driverId: tripData.driverId,
            helperId: tripData.helperId || null,
            notes: tripData.notes || null,
            organizationId,
            createdBy: userId,
          })
          .returning()

        if (tripData.items && tripData.items.length > 0) {
          const itemsToInsert = tripData.items.map((item) => {
            const route = tripData.routeConfigSnapshot.routes.find(
              (r) => r.from === item.from && r.to === item.to
            )

            if (!route) {
              throw new Error(`Route ${item.from} to ${item.to} not found`)
            }

            const { toll, tips, fuel } = route.expense
            const { fixed: incomeFixed, fuel: incomeFuel } = route.income
            const fuelPrice = tripData.routeConfigSnapshot.fuelPrice

            // Calculate totals
            const incomeFuelTotal = incomeFuel * item.count * fuelPrice
            const incomeFixedTotal = incomeFixed * item.count

            return {
              id: generateId(),
              tripId: newTrip.id,
              from: item.from,
              to: item.to,
              count: item.count,
              // Expense rates
              tollRate: toll.toString(),
              tipsRate: tips.toString(),
              fuelLitersRate: fuel.toString(),
              fuelPricePerLiter: fuelPrice.toString(),
              // Income rates
              incomeFixedRate: incomeFixed.toString(),
              incomeFuelRate: incomeFuel.toString(),
              // Expense totals
              tollTotal: (toll * item.count).toString(),
              tipsTotal: (tips * item.count).toString(),
              fuelLitersTotal: (fuel * item.count).toString(),
              fuelExpenseTotal: (fuel * item.count * fuelPrice).toString(),
              // Income totals
              incomeFixedTotal: incomeFixedTotal.toString(),
              incomeFuelTotal: incomeFuelTotal.toString(),
              incomeTotal: (incomeFixedTotal + incomeFuelTotal).toString(),
              createdBy: userId,
            }
          })

          await tx.insert(tripItems).values(itemsToInsert)
        }

        if (tripData.expenses && tripData.expenses.length > 0) {
          const expensesToInsert = tripData.expenses.map((expense) => ({
            id: generateId(),
            tripId: newTrip.id,
            expenseType: expense.expenseType,
            description: expense.description,
            amount: expense.amount.toString(),
            metadata: expense.metadata || null,
            createdBy: userId,
          }))

          await tx.insert(tripExpenses).values(expensesToInsert)
        }

        return {
          id: newTrip.id,
          message: "Trip created successfully",
        }
      })
    } catch (error) {
      console.error("Error creating trip:", error)
      throw new Error("Failed to create trip. Please try again.")
    }
  })

/**
 * Update an existing trip
 */
export const updateTrip = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: { id: string; trip: TripInput }) => data)
  .handler(async ({ context, data }) => {
    const { id, trip: tripData } = data
    const userId = context.user.id
    const organizationId = context.session.activeOrganizationId

    try {
      return await db.transaction(async (tx) => {
        const existingTrip = await tx.query.trips.findFirst({
          where: and(eq(trips.id, id), eq(trips.organizationId, organizationId)),
        })

        if (!existingTrip) {
          throw new Error("Trip not found")
        }

        await tx
          .update(trips)
          .set({
            date: tripData.date.toString(),
            vehicleId: tripData.vehicleId,
            driverId: tripData.driverId,
            helperId: tripData.helperId || null,
            notes: tripData.notes || null,
            updatedBy: userId,
            updatedAt: new Date(),
          })
          .where(eq(trips.id, id))

        await tx.delete(tripItems).where(eq(tripItems.tripId, id))
        await tx.delete(tripExpenses).where(eq(tripExpenses.tripId, id))

        if (tripData.items && tripData.items.length > 0) {
          const itemsToInsert = tripData.items.map((item) => {
            const route = tripData.routeConfigSnapshot.routes.find(
              (r) => r.from === item.from && r.to === item.to
            )

            if (!route) {
              throw new Error(`Route ${item.from} to ${item.to} not found`)
            }

            const { toll, tips, fuel } = route.expense
            const { fixed: incomeFixed, fuel: incomeFuel } = route.income
            const fuelPrice = tripData.routeConfigSnapshot.fuelPrice

            // Calculate totals
            const incomeFuelTotal = incomeFuel * item.count * fuelPrice
            const incomeFixedTotal = incomeFixed * item.count

            return {
              id: generateId(),
              tripId: id,
              from: item.from,
              to: item.to,
              count: item.count,
              // Expense rates
              tollRate: toll.toString(),
              tipsRate: tips.toString(),
              fuelLitersRate: fuel.toString(),
              fuelPricePerLiter: fuelPrice.toString(),
              // Income rates
              incomeFixedRate: incomeFixed.toString(),
              incomeFuelRate: incomeFuel.toString(),
              // Expense totals
              tollTotal: (toll * item.count).toString(),
              tipsTotal: (tips * item.count).toString(),
              fuelLitersTotal: (fuel * item.count).toString(),
              fuelExpenseTotal: (fuel * item.count * fuelPrice).toString(),
              // Income totals
              incomeFixedTotal: incomeFixedTotal.toString(),
              incomeFuelTotal: incomeFuelTotal.toString(),
              incomeTotal: (incomeFixedTotal + incomeFuelTotal).toString(),
              createdBy: userId,
            }
          })

          await tx.insert(tripItems).values(itemsToInsert)
        }

        if (tripData.expenses && tripData.expenses.length > 0) {
          const expensesToInsert = tripData.expenses.map((expense) => ({
            id: generateId(),
            tripId: id,
            expenseType: expense.expenseType,
            description: expense.description,
            amount: expense.amount.toString(),
            metadata: expense.metadata || null,
            createdBy: userId,
          }))

          await tx.insert(tripExpenses).values(expensesToInsert)
        }

        return {
          id,
          message: "Trip updated successfully",
        }
      })
    } catch (error) {
      console.error("Error updating trip:", error)
      throw new Error("Failed to update trip. Please try again.")
    }
  })

/**
 * Delete a trip
 */
export const deleteTrip = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    const organizationId = context.session.activeOrganizationId

    const trip = await db.query.trips.findFirst({
      where: and(
        eq(trips.id, data.id),
        eq(trips.organizationId, organizationId)
      ),
    })

    if (!trip) {
      throw new Error("Trip not found")
    }

    await db.delete(trips).where(eq(trips.id, data.id))

    return { message: "Trip deleted successfully" }
  })

/**
 * Helper: Calculate depot trip aggregates
 */
function calculateDepotTripAggregates(trips: any[]): DepotTripCalculations {
  let totalTrips = 0
  let totalFuel = 0
  let totalFuelExpense = 0
  let totalExpenses = 0
  let totalIncome = 0
  let totalIncomeFixed = 0
  let totalIncomeFuel = 0

  trips.forEach((trip) => {
    trip.items?.forEach((item: any) => {
      totalTrips += item.count || 0
      totalFuel += parseFloat(item.fuelLitersTotal || "0")
      totalIncome += parseFloat(item.incomeTotal || "0")
      totalIncomeFixed += parseFloat(item.incomeFixedTotal || "0")
      totalIncomeFuel += parseFloat(item.incomeFuelTotal || "0")
    })

    trip.expenses?.forEach((expense: any) => {
      const amount = parseFloat(expense.amount || "0")
      totalExpenses += amount

      if (expense.expenseType === "fuel") {
        totalFuelExpense += amount
      }
    })
  })

  return {
    totalTrips,
    totalFuel: Math.round(totalFuel * 100) / 100,
    totalFuelExpense: Math.round(totalFuelExpense * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalIncomeFixed: Math.round(totalIncomeFixed * 100) / 100,
    totalIncomeFuel: Math.round(totalIncomeFuel * 100) / 100,
  }
}
