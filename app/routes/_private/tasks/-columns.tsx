import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import { tasks, users } from "@/lib/db/schema"
import { formatDate } from "@/lib/utils"
import { taskPriorityOptions, taskStatusOptions } from "./-utils"
import TableRowFromOptions from "@/components/table/table-row-from-options"
import { AnyType } from "@/lib/types"
import AvatarComponent from "@/components/common/avatar-component"
import TableCheckboxHeader from "@/components/table/table-checkbox-header"
import TableCheckboxRow from "@/components/table/table-checkbox-row"

export const taskColumns = ({
  actions
}: {
  actions?: {
    edit?: (id: AnyType) => void
    delete?: (id: AnyType) => void
  }
}): ColumnDef<typeof tasks.$inferSelect & {
  assignee?: typeof users.$inferSelect
  reporter?: typeof users.$inferSelect
}>[] => ([
  {
    id: "select",
    header: ({ table }) => <TableCheckboxHeader table={table} />,
    cell: ({ row }) => <TableCheckboxRow row={row} />,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => `#${row.original.number} - ${row.original.title}`,
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => <TableColumnHeader column={column} title="Assignee" />,
    cell: ({ row }) => row?.original?.assignee ? <AvatarComponent user={row.original.assignee} options={{ hideDescription: false }} /> : "",
  },
  {
    accessorKey: "reporter",
    header: ({ column }) => <TableColumnHeader column={column} title="Reporter" />,
    cell: ({ row }) => row?.original?.reporter ? <AvatarComponent user={row.original.reporter} options={{ hideDescription: false }} /> : "",
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
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
])
