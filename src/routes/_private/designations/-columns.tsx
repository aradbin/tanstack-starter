import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { TableActionType } from "@/lib/types"
import { designations } from "@/lib/db/schema"

export const designationColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof designations.$inferSelect>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
