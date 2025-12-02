import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryParamType } from "@/lib/db/functions";
import { Link } from "@tanstack/react-router";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getTrips } from "../services/regal-transtrade/-utils";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { depotTripServiceTypeId } from "@/lib/organizations/regal-transtrade";
import { formatCurrency } from "@/lib/utils";

export default function TripSection() {
  const currentMonthQuery: QueryParamType = {
    table: "services",
    where: {
      typeId: depotTripServiceTypeId,
      from: {
        gte: new Date(startOfMonth(new Date())),
        lte: new Date(endOfMonth(new Date())),
      }
    }
  }

  const lastMonthQuery: QueryParamType = {
    table: "services",
    where: {
      typeId: depotTripServiceTypeId,
      from: {
        gte: new Date(startOfMonth(subMonths(new Date(), 1))),
        lte: new Date(endOfMonth(subMonths(new Date(), 1))),
      },
    }
  }

  const { data: depotTripsCurrentMonth, isLoading: depotTripsCurrentMonthLoading } = useQuery({
    queryKey: [currentMonthQuery?.table, currentMonthQuery?.where],
    queryFn: async () => getTrips({
      data: currentMonthQuery
    })
  })

  const { data: depotTripsLastMonth, isLoading: depotTripsLastMonthLoading } = useQuery({
    queryKey: [lastMonthQuery?.table, lastMonthQuery?.where],
    queryFn: async () => getTrips({
      data: lastMonthQuery
    })
  })

  const calculatePercentageChange = (currentCount = 0, lastCount = 0) => {
    if (lastCount === 0) {
      return currentCount > 0 ? 100 : 0
    }

    return ((currentCount - lastCount) / lastCount) * 100
  }

  const percentageChangeTrip = calculatePercentageChange(depotTripsCurrentMonth?.totalTrips, depotTripsLastMonth?.totalTrips)
  const percentageChangeExpenses = calculatePercentageChange(depotTripsCurrentMonth?.totalExpenses, depotTripsLastMonth?.totalExpenses)
  const percentageChangeFuelExpense = calculatePercentageChange(depotTripsCurrentMonth?.totalFuelExpense, depotTripsLastMonth?.totalFuelExpense)

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/services/regal-transtrade/depot">
        <Card>
          <CardHeader>
            <CardDescription>Total Trips</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(depotTripsCurrentMonth?.totalTrips)}
            </CardTitle>
            <CardAction>
              <Badge variant={percentageChangeTrip >= 0 ? "default" : "destructive"}>
                {percentageChangeTrip >= 0 ? <TrendingUp /> : <TrendingDown />}
                <span className="font-medium">{Math.abs(percentageChangeTrip).toFixed(0)}%</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardHeader className="flex-col items-start">
            <CardDescription>Last month</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalTrips)}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>

      <Link to="/services/regal-transtrade/depot">
        <Card>
          <CardHeader>
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(depotTripsCurrentMonth?.totalExpenses)}
            </CardTitle>
            <CardAction>
              <Badge variant={percentageChangeExpenses >= 0 ? "default" : "destructive"}>
                {percentageChangeExpenses >= 0 ? <TrendingUp /> : <TrendingDown />}
                <span className="font-medium">{Math.abs(percentageChangeExpenses).toFixed(0)}%</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardHeader className="flex-col items-start">
            <CardDescription>Last month</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalExpenses)}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>

      <Link to="/services/regal-transtrade/depot">
        <Card>
          <CardHeader>
            <CardDescription>Total Fuel Cost</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(depotTripsCurrentMonth?.totalFuelExpense)}
            </CardTitle>
            <CardAction>
              <Badge variant={percentageChangeExpenses >= 0 ? "default" : "destructive"}>
                {percentageChangeExpenses >= 0 ? <TrendingUp /> : <TrendingDown />}
                <span className="font-medium">{Math.abs(percentageChangeExpenses).toFixed(0)}%</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardHeader className="flex-col items-start">
            <CardDescription>Last month</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalFuelExpense)}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </div>
  )
}
