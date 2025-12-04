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
    reporter: stringValidation('Reporter').catch(undefined),
    owner: stringValidation('Owner').catch(undefined)
  })
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setTaskModal, setDeleteModal, users } = useApp()

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
      reporter: params.reporter,
      owner: params.owner
    },
    search: {
      term: params.search,
      key: ["title", "number"]
    }
  }

  const filters: TableFilterType[] = [
    {
      key: 'status',
      value: params.status,
      options: taskStatusOptions
    },
    {
      key: 'priority',
      value: params.priority,
      options: taskPriorityOptions
    },
    {
      key: 'assignee',
      value: params.assignee,
      options: users,
      type: 'avatar'
    },
    {
      key: 'reporter',
      value: params.reporter,
      options: users,
      type: 'avatar'
    },
    {
      key: 'owner',
      value: params.owner,
      options: users,
      type: 'avatar'
    }
  ]
  
  return (
    <>
      <TableComponent columns={taskColumns({
        actions: {
          edit: (id) => {
            setTaskModal({
              id,
              isOpen: true
            })
          },
          delete: (id) => {
            setDeleteModal({
              id,
              title: "Task",
              table: "tasks"
            })
          }
        }
      })} query={query} queryFn={getTasks} filters={filters} toolbar={(
        <Button size="sm" variant="outline" onClick={() => setTaskModal({
          id: null,
          isOpen: true
        })}><PlusCircle /> Create</Button>
      )} options={{ hasSearch: true }} />
    </>
  )
}
