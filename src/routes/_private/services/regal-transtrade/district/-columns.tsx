import { ColumnDef } from "@tanstack/react-table"
import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { AnyType, TableActionType } from "@/lib/types"
import { assets, employees, services } from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import AvatarComponent from "@/components/common/avatar-component"
import { formatCurrency, formatDate } from "@/lib/utils"

export const tripDistrictColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof services.$inferSelect & {
  vehicle: typeof assets.$inferSelect,
  driver: typeof employees.$inferSelect,
  helper: typeof employees.$inferSelect,
}>[] => [
  {
    id: "from",
    header: ({ column }) => <TableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => formatDate(row?.original?.from),
  },
  {
    accessorKey: "vehicle.metadata.registrationNumber",
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
          {row?.original?.metadata?.items?.map((item: any, index: number) => {
            total += item.amount
            return (
              <Badge key={index} variant="outline"><span>{item.destination}</span>:<span>{formatCurrency(item.amount)}</span></Badge>
            )
          })}
          <Badge><span>Total</span>:<span>{formatCurrency(total)}</span></Badge>
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
          {row?.original?.metadata?.expenses?.map((item: any, index: number) => {
            total += item.amount
            return (
              <Badge key={index} variant="outline"><span>{item.description}</span>:<span>{formatCurrency(item.amount)}</span></Badge>
            )
          })}
          <Badge><span>Total</span>:<span>{formatCurrency(total)}</span></Badge>
        </div>
      )
    },
  },
  {
    id: "payments",
    header: ({ column }) => <TableColumnHeader column={column} title="Payments" />,
    cell: ({ row }: AnyType) => {
      let total = 0
      return (
        <div className="flex flex-col gap-1">
          {row?.original?.metadata?.payments?.map((item: any, index: number) => {
            total += item.amount
            return (
              <Badge key={index} variant="outline"><span>{formatDate(item.date)}</span>:<span>{formatCurrency(item.amount)}</span></Badge>
            )
          })}
          <Badge><span>Total</span>:<span>{formatCurrency(total)}</span></Badge>
          <Badge><span>Balance</span>:<span>{formatCurrency(row?.original?.metadata?.items?.reduce((acc: number, item: any) => acc + item.amount, 0) - total)}</span></Badge>
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
