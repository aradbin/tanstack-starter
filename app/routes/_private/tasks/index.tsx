import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { taskColumns } from './-columns'
import { QueryParamType } from '@/lib/db/functions'
import ModalComponent from '@/components/modal/modal-component'
import FormComponent from '@/components/form/form-component'
import { createTask, taskFormFields } from './-utils'

export const Route = createFileRoute('/_private/tasks/')({
  component: RouteComponent,
  validateSearch: validate({
    ...defaultSearchParamValidation,
  })
})

function RouteComponent() {
  const params = Route.useSearch()

  const query: QueryParamType<"tasks"> = {
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
        <ModalComponent options={{
          header: 'Create Task'
        }}>
          {(props) => (
            <FormComponent
              fields={taskFormFields}
              handleSubmit={(values: Record<string, any>) => createTask({ data: { values } })}
              onSuccess={() => {
                props.close()
              }}
              onCancel={() => {
                props.close()
              }}
              options={{
                queryKey: 'tasks'
              }}
            />
          )}
        </ModalComponent>
      )} />
    </>
  )
}
