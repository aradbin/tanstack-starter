import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, enamValidation, stringValidation, validate } from '@/lib/validations'
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
    assignee: stringValidation('Assignee').catch(undefined),
    owner: stringValidation('Owner').catch(undefined)
  })
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setIsTaskOpen, setEditId, setDeleteId, users } = useApp()

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
      priority: params.priority,
      assignee: params.assignee,
      owner: params.owner
    },
    search: {
      term: params.search,
      key: ["title"]
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
    },
    {
      key: 'assignee',
      options: users,
      type: 'avatar'
    },
    {
      key: 'owner',
      options: users,
      type: 'avatar'
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
