import TableComponent from '@/components/table/table-component'
import { defaultSearchParamValidation, enamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { memberColumns } from './-columns'
import { getMembers } from './-utils'
import { QueryParamType } from '@/lib/db/functions'
import { TableFilterType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

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
  
  const query: QueryParamType<"members"> = {
    table: "members",
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
    },
    search: {
      term: params.search
    }
  }
  
  const filters: TableFilterType[] = [
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
  ]
  
  return (
    <>
      <TableComponent columns={memberColumns} filters={filters} query={query} queryFn={getMembers} options={{
        hasSearch: true
      }} toolbar={(
        <Button size="sm" variant="outline"><Send /> Invite</Button>
      )} />
    </>
  )
}
