import { getDatas, QueryParamType } from "@/lib/db/functions"
import { trips } from "@/lib/db/schema"

export const getTrips = async (
  input: { data: QueryParamType }
) => {
  const response = await getDatas(input)

  let totalTrips = 0
  let totalFuel = 0
  let totalExpense = 0
  let totalIncome = 0

  response?.result?.forEach((trip: typeof trips.$inferSelect) => {
    totalTrips += Number(trip?.count) || 0
    totalFuel += Number(trip?.fuel) || 0
    totalExpense += Number(trip?.expense) || 0
    totalIncome += Number(trip?.income) || 0
  })

  return {
    ...response,
    totalTrips,
    totalFuel,
    totalExpense,
    totalIncome
  }
}