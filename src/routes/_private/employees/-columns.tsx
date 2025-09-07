import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import AvatarComponent from "@/components/common/avatar-component"
import { capitalize, formatDate } from "@/lib/utils"
import { TableActionType } from "@/lib/types"
import { designations, employees } from "@/lib/db/schema/employees"

export const employeeColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof employees.$inferSelect & {
  designation: typeof designations.$inferSelect
}>[] => [
  {
    id: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Employee" />,
    cell: ({ row }) => <AvatarComponent user={row.original} />,
  },
  {
    accessorKey: "designation.name",
    header: ({ column }) => <TableColumnHeader column={column} title="Designation" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "metadata.nid",
    header: ({ column }) => <TableColumnHeader column={column} title="NID" />,
  },
  {
    accessorKey: "metadata.licenseNumber",
    header: ({ column }) => <TableColumnHeader column={column} title="License Number" />,
  },
  {
    accessorKey: "metadata.portId",
    header: ({ column }) => <TableColumnHeader column={column} title="Port ID" />,
  },
  {
    accessorKey: "joiningDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Joining Date" />,
    cell: ({ row }) => formatDate(row.original.joiningDate),
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
