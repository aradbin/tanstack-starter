import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import { members, users } from "@/lib/db/schema"
import AvatarComponent from "@/components/common/avatar-component"
import { capitalize, formatDateTime } from "@/lib/utils"
import TableCheckboxHeader from "@/components/table/table-checkbox-header"
import TableCheckboxRow from "@/components/table/table-checkbox-row"

export const memberColumns: ColumnDef<typeof members.$inferSelect & {
  user: typeof users.$inferSelect
}>[] = [
  {
    id: "select",
    header: ({ table }) => <TableCheckboxHeader table={table} />,
    cell: ({ row }) => <TableCheckboxRow row={row} />,
  },
  {
    id: "member",
    header: ({ column }) => <TableColumnHeader column={column} title="Member" />,
    cell: ({ row }) => <AvatarComponent user={row.original.user} />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <TableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => capitalize(row.original.role),
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} />,
  },
]
