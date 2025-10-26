import { Badge } from "../ui/badge"
import { format, isPast, parseISO } from "date-fns"

interface InvoiceBadgeProps {
  amount: number
  paid: number
  dueDate: string
}

export default function InvoiceBadge({ amount, paid, dueDate }: InvoiceBadgeProps) {
  const due = parseISO(dueDate)
  const isOverdue = isPast(due) && paid < amount

  let label = ""
  let variant: "default" | "secondary" | "destructive" | "outline" = "default"
  let className = ""

  if (paid >= amount) {
    label = "Paid"
    variant = "outline",
    className = "bg-green-500/20 text-green-600"
  } else if (paid > 0 && paid < amount) {
    label = "Partial"
    variant = "outline",
    className = "bg-amber-500/20 text-amber-600"
  } else if (isOverdue) {
    label = "Overdue"
    variant = "destructive",
    className = ""
  } else {
    label = "Unpaid"
    variant = "default",
    className = ""
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
