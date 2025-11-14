import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import { pdf } from '@react-pdf/renderer'
import { invoiceColumns } from '../-columns'
import InvoiceView from './-view'
import { getInvoices } from '../-utils'
import { Button } from '@/components/ui/button'
import { FileCog } from 'lucide-react'
import InvoiceForm from './-form'
import InvoicePaymentForm from './-payment-form'

export const Route = createFileRoute('/_private/invoices/regal-transtrade/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const [invoiceCreateModal, setInvoiceCreateModal] = useState<ModalStateType>(null)
  const [invoicePaymentModal, setInvoicePaymentModal] = useState<ModalStateType>(null)
  const query: QueryParamType = {
    table: 'invoices',
    relation: {
      invoiceEntities: true,
    },
    sort: {
      field: params.sort,
      order: params.order
    },
    pagination: {
      page: params.page,
      pageSize: params.pageSize
    },
  }

  return (
    <>
      <TableComponent columns={invoiceColumns({
        actions: {
          async view(id, item) {
            const blob = await pdf(<InvoiceView modal={{
              id,
              isOpen: true,
              item
            }} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
          },
          async edit(id, item) {
            setInvoicePaymentModal({
              id,
              isOpen: true,
              item
            })
          }
        }
      })} filters={[]} query={query} queryFn={getInvoices} options={{
        hasSearch: true
      }} toolbar={(
        <div className='flex gap-2'>
          <Button size="sm" variant="outline" onClick={() => {
            setInvoiceCreateModal({
              id: null,
              isOpen: true
            })
          }}><FileCog /> Generate Invoice</Button>
        </div>
      )} />
      <InvoiceForm modal={invoiceCreateModal} setModal={setInvoiceCreateModal} />
      <InvoicePaymentForm modal={invoicePaymentModal} setModal={setInvoicePaymentModal} />
    </>
  )
}
