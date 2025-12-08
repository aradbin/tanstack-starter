/**
 * Type definitions for the trips system
 * Clean, well-structured types for type safety across the application
 */

// Route configuration types
export interface RouteExpense {
  toll: number
  tips: number
  fuel: number // liters per trip
}

export interface RouteIncome {
  fixed: number // fixed income per trip
  fuel: number // fuel-based income (liters)
}

export interface Route {
  from: string
  to: string
  expense: RouteExpense
  income: RouteIncome
}

export interface RouteConfigSnapshot {
  routes: Route[]
  fuelPrice: number // price per liter
}

// Trip item types
export interface TripItemInput {
  from: string
  to: string
  count: number
}

export interface TripItem extends TripItemInput {
  id: string
  tripId: string
  // Expense rates
  tollRate: number
  tipsRate: number
  fuelLitersRate: number
  fuelPricePerLiter: number
  // Income rates
  incomeFixedRate: number
  incomeFuelRate: number
  // Expense totals
  tollTotal: number
  tipsTotal: number
  fuelLitersTotal: number
  fuelExpenseTotal: number
  // Income totals
  incomeFixedTotal: number
  incomeFuelTotal: number
  incomeTotal: number
  createdAt: Date
  updatedAt: Date | null
}

// Expense types
export type ExpenseType = 'fuel' | 'toll' | 'tips' | 'maintenance' | 'other'

export interface TripExpenseInput {
  expenseType: ExpenseType
  description: string
  amount: number
  metadata?: {
    receipt?: string
    vendor?: string
    paymentMethod?: string
  }
}

export interface TripExpense extends TripExpenseInput {
  id: string
  tripId: string
  createdAt: Date
  updatedAt: Date | null
}

// Trip types - Simplified for depot trips only

export interface TripInput {
  date: string | Date
  vehicleId: string
  driverId: string
  helperId?: string
  notes?: string
  routeConfigSnapshot: RouteConfigSnapshot
  items: TripItemInput[]
  expenses?: TripExpenseInput[]
}

export interface Trip {
  id: string
  date: Date
  routeConfigSnapshot: RouteConfigSnapshot
  vehicleId: string | null
  driverId: string | null
  helperId: string | null
  organizationId: string
  notes: string | null
  attachments: string | null
  createdAt: Date
  updatedAt: Date | null
  createdBy: string | null
  updatedBy: string | null
}

// Trip with relationships
export interface TripWithRelations extends Trip {
  vehicle?: {
    id: string
    name: string
    registrationNumber: string
  }
  driver?: {
    id: string
    firstName: string
    lastName: string
  }
  helper?: {
    id: string
    firstName: string
    lastName: string
  }
  items: TripItem[]
  expenses: TripExpense[]
}

// Calculation results
export interface DepotTripCalculations {
  totalTrips: number
  totalFuel: number
  totalFuelExpense: number
  totalExpenses: number
  totalIncome: number
  totalIncomeFixed: number
  totalIncomeFuel: number
}

// Query/filter types
export interface TripFilters {
  vehicleId?: string
  driverId?: string
  helperId?: string
  dateFrom?: Date | string
  dateTo?: Date | string
}

export interface TripQueryResult {
  trips: TripWithRelations[]
  count: number
  calculations?: DepotTripCalculations
}

// Form state types
export interface TripFormItem {
  route: Route | null
  count: number
}

export interface TripFormExpense {
  description: string
  amount: number
  expenseType?: ExpenseType
}

export interface TripFormState {
  date: string
  vehicleId: string
  driverId: string
  helperId?: string
  items: TripFormItem[]
  expenses: TripFormExpense[]
  fixedExpenses: TripFormExpense[]
  notes?: string
}
