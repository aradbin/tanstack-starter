import { createFileRoute } from '@tanstack/react-router'
import TableComponent from '@/components/table/table-component'
import { Button } from '@/components/ui/button'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, stringValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { BaggageClaim, Calendar, DollarSign, Fuel, Loader2, PlusCircle } from 'lucide-react'
import { tripDepotColumns } from './-columns'
import { formatDateForInput } from '@/lib/utils'
import { endOfMonth, isValid, startOfMonth } from 'date-fns'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnyType } from '@/lib/types'
import { getTrips } from './-utils'

export const Route = createFileRoute('/_private/events/regal-transtrade/depot/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
    from: stringValidation('From Date').catch(undefined),
    to: stringValidation('To Date').catch(undefined),
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
    table: "events",
    sort: {
      field: params.sort || "from",
      order: params.order
    },
    pagination: {
      hasPagination: false
    },
    where: {
      // type: type,
      from: {
        gte: params.from && isValid(new Date(params.from)) ? new Date(params.from) : new Date(startOfMonth(new Date())),
        lte: params.to && isValid(new Date(params.to)) ? new Date(params.to) : new Date(endOfMonth(new Date())),
      },
      vehicleId: params.vehicle,
      driverId: params.driver,
      helperId: params.helper,
    }
  }

  return (
    <TableComponent columns={tripDepotColumns({
      actions: {
        // view: (id) => {
        //   navigate({
        //     to: `/events/regal-transtrade/depot/${id}`
        //   })
        // },
        edit: (id) => {
          navigate({
            to: `/events/regal-transtrade/depot/${id}/edit`
          })
        },
        delete: (id) => {
          setDeleteModal({
            id,
            title: "Trip",
            table: "events"
          })
        }
      }
    })} filters={[
      { key: "from", value: params.from && params.to ? {
        from: params.from,
        to: params.to
      } : {
        from: formatDateForInput(startOfMonth(new Date())),
        to: formatDateForInput(endOfMonth(new Date()))
      }, label: "Date", type: "date", icon: Calendar, multiple: true },
      { key: "vehicle", value: params.vehicle, label: "Vehicle", options: vehicles },
      { key: "driver", value: params.driver, label: "Driver", type: "avatar", options: drivers },
      { key: "helper", value: params.helper, label: "Helper", type: "avatar", options: helpers },
    ]} query={query} queryFn={getTrips} options={{}} toolbar={(
      <Button size="sm" variant="outline" onClick={() => {
        navigate({
          to: `/events/regal-transtrade/depot/create`
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
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + (item.count || 0), 0)}
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
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.result?.flatMap((trip: AnyType) => trip?.metadata?.items || []).reduce((total: number, item: AnyType) => total + ((item.consumption * item.count) || 0), 0)}
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
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.result?.flatMap((trip: AnyType) => trip?.metadata?.expenses || []).reduce((total: number, item: AnyType) => total + (item.amount || 0), 0)}
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
