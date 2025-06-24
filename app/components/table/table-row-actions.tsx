import { Row } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TableRowActionsProps<TData> {
  row: Row<TData>
}

export function TableRowActions<TData>({
  row,
}: TableRowActionsProps<TData>) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="outline" size="icon"><Edit /></Button>
      <Button variant="outline" size="icon" className="text-red-500"><Trash2 /></Button>
    </div>
  )
}
