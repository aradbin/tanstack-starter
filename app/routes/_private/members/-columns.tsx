import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import { members, users } from "@/lib/db/schema"
import UserAvatar from "@/components/common/user-avatar"
import { capitalize, formatDate } from "@/lib/utils"

export const memberColumns: ColumnDef<typeof members.$inferSelect & {
  user: typeof users.$inferSelect
}>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
  },
  {
    id: "member",
    header: ({ column }) => <TableColumnHeader column={column} title="Member" />,
    cell: ({ row }) => <UserAvatar user={row.original.user} />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <TableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => capitalize(row.original.role),
    enableHiding: true,
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => formatDate(row.original.createdAt),
    meta: {
      label: 'Joined'
    },
    enableHiding: true,
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} />,
  },
]
