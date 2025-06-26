import { columns } from '@/components/table/columns'
import TableComponent from '@/components/table/table-component'
import { getQuery } from '@/lib/db/functions'
import { createFileRoute } from '@tanstack/react-router'

export const getMembers = getQuery("members", {
  with: {
    user: true
  }
})

export const Route = createFileRoute('/_private/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TableComponent columns={columns} queryFn={getMembers} />
  )
}
