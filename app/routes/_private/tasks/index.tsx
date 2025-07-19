import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, enamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { taskColumns } from './-columns'
import { QueryParamType } from '@/lib/db/functions'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useApp } from '@/providers/app-provider'
import { TableFilterType } from '@/lib/types'
import { getTasks, taskPriorities, taskPriorityOptions, taskStatuses, taskStatusOptions } from './-utils'

export const Route = createFileRoute('/_private/tasks/')({
  component: RouteComponent,
  validateSearch: validate({
    ...defaultSearchParamValidation,
    sort: enamValidation('Sort', ['dueDate', 'priority', 'status']).catch(undefined),
    status: enamValidation('Status', taskStatuses).catch(undefined),
    priority: enamValidation('Priority', taskPriorities).catch(undefined),
  })
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setIsTaskOpen, setEditId, setDeleteId } = useApp()

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
    where: {
      status: params.status,
      priority: params.priority
    },
    search: {
      term: params.search
    }
  }

  const filters: TableFilterType[] = [
    {
      key: 'status',
      options: taskStatusOptions
    },
    {
      key: 'priority',
      options: taskPriorityOptions
    }
  ]
  
  return (
    <>
      <TableComponent columns={taskColumns({
        actions: {
          edit: (id) => {
            setIsTaskOpen(true)
            setEditId(id)
          },
          delete: (id) => {
            setDeleteId({
              id,
              title: "Task",
              table: "tasks"
            })
          }
        }
      })} query={query} queryFn={getTasks} filters={filters} toolbar={(
        <Button size="sm" variant="outline" onClick={() => setIsTaskOpen(true)}><PlusCircle /> Create</Button>
      )} options={{ hasSearch: true }} />
    </>
  )
}
