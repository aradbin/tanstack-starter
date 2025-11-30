import { ArrowDown, ArrowUp, Loader2, TrendingUp, Truck, Users } from "lucide-react";
import MetricCard from "./metric-card";
import { useQuery } from "@tanstack/react-query";
import { getDatas, QueryParamType } from "@/lib/db/functions";
import { Link } from "@tanstack/react-router";
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths } from "date-fns";
import { getTrips } from "../services/regal-transtrade/-utils";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetricSection() {
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await getDatas({
        data: {
          table: 'employees',
          relation: {
            designation: true
          }
        }
      })

      return {
        drivers: response?.result?.filter((emp: any) => emp?.designation?.name?.toLowerCase() === 'driver') || [],
        helpers: response?.result?.filter((emp: any) => emp?.designation?.name?.toLowerCase() === 'helper') || [],
        staffs: response?.result?.filter((emp: any) => emp?.designation?.name?.toLowerCase() === 'office staff') || [],
      }
    }
  })

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => getDatas({
      data: {
        table: 'assets'
      }
    })
  })

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
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Link to="/services/regal-transtrade/depot">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Depot Trips</CardTitle>
            <TrendingUp className="size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {depotTripsCurrentMonthLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : depotTripsCurrentMonth?.totalTrips ?? 0}
            </div>
          </CardContent>
          <CardFooter>
            <div className={`flex items-center gap-1 text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {depotTripsLastMonthLoading ? (
                <Loader2 className="animate-spin size-3" />
              ) : (
                <>
                  {isPositiveChange ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                  <span className="font-medium">{Math.abs(percentageChange).toFixed(1)}%</span>
                  <span className="text-muted-foreground">from last month</span>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>

      <Link to="/employees" search={{ designation: employees?.drivers?.[0]?.designation?.id }}>
        <MetricCard
          title="Drivers"
          description={employeesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : employees?.drivers?.length ?? ""}
          icon={<Users className="size-5" />}
        />
      </Link>

      <Link to="/employees" search={{ designation: employees?.helpers?.[0]?.designation?.id }}>
        <MetricCard
          title="Helpers"
          description={employeesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : employees?.helpers?.length ?? ""}
          icon={<Users className="size-5" />}
        />
      </Link>

      <Link to="/employees" search={{ designation: employees?.staffs?.[0]?.designation?.id }}>
        <MetricCard
          title="Office Staffs"
          description={employeesLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : employees?.staffs?.length ?? ""}
          icon={<Users className="size-5" />}
        />
      </Link>

      <Link to="/assets">
        <MetricCard
          title="Vehicles"
          description={assetsLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : assets?.count ?? ""}
          icon={<Truck className="size-5" />}
        />
      </Link>
    </div>
  )
}