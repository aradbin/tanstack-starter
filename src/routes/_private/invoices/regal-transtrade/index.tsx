import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import { invoiceColumns } from '../-columns'
import { getInvoices } from '../-utils'
import { Button } from '@/components/ui/button'
import { FileCog } from 'lucide-react'
import InvoiceForm from './-form'
import InvoicePaymentForm from './-payment-form'
import { useApp } from '@/providers/app-provider'

export const Route = createFileRoute('/_private/invoices/regal-transtrade/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate() 
  const { setDeleteModal } = useApp()
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
          view: (id) => {
            navigate({ to: "/invoices/regal-transtrade/$id", params: { id } })
          },
          edit: (id, item) => {
            setInvoicePaymentModal({
              id,
              isOpen: true,
              item
            })
          },
          delete: (id) => {
            setDeleteModal({
              id,
              title: "Invoice",
              table: "invoices"
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
