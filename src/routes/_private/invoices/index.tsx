import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { invoiceColumns } from './-columns'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import InvoiceView from './-view'
import { pdf } from '@react-pdf/renderer'
import { getInvoices } from './-utils'

export const Route = createFileRoute('/_private/invoices/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const [invoiceModal, setInvoiceModal] = useState<ModalStateType>(null)
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
            setInvoiceModal({
              id,
              isOpen: true,
              item
            })
            const blob = await pdf(<InvoiceView modal={{
              id,
              isOpen: true,
              item
            }} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
          },
        }
      })} filters={[]} query={query} queryFn={getInvoices} options={{
        hasSearch: true
      }} toolbar={(
        <></>
      )} />
      {/* <InvoiceView modal={invoiceModal} setModal={setInvoiceModal} /> */}
    </>
  )
}
