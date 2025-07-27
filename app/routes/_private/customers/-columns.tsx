import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"

import AvatarComponent from "@/components/common/avatar-component"
import { formatDateTime } from "@/lib/utils"
import TableCheckboxHeader from "@/components/table/table-checkbox-header"
import TableCheckboxRow from "@/components/table/table-checkbox-row"
import { contacts, customerContacts, customers } from "@/lib/db/schema/customers"
import { AnyType } from "@/lib/types"
import AvatarGroupComponent from "@/components/common/avatar-group-component"

export const customerColumns = ({
  actions
}: {
  actions?: {
    edit?: (id: AnyType) => void
    delete?: (id: AnyType) => void
  }
}): ColumnDef<typeof customers.$inferSelect & {
  customerContacts: typeof customerContacts.$inferSelect & {
    contact: typeof contacts.$inferSelect
  }[]
}>[] => [
  {
    id: "select",
    header: ({ table }) => <TableCheckboxHeader table={table} />,
    cell: ({ row }) => <TableCheckboxRow row={row} />,
  },
  {
    id: "customer",
    header: ({ column }) => <TableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <AvatarComponent user={row.original} />,
  },
  {
    accessorKey: "businessType",
    header: ({ column }) => <TableColumnHeader column={column} title="Business Type" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "contacts",
    header: ({ column }) => <TableColumnHeader column={column} title="Contacts" />,
    cell: ({ row }) => <AvatarGroupComponent users={row?.original?.customerContacts?.map((customerContact) => customerContact.contact)} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
