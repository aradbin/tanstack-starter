import { AnyType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { X } from "lucide-react"

export default function TableReset({
  hasReset
}: {
  hasReset?: boolean
}) {
  const navigate: AnyType = useNavigate()

  if(hasReset){
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          navigate({
            search: (prev: AnyType) => ({
              ...prev?.page ? { page: prev?.page } : {},
              ...prev?.pageSize ? { pageSize: prev?.pageSize } : {},
            }),
            replace: true
          })
        }}
      >
        Reset
        <X />
      </Button>
    )
  }
  
  return null
}