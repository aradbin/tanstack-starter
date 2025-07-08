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
  const search = Route.useSearch()
  
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
        field: search.sort,
        order: search.order
      },
      pagination: {
        page: search.page,
        pageSize: search.pageSize
      },
      where: {
        role: search.role
      }
    }} />
  )
}
