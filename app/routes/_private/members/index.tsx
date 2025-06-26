import { columns } from '@/components/table/columns'
import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TableComponent columns={columns} query={{
      table: "members",
      relations: {
        user: true,
      }
    }} />
  )
}
