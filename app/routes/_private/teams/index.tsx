import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { teamColumns } from './-columns'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { QueryParamType } from '@/lib/db/functions'

export const Route = createFileRoute('/_private/teams/')({
  component: RouteComponent,
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
})

function RouteComponent() {
  const params = Route.useSearch()

  const query: QueryParamType = {
    table: "teams",
    sort: {
      field: params.sort,
      order: params.order
    },
    pagination: {
      page: params.page,
      pageSize: params.pageSize
    },
    search: {
      term: params.search
    }
  }

  return (
    <>
      <TableComponent columns={teamColumns} query={query} toolbar={(
        <Button size="sm" variant="outline" onClick={() => console.log('Create')}><PlusCircle /> Create</Button>
      )} />
    </>
  )
}
