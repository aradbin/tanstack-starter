import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import AvatarComponent from "@/components/common/avatar-component"
import { capitalize, formatDate } from "@/lib/utils"
import { TableActionType } from "@/lib/types"
import { employees } from "@/lib/db/schema/employees"

export const employeeColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof employees.$inferSelect>[] => [
  {
    id: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Employee" />,
    cell: ({ row }) => <AvatarComponent user={row.original} />,
  },
  {
    accessorKey: "designation",
    header: ({ column }) => <TableColumnHeader column={column} title="Designation" />,
    cell: ({ row }) => capitalize(row.original.designation),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "dob",
    header: ({ column }) => <TableColumnHeader column={column} title="Date of Birth" />,
    cell: ({ row }) => formatDate(row.original.dob),
  },
  {
    accessorKey: "nid",
    header: ({ column }) => <TableColumnHeader column={column} title="NID" />,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
