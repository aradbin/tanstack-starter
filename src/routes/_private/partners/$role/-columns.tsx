import { ColumnDef } from "@tanstack/react-table"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import AvatarComponent from "@/components/common/avatar-component"
import { formatDateTime } from "@/lib/utils"
import { partners, partnerRoles, partnerEntities } from "@/lib/db/schema"
import { TableActionType } from "@/lib/types"
import AvatarGroupComponent from "@/components/common/avatar-group-component"

export const partnerColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof partnerRoles.$inferSelect & {
  partner: typeof partners.$inferSelect & {
    // partnerEntities: typeof partnerEntities.$inferSelect & {
    //   partner: typeof partners.$inferSelect
    // }[]
  }
}>[] => [
  {
    id: "partner",
    header: ({ column }) => <TableColumnHeader column={column} title="" />,
    cell: ({ row }) => <AvatarComponent user={row.original.partner} />,
  },
  {
    accessorKey: "partner.email",
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "partner.phone",
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
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
