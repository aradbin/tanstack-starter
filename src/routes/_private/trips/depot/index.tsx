import { createFileRoute } from '@tanstack/react-router'
import TableComponent from '@/components/table/table-component'
import { Button } from '@/components/ui/button'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, stringValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { BaggageClaim, Calendar, DollarSign, FileCog, Fuel, Loader2, PlusCircle } from 'lucide-react'
import { tripDepotColumns } from './-columns'
import { formatCurrency, formatDateForInput } from '@/lib/utils'
import { endOfMonth, isValid, startOfMonth } from 'date-fns'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ModalStateType } from '@/lib/types'
import { useState } from 'react'
import InvoiceForm from '../../invoices/regal-transtrade/-form'
import { getTrips } from './-utils'

export const Route = createFileRoute('/_private/trips/depot/')({
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
  const [invoiceModal, setInvoiceModal] = useState<ModalStateType>(null)

  const defaultFrom = formatDateForInput(startOfMonth(new Date()))
  const defaultTo = formatDateForInput(endOfMonth(new Date()))

  const query: QueryParamType = {
    table: "trips",
    relation: {
      vehicle: true,
      driver: true,
      helper: true
    },
    sort: {
      field: params.sort || "date",
      order: params.order || "desc"
    },
    pagination: {
      hasManualPagination: false
    },
    where: {
      type: "depot",
      date: {
        gte: params.from && isValid(new Date(params.from)) ? new Date(params.from) : new Date(defaultFrom),
        lte: params.to && isValid(new Date(params.to)) ? new Date(params.to) : new Date(defaultTo),
      },
      ...params.vehicle ? { vehicleId: params.vehicle } : {},
      ...params.driver ? { driverId: params.driver } : {},
      ...params.helper ? { helperId: params.helper } : {},
    }
  }

  return (
    <>
      <TableComponent columns={tripDepotColumns({
        actions: {
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
        { key: "date", value: params.from && params.to ? {
          from: params.from,
          to: params.to
        } : {
          from: defaultFrom,
          to: defaultTo
        }, label: "Date", type: "date", icon: Calendar, multiple: true },
        { key: "vehicle", value: params.vehicle, label: "Vehicle", options: vehicles },
        { key: "driver", value: params.driver, label: "Driver", type: "avatar", options: drivers },
        { key: "helper", value: params.helper, label: "Helper", type: "avatar", options: helpers },
      ]} query={query} queryFn={getTrips} options={{}} toolbar={(
        <div className='flex flex-wrap gap-2'>
          <Button size="sm" variant="outline" onClick={() => {
            setInvoiceModal({
              id: null,
              isOpen: true
            })
          }}><FileCog /> Generate Invoice</Button>
          <Button size="sm" variant="outline" onClick={() => {
            navigate({
              to: `/trips/depot/create`
            })
          }}><PlusCircle /> Create</Button>
        </div>
      )} children={{
        childrenBefore: (tableData, isLoading) => {
          return (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Card>
                <CardHeader>
                  <CardDescription>Total Trips</CardDescription>
                  <CardTitle className="text-2xl">
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalTrips || 0)}
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
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalFuel || 0)}
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
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalExpense || 0)}
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
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalIncome || 0)}
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
      <InvoiceForm modal={invoiceModal} setModal={setInvoiceModal} />
    </>
  )
}
