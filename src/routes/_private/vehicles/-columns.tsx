import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { TableActionType } from "@/lib/types"
import { vehicles } from "@/lib/db/schema/vehicles"
import { formatDate } from "@/lib/utils"

export const vehicleColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof vehicles.$inferSelect>[] => [
  {
    accessorKey: "registrationNumber",
    header: ({ column }) => <TableColumnHeader column={column} title="Registration Number" />,
  },
  {
    accessorKey: "registrationDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Registration Date" />,
    cell: ({ row }) => formatDate(row.original.registrationDate),
  },
  {
    accessorKey: "chassisNumber",
    header: ({ column }) => <TableColumnHeader column={column} title="Chassis Number" />,
  },
  {
    accessorKey: "engineNumber",
    header: ({ column }) => <TableColumnHeader column={column} title="Engine Number" />,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
