import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryParamType } from "@/lib/db/functions";
import { Link } from "@tanstack/react-router";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getInvoices } from "../invoices/-utils";
import { AnyType } from "@/lib/types";
import { getTrips } from "../trips/depot/-utils";

export default function TripSection() {
  const currentMonthQuery: QueryParamType = {
    table: "trips",
    where: {
      type: "depot",
      date: {
        gte: new Date(startOfMonth(new Date())),
        lte: new Date(endOfMonth(new Date())),
      }
    }
  }

  const lastMonthQuery: QueryParamType = {
    table: "trips",
    where: {
      type: "depot",
      date: {
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

      const amount = invoices?.result?.reduce((total: number, invoice: AnyType) => total + Number(invoice?.amount), 0)
      const expense = invoices?.result?.reduce((total: number, invoice: AnyType) => total + Number(invoice?.expense), 0)
      const paid = invoices?.result?.reduce((total: number, invoice: AnyType) => total + Number(invoice?.paid), 0)

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
  const percentageChangeExpenses = calculatePercentageChange(depotTripsCurrentMonth?.totalExpense, depotTripsLastMonth?.totalExpense)
  const percentageChangeIncome = calculatePercentageChange(depotTripsCurrentMonth?.totalIncome, depotTripsLastMonth?.totalIncome)
  const percentageChangeFuel = calculatePercentageChange(depotTripsCurrentMonth?.totalFuel, depotTripsLastMonth?.totalFuel)
  const percentageProfitLoss = calculatePercentageChange(invoices?.amount, invoices?.expense)
  const percentagePaid = invoices?.amount ? ((invoices?.paid ?? 0) / invoices.amount) * 100 : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/trips/depot">
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

        <Link to="/trips/depot">
          <Card>
            <CardHeader>
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(depotTripsCurrentMonth?.totalExpense)}
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
                {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalExpense)}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/trips/depot">
          <Card>
            <CardHeader>
              <CardDescription>Total Income</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(depotTripsCurrentMonth?.totalIncome)}
              </CardTitle>
              <CardAction>
                <Badge variant={percentageChangeIncome >= 0 ? "default" : "destructive"}>
                  {percentageChangeIncome >= 0 ? <TrendingUp /> : <TrendingDown />}
                  <span className="font-medium">{Math.abs(percentageChangeIncome).toFixed(0)}%</span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardHeader>
              <CardDescription>Last month</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalIncome)}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/trips/depot">
          <Card>
            <CardHeader>
              <CardDescription>Total Fuel</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(depotTripsCurrentMonth?.totalFuel)}
              </CardTitle>
              <CardAction>
                <Badge variant={percentageChangeFuel >= 0 ? "default" : "destructive"}>
                  {percentageChangeFuel >= 0 ? <TrendingUp /> : <TrendingDown />}
                  <span className="font-medium">{Math.abs(percentageChangeFuel).toFixed(0)}%</span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardHeader>
              <CardDescription>Last month</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(depotTripsLastMonth?.totalFuel)}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>

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
            <CardHeader>
              <CardDescription>Total Expense</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {invoicesLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(invoices?.expense)}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/invoices/regal-transtrade">
          <Card>
            <CardHeader>
              <CardDescription>Total Paid</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {invoicesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(invoices?.paid)}
              </CardTitle>
              <CardAction>
                <Badge variant={percentagePaid > 0 ? "default" : "destructive"} className={percentagePaid >= 100 ? "bg-green-500/20 text-white" : percentagePaid > 0 ? "bg-amber-500/20 text-white" : ""}>
                  <span className="font-medium">{Math.abs(percentagePaid).toFixed(0)}%</span>
                </Badge>
              </CardAction>
            </CardHeader>
            <CardHeader>
              <CardDescription>Total Due</CardDescription>
              <CardTitle className="text-xl font-semibold">
                {invoicesLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : formatCurrency(invoices?.amount - invoices?.paid)}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
