import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import AvatarComponent from "@/components/common/avatar-component"
import { formatDateTime } from "@/lib/utils"
import TableCheckboxHeader from "@/components/table/table-checkbox-header"
import TableCheckboxRow from "@/components/table/table-checkbox-row"
import { contacts } from "@/lib/db/schema"
import { TableActionType } from "@/lib/types"

export const contactColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof contacts.$inferSelect>[] => [
  {
    id: "select",
    header: ({ table }) => <TableCheckboxHeader table={table} />,
    cell: ({ row }) => <TableCheckboxRow row={row} />,
  },
  {
    id: "contact",
    header: ({ column }) => <TableColumnHeader column={column} title="Contact" />,
    cell: ({ row }) => <AvatarComponent user={row.original} />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
