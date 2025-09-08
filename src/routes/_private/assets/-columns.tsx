import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { AnyType, TableActionType } from "@/lib/types"
import { assets } from "@/lib/db/schema"
import { formatDate } from "@/lib/utils"

export const assetColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof assets.$inferSelect & {
  metadata: AnyType
}>[] => [
  {
    accessorKey: "metadata.registrationNumber",
    header: ({ column }) => <TableColumnHeader column={column} title="Registration Number" />,
  },
  {
    accessorKey: "metadata.registrationDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Registration Date" />,
    cell: ({ row }) => formatDate(row.original.metadata?.registrationDate),
  },
  {
    accessorKey: "metadata.fitnessExpiryDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Fitness Expiry Date" />,
    cell: ({ row }) => formatDate(row.original.metadata?.fitnessExpiryDate),
  },
  {
    accessorKey: "metadata.taxTokenExpiryDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Tax Token Expiry Date" />,
    cell: ({ row }) => formatDate(row.original.metadata?.taxTokenExpiryDate),
  },
  {
    accessorKey: "metadata.roadPermitExpiryDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Road Permit Expiry Date" />,
    cell: ({ row }) => formatDate(row.original.metadata?.roadPermitExpiryDate),
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
