import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, enamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { memberColumns } from './-columns'

export const Route = createFileRoute('/_private/members/')({
  component: RouteComponent,
  validateSearch: validate({
    ...defaultSearchParamValidation,
    sort: enamValidation('Sort', ['role', 'createdAt']).catch(undefined),
    role: enamValidation('Role', ['owner', 'member']).catch(undefined),
  }),
})

function RouteComponent() {
  const params = Route.useSearch()
  
  return (
    <TableComponent columns={memberColumns} filters={[
      {
        key: 'role',
        options: [
          {
            label: 'Owner',
            value: 'owner'
          },
          {
            label: 'Member',
            value: 'member'
          }
        ]
      }
    ]} query={{
      table: "members",
      relation: {
        user: true,
      },
      sort: {
        field: params.sort,
        order: params.order
      },
      pagination: {
        page: params.page,
        pageSize: params.pageSize
      },
      where: {
        role: params.role
      }
    }} />
  )
}
