import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { TableActionType } from "@/lib/types"
import { invoices } from "@/lib/db/schema"

export const invoiceColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof invoices.$inferSelect>[] => [
  {
    accessorKey: "number",
    header: ({ column }) => <TableColumnHeader column={column} title="#" />,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
