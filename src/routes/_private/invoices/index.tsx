import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { invoiceColumns } from './-columns'

export const Route = createFileRoute('/_private/invoices/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const query: QueryParamType = {
    table: 'invoices',
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
    <TableComponent columns={invoiceColumns({
      actions: {
        
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <></>
    )} />
  )
}
