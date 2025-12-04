import { TableRowActions } from '@/components/table/table-row-actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/providers/auth-provider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/settings/$key')({
  component: RouteComponent,
})

function RouteComponent() {
  const { key } = Route.useParams()
  const { user } = useAuth()

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user?.activeOrganization?.metadata?.[key]?.map((item) => (
            <TableRow>
            <TableCell>{item?.name}</TableCell>
            <TableCell>
              <TableRowActions row={item} actions={{}} />
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
