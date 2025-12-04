import { ColumnDef } from "@tanstack/react-table"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import AvatarComponent from "@/components/common/avatar-component"
import { formatDateTime } from "@/lib/utils"
import { partners, partnerEntities } from "@/lib/db/schema"
import { TableActionType } from "@/lib/types"
import AvatarGroupComponent from "@/components/common/avatar-group-component"

export const partnerColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof partners.$inferSelect>[] => [
  {
    id: "partner",
    header: ({ column }) => <TableColumnHeader column={column} title="" />,
    cell: ({ row }) => <AvatarComponent user={row.original} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <TableColumnHeader column={column} title="Type" />,
  },
  // {
  //   accessorKey: "contacts",
  //   header: ({ column }) => <TableColumnHeader column={column} title="Contacts" />,
  //   cell: ({ row }) => <AvatarGroupComponent users={row?.original?.partner?.partnerEntities?.map((entity) => entity.partner)} />,
  // },
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
