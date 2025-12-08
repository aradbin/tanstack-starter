/**
 * Custom hook for managing trip form state and logic
 * Separates business logic from UI components for clean architecture
 */

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/providers/auth-provider"
import { getTripById } from "./-utils"
import type {
  Route,
  RouteConfigSnapshot,
  TripFormItem,
  TripFormExpense,
  TripInput,
} from "./-types"

interface UseTripFormProps {
  id?: string
  defaultDate?: Date
}

interface UseTripFormReturn {
  // Form state
  items: TripFormItem[]
  expenses: TripFormExpense[]
  fixedExpenses: TripFormExpense[]
  availableRoutes: Route[]
  fuelPrice: number

  // Actions
  setItems: React.Dispatch<React.SetStateAction<TripFormItem[]>>
  setExpenses: React.Dispatch<React.SetStateAction<TripFormExpense[]>>
  setFixedExpenses: React.Dispatch<React.SetStateAction<TripFormExpense[]>>
  addItem: () => void
  removeItem: (index: number) => void
  updateItem: (index: number, updates: Partial<TripFormItem>) => void
  addExpense: () => void
  removeExpense: (index: number) => void
  updateExpense: (index: number, updates: Partial<TripFormExpense>) => void

  // Calculations
  calculateFixedExpenses: () => void
  getTotalExpenses: () => number
  getTotalTripCount: () => number

  // Converters
  convertToTripInput: (formValues: any) => TripInput

  // Loading state
  isLoading: boolean
  initialData: any
}

export function useTripForm({
  id,
  defaultDate,
}: UseTripFormProps): UseTripFormReturn {
  const { user } = useAuth()

  // State
  const [items, setItems] = useState<TripFormItem[]>([])
  const [expenses, setExpenses] = useState<TripFormExpense[]>([])
  const [fixedExpenses, setFixedExpenses] = useState<TripFormExpense[]>([])
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([])
  const [fuelPrice, setFuelPrice] = useState<number>(0)

  // Load existing trip data if editing
  const { data: existingTrip, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      if (!id) return null
      return await getTripById({ data: { id } })
    },
    enabled: !!id,
  })

  // Initialize form state
  useEffect(() => {
    if (id && existingTrip) {
      // Editing existing trip
      const snapshot = existingTrip.routeConfigSnapshot as RouteConfigSnapshot

      setAvailableRoutes(snapshot.routes)
      setFuelPrice(snapshot.fuelPrice)

      // Convert trip items to form items
      if (existingTrip.items && existingTrip.items.length > 0) {
        const formItems = existingTrip.items.map((item: any) => ({
          route: snapshot.routes.find(
            (r) => r.from === item.from && r.to === item.to
          ) || null,
          count: item.count,
        }))
        setItems(formItems)
      }

      // Split expenses into fixed and custom
      if (existingTrip.expenses && existingTrip.expenses.length > 0) {
        const fixed = existingTrip.expenses.filter((e: any) =>
          ["fuel", "toll", "tips"].includes(e.expenseType)
        )
        const custom = existingTrip.expenses.filter(
          (e: any) => !["fuel", "toll", "tips"].includes(e.expenseType)
        )

        setFixedExpenses(
          fixed.map((e: any) => ({
            description: e.description,
            amount: parseFloat(e.amount),
            expenseType: e.expenseType,
          }))
        )
        setExpenses(
          custom.map((e: any) => ({
            description: e.description,
            amount: parseFloat(e.amount),
            expenseType: e.expenseType,
          }))
        )
      }
    } else if (!id && user) {
      // Creating new trip - load org config
      const orgMetadata = JSON.parse(
        user?.activeOrganization?.metadata || "{}"
      )
      const routes = orgMetadata.tripRoutesDepot || []
      const price = orgMetadata.fuelPrice || 0

      setAvailableRoutes(routes)
      setFuelPrice(price)

      // Initialize with one default item
      if (routes.length > 0) {
        const defaultRoute = routes.find((r: Route) => r.to === "PL") || routes[0]
        setItems([{ route: defaultRoute, count: 1 }])

        // Initialize fixed expenses
        if (defaultRoute) {
          setFixedExpenses([
            { description: "Toll", amount: defaultRoute.expense.toll, expenseType: "toll" },
            { description: "Tips", amount: defaultRoute.expense.tips, expenseType: "tips" },
            { description: "Fuel", amount: defaultRoute.expense.fuel * price, expenseType: "fuel" },
          ])
        }
      }
    }
  }, [id, existingTrip, user])

  // Recalculate fixed expenses when items change
  useEffect(() => {
    if (items.length > 0 && !id) {
      calculateFixedExpenses()
    }
  }, [items, fuelPrice])

  // Item actions
  const addItem = () => {
    setItems((prev) => [...prev, { route: null, count: 1 }])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<TripFormItem>) => {
    setItems((prev) => {
      const newItems = [...prev]
      newItems[index] = { ...newItems[index], ...updates }
      return newItems
    })
  }

  // Expense actions
  const addExpense = () => {
    setExpenses((prev) => [
      ...prev,
      { description: "", amount: 0, expenseType: "other" },
    ])
  }

  const removeExpense = (index: number) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index))
  }

  const updateExpense = (index: number, updates: Partial<TripFormExpense>) => {
    setExpenses((prev) => {
      const newExpenses = [...prev]
      newExpenses[index] = { ...newExpenses[index], ...updates }
      return newExpenses
    })
  }

  // Calculate fixed expenses based on items
  const calculateFixedExpenses = () => {
    const totals = {
      toll: 0,
      tips: 0,
      fuel: 0,
    }

    items.forEach((item) => {
      if (item.route) {
        totals.toll += item.route.expense.toll * item.count
        totals.tips += item.route.expense.tips * item.count
        totals.fuel += item.route.expense.fuel * item.count * fuelPrice
      }
    })

    setFixedExpenses([
      { description: "Toll", amount: totals.toll, expenseType: "toll" },
      { description: "Tips", amount: totals.tips, expenseType: "tips" },
      { description: "Fuel", amount: totals.fuel, expenseType: "fuel" },
    ])
  }

  // Calculations
  const getTotalExpenses = () => {
    const fixedTotal = fixedExpenses.reduce((sum, e) => sum + e.amount, 0)
    const customTotal = expenses.reduce((sum, e) => sum + e.amount, 0)
    return Math.round((fixedTotal + customTotal) * 100) / 100
  }

  const getTotalTripCount = () => {
    return items.reduce((sum, item) => sum + (item.count || 0), 0)
  }

  // Convert form state to TripInput for API
  const convertToTripInput = (formValues: any): TripInput => {
    // Build route config snapshot
    const routeConfigSnapshot: RouteConfigSnapshot = {
      routes: availableRoutes,
      fuelPrice,
    }

    // Convert items
    const tripItems = items
      .filter((item) => item.route && item.count)
      .map((item) => ({
        from: item.route!.from,
        to: item.route!.to,
        count: item.count,
      }))

    // Combine all expenses
    const allExpenses = [
      ...fixedExpenses.filter((e) => e.description && e.amount),
      ...expenses.filter((e) => e.description && e.amount),
    ].map((e) => ({
      expenseType: e.expenseType || "other",
      description: e.description,
      amount: e.amount,
    }))

    return {
      date: formValues.date,
      vehicleId: formValues.vehicleId,
      driverId: formValues.driverId,
      helperId: formValues.helperId || undefined,
      notes: formValues.notes,
      routeConfigSnapshot,
      items: tripItems,
      expenses: allExpenses,
    }
  }

  return {
    // State
    items,
    expenses,
    fixedExpenses,
    availableRoutes,
    fuelPrice,

    // Actions
    setItems,
    setExpenses,
    setFixedExpenses,
    addItem,
    removeItem,
    updateItem,
    addExpense,
    removeExpense,
    updateExpense,

    // Calculations
    calculateFixedExpenses,
    getTotalExpenses,
    getTotalTripCount,

    // Converters
    convertToTripInput,

    // Loading
    isLoading,
    initialData: existingTrip,
  }
}
