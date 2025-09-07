import { createFileRoute } from '@tanstack/react-router'
import TableComponent from '@/components/table/table-component'
import { Button } from '@/components/ui/button'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, stringValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { BaggageClaim, Calendar, DollarSign, Fuel, Loader2, PlusCircle, TrendingUp } from 'lucide-react'
import { tripDepotColumns } from './-columns'
import { formatDateForInput } from '@/lib/utils'
import { sub } from 'date-fns'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoadingComponent from '@/components/common/loading-component'
import { AnyType } from '@/lib/types'

export const Route = createFileRoute('/_private/trips/depot/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
    date: stringValidation('Date').catch(undefined),
    vehicle: stringValidation('Vehicle').catch(undefined),
    driver: stringValidation('Driver').catch(undefined),
    helper: stringValidation('Helper').catch(undefined),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()
  const { vehicles, drivers, helpers, setDeleteModal } = useApp()

  const query: QueryParamType = {
    table: "trips",
    relation: {
      vehicle: true,
      driver: true,
      helper: true,
    },
    sort: {
      field: params.sort,
      order: params.order
    },
    pagination: {
      hasPagination: false
    },
    where: {
      type: "depot",
      date: params.date || formatDateForInput(sub(new Date(), { days: 1 })),
      vehicleId: params.vehicle,
      driverId: params.driver,
      helperId: params.helper,
    }
  }

  return (
    <TableComponent columns={tripDepotColumns({
      actions: {
        view: (id) => {
          navigate({
            to: `/trips/depot/${id}`
          })
        },
        edit: (id) => {
          navigate({
            to: `/trips/depot/${id}/edit`
          })
        },
        delete: (id) => {
          setDeleteModal({
            id,
            title: "Trip",
            table: "trips"
          })
        }
      }
    })} filters={[
      { key: "date", value: params.date || formatDateForInput(sub(new Date(), { days: 1 })), label: "Date", type: "date", icon: Calendar },
      { key: "vehicle", value: params.vehicle, label: "Vehicle", options: vehicles },
      { key: "driver", value: params.driver, label: "Driver", type: "avatar", options: drivers },
      { key: "helper", value: params.helper, label: "Helper", type: "avatar", options: helpers },
    ]} query={query} options={{}} toolbar={(
      <Button size="sm" variant="outline" onClick={() => {
        navigate({
          to: `/trips/depot/create`
        })
      }}><PlusCircle /> Create</Button>
    )} children={{
      childrenBefore: (tableData, isLoading) => {
        return (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Card>
              <CardHeader>
                <CardDescription>Total Trips</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.result?.flatMap((trip: AnyType) => trip.items || []).reduce((total: number, item: AnyType) => total + (item.count || 0), 0)}
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
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.result?.flatMap((trip: AnyType) => trip.items || []).reduce((total: number, item: AnyType) => total + ((item.cost * item.count) || 0), 0)}
                </CardTitle>
                <CardAction>
                  <Fuel />
                </CardAction>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.result?.flatMap((trip: AnyType) => trip.expenses || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0)}
                </CardTitle>
                <CardAction>
                  <DollarSign />
                </CardAction>
              </CardHeader>
            </Card>
          </div>
        )
      },
    }} />
  )
}
