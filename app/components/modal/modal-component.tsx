import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ModalComponent ({
  children,
  trigger,
  variant = "default",
  options,
}: {
  children: ReactNode | ((props: { close: () => void }) => ReactNode)
  trigger?: ReactNode
  variant?: "default" | "responsive" | "sheet"
  options?: {
    header?: string
    description?: string
    isOpen?: boolean
    onClose?: () => void
  }
}) {
  const [open, setOpen] = useState(false)

  const renderContent =
    typeof children === "function"
      ? children({ close: () => {
        setOpen(false)
        options?.onClose?.()
      } })
      : children

  return (
    <Dialog open={options?.isOpen ?? open} onOpenChange={(state) => {
      setOpen(state)
      if(!state && options?.onClose) {
        options?.onClose?.()
      }
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
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