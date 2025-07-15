import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, enamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { taskColumns } from './-columns'
import { QueryParamType } from '@/lib/db/functions'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useApp } from '@/providers/app-provider'

export const Route = createFileRoute('/_private/tasks/')({
  component: RouteComponent,
  validateSearch: validate({
    ...defaultSearchParamValidation,
    sort: enamValidation('Sort', ['dueDate', 'priority', 'status']).catch(undefined),
  })
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setIsTaskOpen } = useApp()

  const query: QueryParamType = {
    table: "tasks",
    sort: {
      field: params.sort,
      order: params.order
    },
    pagination: {
      page: params.page,
      pageSize: params.pageSize
    },
    search: {
      term: params.search,
    }
  }
  
  return (
    <>
      <TableComponent columns={taskColumns} query={query} options={{ hasSearch: true }} toolbar={(
        <Button size="sm" variant="outline" onClick={() => setIsTaskOpen(true)}><PlusCircle /> Create</Button>
      )} />
    </>
  )
}
