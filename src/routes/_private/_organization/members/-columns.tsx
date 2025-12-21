import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { TableActionType } from "@/lib/types"
import { members, users } from "@/lib/db/schema"
import AvatarComponent from "@/components/common/avatar-component"
import { capitalize, formatDateTime } from "@/lib/utils"

export const memberColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof members.$inferSelect & {
  user: typeof users.$inferSelect
}>[] => [
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
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
