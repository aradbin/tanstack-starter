import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryParamType } from "@/lib/db/functions";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BaggageClaim, DollarSign, Fuel, Loader2 } from "lucide-react";
import { getTripsSummary } from "./-utils";

export default function TripDepotSummary({
  query
}: {
  query: QueryParamType
}) {
  const { data, isLoading } = useQuery({
    queryKey: [query.table, 'summary', query?.where],
    queryFn: () => getTripsSummary({ data: query }),
  });

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <Card>
        <CardHeader>
          <CardDescription>Total Trips</CardDescription>
          <CardTitle className="text-2xl">
            {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(data?.totalTrips || 0)}
          </CardTitle>
          <CardAction>
            <BaggageClaim />
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Fuels</CardDescription>
          <CardTitle className="text-2xl">
            {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(data?.totalFuel || 0)}
          </CardTitle>
          <CardAction>
            <Fuel />
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Expense</CardDescription>
          <CardTitle className="text-2xl">
            {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(data?.totalExpense || 0)}
          </CardTitle>
          <CardAction>
            <DollarSign />
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Income</CardDescription>
          <CardTitle className="text-2xl">
            {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(data?.totalIncome || 0)}
          </CardTitle>
          <CardAction>
            <DollarSign />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}