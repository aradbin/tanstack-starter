import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import { teams } from "@/lib/db/schema"
import { capitalize, formatDate } from "@/lib/utils"

export const teamColumns: ColumnDef<typeof teams.$inferSelect>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => capitalize(row.original.name),
  },
  {
    accessorKey: "members",
    header: ({ column }) => <TableColumnHeader column={column} title="Members" />,
    // cell: ({ row }) => capitalize(row.original.name),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => formatDate(row.original.createdAt),
    enableHiding: true,
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} />,
  },
]
