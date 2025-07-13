import { ReactNode, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ModalComponent ({
  children,
  variant = "default",
  options,
}: {
  children: ReactNode | ((props: { close: () => void }) => ReactNode)
  variant?: "default" | "responsive" | "sheet"
  options?: {
    header?: string
    description?: string
    confirmOnClose?: boolean
    preventClose?: boolean
  }
}) {
  const [open, setOpen] = useState(false)

  const renderContent =
    typeof children === "function"
      ? children({ close: () => setOpen(false) })
      : children

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><PlusCircle /> Create</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} onInteractOutside={(e) => {
        if (options?.preventClose) {
          e.preventDefault()
        }
      }} onEscapeKeyDown={(e) => {
        if (options?.preventClose) {
          e.preventDefault()
        }
      }}>
        {(options?.header || options?.description) && (
          <DialogHeader>
            {options?.header && <DialogTitle>{options?.header}</DialogTitle>}
            {options?.description && <DialogDescription>{options?.description}</DialogDescription>}
          </DialogHeader>
        )}
        {renderContent}
      </DialogContent>
    </Dialog>
  )
}