import { createFileRoute } from '@tanstack/react-router'
import TableComponent from '@/components/table/table-component'
import { Button } from '@/components/ui/button'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, stringValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { BanknoteArrowDown, BanknoteArrowUp, Calendar, DollarSign, Fuel, Loader2, MapPinned, PlusCircle, Scale } from 'lucide-react'
import { tripDistrictColumns } from './-columns'
import { formatCurrency, formatDateForInput } from '@/lib/utils'
import { endOfMonth, isValid, startOfMonth } from 'date-fns'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTrips } from '../-utils'

export const Route = createFileRoute('/_private/events/regal-transtrade/district/')({
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
      typeId: "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I",
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
    <TableComponent columns={tripDistrictColumns({
      actions: {
        // view: (id) => {
        //   navigate({
        //     to: `/events/regal-transtrade/district/${id}`
        //   })
        // },
        edit: (id) => {
          navigate({
            to: `/events/regal-transtrade/district/${id}/edit`
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
          to: `/events/regal-transtrade/district/create`
        })
      }}><PlusCircle /> Create</Button>
    )} children={{
      childrenBefore: (tableData, isLoading) => {
        return (
          <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
            <Card>
              <CardHeader>
                <CardDescription>Total Trips</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.totalTrips || 0}
                </CardTitle>
                <CardAction>
                  <MapPinned />
                </CardAction>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Fare</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalFare || 0)}
                </CardTitle>
                <CardAction>
                  <DollarSign />
                </CardAction>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Expenses</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalExpenses || 0)}
                </CardTitle>
                <CardAction>
                  <BanknoteArrowDown />
                </CardAction>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Payments</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalPayments || 0)}
                </CardTitle>
                <CardAction>
                  <BanknoteArrowUp />
                </CardAction>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Balance</CardDescription>
                <CardTitle className="text-2xl">
                  {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalBalance || 0)}
                </CardTitle>
                <CardAction>
                  <Scale />
                </CardAction>
              </CardHeader>
            </Card>
          </div>
        )
      },
    }} />
  )
}
