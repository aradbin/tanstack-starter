import { createFileRoute } from '@tanstack/react-router'
import InvoiceView from '../-view'
import { useQuery } from '@tanstack/react-query'
import { getInvoices } from '../../-utils'
import LoadingComponent from '@/components/common/loading-component'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import TableComponent from '@/components/table/table-component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { capitalize, formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import InvoicePaymentForm from '../-payment-form'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import InvoiceBadge from '@/components/app/invoice-badge'

export const Route = createFileRoute(
  '/_private/invoices/regal-transtrade/$id/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const [invoicePaymentModal, setInvoicePaymentModal] = useState<ModalStateType>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', id],
    queryFn: () => getInvoices({
      data: {
        table: "invoices",
        where: { id }
      }
    })
  })

  if(isLoading){
    return (
      <Card className='relative h-screen'>
        <LoadingComponent isLoading={isLoading} />
      </Card>
    )
  }

  if(!data?.result?.[0]){
    return (
      <Card className='relative h-screen'>
        <CardHeader>
          <CardTitle className='text-center'>No Invoice Found</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader className='gap-0'>
          <CardTitle className='flex justify-between items-center'>
            <div>Invoice #{data?.result?.[0]?.number}</div>
            <InvoiceBadge amount={Number(data?.result?.[0]?.amount)} paid={Number(data?.result?.[0]?.paid)} dueDate={data?.result?.[0]?.dueDate} />
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <InvoiceView invoice={data?.result?.[0]} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='gap-0'>
          <CardTitle className='flex justify-between items-center'><span>Invoice Payments</span><Button variant='outline' size="sm" onClick={() => {
            setInvoicePaymentModal({
              id,
              isOpen: true,
              item: data?.result?.[0]
            })
          }}><PlusCircle /> Create</Button></CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <TableComponent columns={[
            {
              accessorKey: "date",
              header: "Date",
              cell: ({ row }) => formatDate(row.original.date)
            },
            {
              accessorKey: "method",
              header: "Method",
              cell: ({ row }) => capitalize(row.original.method)
            },
            {
              accessorKey: "amount",
              header: "Amount",
              cell: ({ row }) => formatCurrency(Number(row.original.amount))
            },
            {
              accessorKey: "reference",
              header: "Reference",
            }
          ]} query={{
            table: "invoicePayments",
            where: {
              invoiceId: id
            },
            pagination: {
              hasPagination: false
            }
          }} />
        </CardContent>
      </Card>
      <InvoicePaymentForm modal={invoicePaymentModal} setModal={setInvoicePaymentModal} />
    </div>
  )
}
