import { columns } from '@/components/table/columns'
import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  const tasks: any = []
  return (
    <TableComponent data={tasks} columns={columns} />
  )
}
