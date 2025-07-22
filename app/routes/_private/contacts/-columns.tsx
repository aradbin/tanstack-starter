import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import AvatarComponent from "@/components/common/avatar-component"
import { formatDateTime } from "@/lib/utils"
import TableCheckboxHeader from "@/components/table/table-checkbox-header"
import TableCheckboxRow from "@/components/table/table-checkbox-row"
import { contacts } from "@/lib/db/schema/contacts"
import { AnyType } from "@/lib/types"

export const contactColumns = ({
  actions
}: {
  actions?: {
    edit?: (id: AnyType) => void
    delete?: (id: AnyType) => void
  }
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
