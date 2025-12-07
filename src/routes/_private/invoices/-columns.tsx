import { ColumnDef } from "@tanstack/react-table"

import { TableColumnHeader } from "@/components/table/table-column-header"
import { TableRowActions } from "@/components/table/table-row-actions"
import { TableActionType } from "@/lib/types"
import { invoices, partners } from "@/lib/db/schema"
import AvatarComponent from "@/components/common/avatar-component"
import { formatCurrency, formatDate } from "@/lib/utils"
import InvoiceBadge from "@/components/app/invoice-badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Eye, Receipt } from "lucide-react"

export const invoiceColumns = ({
  actions
}: {
  actions?: TableActionType
}): ColumnDef<typeof invoices.$inferSelect & {
  customer: typeof partners.$inferSelect
}>[] => [
  {
    accessorKey: "number",
    header: ({ column }) => <TableColumnHeader column={column} title="#" />,
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => <TableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => <AvatarComponent user={row.original.customer} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <TableColumnHeader column={column} title="Issued Date" />,
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <TableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => formatDate(row.original.dueDate),
  },
  {
    id: "status",
    header: ({ column }) => <TableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <InvoiceBadge amount={Number(row.original.amount)} paid={Number(row.original.paid)} dueDate={row.original.dueDate} />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <TableColumnHeader column={column} title="Amount" className="text-right" />,
    cell: ({ row }) => <div className="text-right">{formatCurrency(Number(row.original.amount) || 0)}</div>,
  },
  {
    accessorKey: "paid",
    header: ({ column }) => <TableColumnHeader column={column} title="Paid" className="text-right" />,
    cell: ({ row }) => <div className="text-right">{formatCurrency(Number(row.original.paid) || 0)}</div>,
  },
  {
    id: "actions",
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" className="text-right" />,
    cell: ({ row }) => (
      // <div className="flex justify-end gap-1">
      //   {actions?.view && (
      //     <Tooltip>
      //       <TooltipTrigger asChild>
      //         <Button variant="outline" size="icon" onClick={() => actions?.view?.(row.original.id, row.original)}><Eye /></Button>
      //       </TooltipTrigger>
      //       <TooltipContent>View</TooltipContent>
      //     </Tooltip>
      //   )}
      //   {actions?.edit && (
      //     <Tooltip>
      //       <TooltipTrigger asChild>
      //         <Button variant="outline" size="icon" onClick={() => actions?.edit?.(row.original.id, row.original)}><Receipt /></Button>
      //       </TooltipTrigger>
      //       <TooltipContent>Payment</TooltipContent>
      //     </Tooltip>
      //   )}
      // </div>
      <TableRowActions row={row} actions={actions} />
    ),
  },
]
