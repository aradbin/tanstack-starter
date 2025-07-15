import { Row } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/providers/app-provider"
import { AnyType } from "@/lib/types"

interface TableRowActionsProps {
  row: Row<AnyType>
}

export function TableRowActions({
  row,
}: TableRowActionsProps) {
  const { setIsTaskOpen, setEditId, setDeleteId } = useApp()

  return (
    <div className="flex justify-end gap-1">
      <Button variant="outline" size="icon" onClick={() => {
        setIsTaskOpen(true)
        setEditId(row.original.id)
      }}><Edit /></Button>
      <Button variant="outline" size="icon" className="text-red-500" onClick={() => {
        setDeleteId({
          id: row.original.id,
          title: "Task",
          table: "tasks"
        })
      }}><Trash2 /></Button>
    </div>
  )
}
