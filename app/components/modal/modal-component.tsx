import { ReactNode, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function ModalComponent ({
  children,
  variant = "default",
  options,
}: {
  children: (props?: { close: () => void }) => React.ReactNode
  variant?: "default" | "responsive" | "sheet"
  options?: {
    header?: string
    description?: string
  }
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><PlusCircle /> Create</Button>
      </DialogTrigger>
      <DialogContent>
        {(options?.header || options?.description) && (
          <DialogHeader>
            {options?.header && <DialogTitle>{options?.header}</DialogTitle>}
            {options?.description && <DialogDescription>{options?.description}</DialogDescription>}
          </DialogHeader>
        )}
        {children({ close: () => setOpen(false) })}
      </DialogContent>
    </Dialog>
  )
}