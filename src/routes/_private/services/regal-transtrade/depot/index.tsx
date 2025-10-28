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
import { getTrips } from '../-utils'
import { ModalStateType } from '@/lib/types'
import { useState } from 'react'
import InvoiceForm from './-invoice-form'

export const Route = createFileRoute('/_private/services/regal-transtrade/depot/')({
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

  const query: QueryParamType = {
    table: "services",
    sort: {
      field: params.sort || "from",
      order: params.order
    },
    pagination: {
      hasManualPagination: false
    },
    where: {
      typeId: "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM",
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
    <>
      <TableComponent columns={tripDepotColumns({
        actions: {
          // view: (id) => {
          //   navigate({
          //     to: `/services/regal-transtrade/depot/${id}`
          //   })
          // },
          edit: (id) => {
            navigate({
              to: `/services/regal-transtrade/depot/${id}/edit`
            })
          },
          delete: (id) => {
            setDeleteModal({
              id,
              title: "Trip",
              table: "services"
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
        <div className='flex gap-2'>
          <Button size="sm" variant="outline" onClick={() => {
            setInvoiceModal({
              id: null,
              isOpen: true
            })
          }}><FileCog /> Generate Invoice</Button>
          <Button size="sm" variant="outline" onClick={() => {
            navigate({
              to: `/services/regal-transtrade/depot/create`
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
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.totalTrips || 0}
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
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : tableData?.totalFuel || 0}
                  </CardTitle>
                  <CardAction>
                    <Fuel />
                  </CardAction>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Total Fuel Cost</CardDescription>
                  <CardTitle className="text-2xl">
                    {isLoading ? <Loader2 className="animate-spin size-6 mt-2" /> : formatCurrency(tableData?.totalFuelExpense || 0)}
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
