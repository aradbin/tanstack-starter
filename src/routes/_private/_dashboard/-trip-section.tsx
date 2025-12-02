import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QueryParamType } from "@/lib/db/functions";
import { Link } from "@tanstack/react-router";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getTrips } from "../services/regal-transtrade/-utils";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TripSection() {
  const currentMonthQuery: QueryParamType = {
    table: "services",
    sort: {
      field: "from",
      order: undefined
    },
    pagination: {
      hasManualPagination: false
    },
    where: {
      typeId: "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM",
      from: {
        gte: new Date(startOfMonth(new Date())),
        lte: new Date(endOfMonth(new Date())),
      },
      vehicleId: undefined,
      driverId: undefined,
      helperId: undefined,
    }
  }

  const lastMonthQuery: QueryParamType = {
    table: "services",
    sort: {
      field: "from",
      order: undefined
    },
    pagination: {
      hasManualPagination: false
    },
    where: {
      typeId: "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM",
      from: {
        gte: new Date(startOfMonth(subMonths(new Date(), 1))),
        lte: new Date(endOfMonth(subMonths(new Date(), 1))),
      },
      vehicleId: undefined,
      driverId: undefined,
      helperId: undefined,
    }
  }

  const { data: depotTripsCurrentMonth, isLoading: depotTripsCurrentMonthLoading } = useQuery({
    queryKey: ['depotTripsCurrentMonth', {
      ...currentMonthQuery?.sort,
      ...currentMonthQuery?.pagination,
      ...currentMonthQuery?.where,
      ...currentMonthQuery?.search
    }],
    queryFn: async () => getTrips({
      data: currentMonthQuery
    })
  })

  const { data: depotTripsLastMonth, isLoading: depotTripsLastMonthLoading } = useQuery({
    queryKey: ['depotTripsLastMonth', {
      ...lastMonthQuery?.sort,
      ...lastMonthQuery?.pagination,
      ...lastMonthQuery?.where,
      ...lastMonthQuery?.search
    }],
    queryFn: async () => getTrips({
      data: lastMonthQuery
    })
  })

  const calculatePercentageChange = () => {
    const currentCount = depotTripsCurrentMonth?.totalTrips || 0
    const lastCount = depotTripsLastMonth?.totalTrips || 0

    if (lastCount === 0) {
      return currentCount > 0 ? 100 : 0
    }

    return ((currentCount - lastCount) / lastCount) * 100
  }

  const percentageChange = calculatePercentageChange()
  const isPositiveChange = percentageChange >= 0

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/services/regal-transtrade/depot">
        <Card>
          <CardHeader>
            <CardDescription>Depot Trips</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : depotTripsCurrentMonth?.totalTrips ?? 0}
            </CardTitle>
            <CardAction>
              <Badge variant={isPositiveChange ? "default" : "destructive"}>
                {isPositiveChange ? <TrendingUp /> : <TrendingDown />}
                <span className="font-medium">{Math.abs(percentageChange).toFixed(0)}%</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardHeader className="flex-col items-start">
            <CardDescription>Last month</CardDescription>
            <CardTitle className="text-xl font-semibold">
              {depotTripsLastMonthLoading ? <Loader2 className="animate-spin size-5 mt-2" /> : depotTripsLastMonth?.totalTrips ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </div>
  )
}
