import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryParamType } from "@/lib/db/functions";
import { Link } from "@tanstack/react-router";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getTrips } from "../services/regal-transtrade/-utils";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { depotTripServiceTypeId } from "@/lib/organizations/regal-transtrade";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getInvoices } from "../invoices/-utils";
import { AnyType } from "@/lib/types";

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

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const invoices = await getInvoices({
        data: {
          table: "invoices",
          sort: {
            field: "date",
            order: "desc"
          },
          where: {
            date: {
              gte: new Date(startOfMonth(new Date())),
              lte: new Date(endOfMonth(new Date())),
            },
          }
        }
      })

      console.log("invoices", invoices?.result)

      const amount = invoices?.result?.reduce((total: number, invoice: AnyType) => total + Number(invoice?.amount), 0)
      const expense = invoices?.result?.reduce((total: number, invoice: AnyType) => total + Number(invoice?.expense), 0)
      const paid = invoices?.result?.reduce((total: number, invoice: AnyType) => total + Number(invoice?.paid), 0)

      console.log({
        amount,
        expense,
        paid
      })

      return {
        amount,
        expense,
        paid
      }
    }
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
  const percentageProfitLoss = calculatePercentageChange(invoices?.amount, invoices?.expense)

  return (
    <div className="flex flex-col gap-4">
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
            <CardHeader>
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
            <CardHeader>
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
                <Badge variant={percentageChangeFuelExpense >= 0 ? "default" : "destructive"}>
                  {percentageChangeFuelExpense >= 0 ? <TrendingUp /> : <TrendingDown />}
                  <span className="font-medium">{Math.abs(percentageChangeFuelExpense).toFixed(0)}%</span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardHeader>
              <CardDescription>Last month</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalFuelExpense)}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <Link to="/invoices/regal-transtrade">
          <Card>
            <CardHeader>
              <CardDescription>Total Invoice Amount</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {invoicesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(invoices?.amount)}
              </CardTitle>
              <CardAction>
                <Badge variant={percentageProfitLoss >= 0 ? "default" : "destructive"} className={percentageProfitLoss >= 0 ? "bg-green-500/20 text-white" : ""}>
                  <span className="font-medium">{formatCurrency(invoices?.amount - invoices?.expense)}</span>
                  <span className="font-medium">({Math.abs(percentageProfitLoss).toFixed(0)}%)</span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardHeader className="flex justify-between">
              <div>
                <CardDescription>Total Expense</CardDescription>
                <CardTitle className="text-xl font-semibold">
                  {invoicesLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(invoices?.expense)}
                </CardTitle>
              </div>
              <div>
                <CardDescription>Total Paid</CardDescription>
                <CardTitle className="text-xl font-semibold">
                  {invoicesLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(invoices?.paid)}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
