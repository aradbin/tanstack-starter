import { Row } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnyType } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface TableRowActionsProps {
  row: Row<AnyType>
  actions?: {
    edit?: (id: AnyType) => void
    delete?: (id: AnyType) => void
  }
}

export function TableRowActions({
  row,
  actions
}: TableRowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      {actions?.edit && (
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" onClick={() => actions?.edit?.(row.original.id)}><Edit /></Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      )}
      {actions?.delete && (
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" className="text-red-500" onClick={() => { actions?.delete?.(row.original.id)}}><Trash2 /></Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
        
      )}
    </div>
  )
}
