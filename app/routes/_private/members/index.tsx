import TableComponent from '@/components/table/table-component'
import { numberValidation, unionValidation, validate } from '@/lib/validations'
import { defaultPageSize } from '@/lib/variables'
import { createFileRoute } from '@tanstack/react-router'
import { memberColumns } from './-columns'

export const Route = createFileRoute('/_private/members/')({
  component: RouteComponent,
  validateSearch: validate({
    page: numberValidation('Page').catch(1),
    pageSize: numberValidation('Page Size').catch(defaultPageSize),
    role: unionValidation('Role').catch([]),
  }),
})

function RouteComponent() {
  const search = Route.useSearch()

  console.log('search', search)
  
  return (
    <TableComponent columns={memberColumns} query={{
      table: "members",
      relations: {
        user: true,
      },
      pagination: {
        page: search.page,
        pageSize: search.pageSize
      },
      filters: [
        {
          title: 'Role',
          options: [
            {
              label: 'Owner',
              value: 'owner'
            },
            {
              label: 'Member',
              value: 'member'
            }
          ],
          selected: search.role
        }
      ]
    }} />
  )
}
