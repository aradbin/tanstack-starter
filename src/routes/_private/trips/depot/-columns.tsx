import { ColumnDef } from "@tanstack/react-table"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { AnyType, TableActionType } from "@/lib/types"
import { employees, trips } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import AvatarComponent from "@/components/common/avatar-component"
import { formatDate } from "@/lib/utils"

export const tripDepotColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof trips.$inferSelect & {
  driver: typeof employees.$inferSelect | null,
  helper: typeof employees.$inferSelect | null,
}>[] => [
  {
    id: "date",
    header: ({ column }) => <TableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => formatDate(row?.original?.date),
  },
  {
    accessorKey: "vehicle.registrationNumber",
    header: ({ column }) => <TableColumnHeader column={column} title="Vehicle" />,
  },
  {
    id: "driver",
    header: ({ column }) => <TableColumnHeader column={column} title="Driver" />,
    cell: ({ row }) => row?.original?.driver ? <AvatarComponent user={{
      ...row?.original?.driver,
      email: row?.original?.driver?.phone
    }} /> : "N/A",
  },
  {
    id: "helper",
    header: ({ column }) => <TableColumnHeader column={column} title="Helper" />,
    cell: ({ row }) => row?.original?.helper ? <AvatarComponent user={{
      ...row?.original?.helper,
      email: row?.original?.helper?.phone
    }} /> : "N/A",
  },
  {
    id: "items",
    header: ({ column }) => <TableColumnHeader column={column} title="Trips" />,
    cell: ({ row }: AnyType) => {
      let total = 0
      return (
        <div className="flex flex-col gap-1">
          {row?.original?.items?.map((item: any, index: number) => {
            total += item.count
            return (
              <Badge key={index} variant="outline"><span>{item.to === 'PL' ? 'CPA to PL' : item.to}</span> - <span>{item.count}</span></Badge>
            )
          })}
          <Badge><span>Total</span> - <span>{total}</span></Badge>
        </div>
      )
    },
  },
  {
    id: "expenses",
    header: ({ column }) => <TableColumnHeader column={column} title="Expenses" />,
    cell: ({ row }: AnyType) => {
      let total = 0
      return (
        <div className="flex flex-col gap-1">
          {row?.original?.expenses?.map((item: any, index: number) => {
            total += item.amount
            return (
              <Badge key={index} variant="outline"><span>{item.description}</span> - <span>{item.amount}</span></Badge>
            )
          })}
          <Badge><span>Total</span> - <span>{total}</span></Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
  },
]
