import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import { tasks } from "@/lib/db/schema"
import { formatDate } from "@/lib/utils"
import { taskPriorityOptions, taskStatusOptions } from "./-utils"
import TableRowFromOptions from "@/components/table/table-row-from-options"

export const taskColumns: ColumnDef<typeof tasks.$inferSelect>[] = [
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
    accessorKey: "number",
    header: ({ column }) => <TableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <TableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <TableRowFromOptions value={row.original.status} options={taskStatusOptions} />,
    enableSorting: true,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <TableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => <TableRowFromOptions value={row.original.priority} options={taskPriorityOptions} />,
    enableSorting: true,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => formatDate(row.original.dueDate),
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} />,
  },
]
