import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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
  const isMobile = useIsMobile()

  const renderContent =
    typeof children === "function"
      ? children({ close: () => {
        setOpen(false)
        options?.onClose?.()
      } })
      : children

  const renderDialog = (
    <Dialog open={options?.isOpen ?? open} onOpenChange={(state) => {
      setOpen(state)
      if(!state && options?.onClose) {
        options?.onClose?.()
      }
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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

  const renderDrawer = (
    <Drawer open={options?.isOpen ?? open} onOpenChange={(state) => {
      setOpen(state)
      if(!state && options?.onClose) {
        options?.onClose?.()
      }
    }}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        {(options?.header || options?.description) && (
          <DrawerHeader className="text-left">
            {options?.header && <DrawerTitle>{options?.header}</DrawerTitle>}
            {options?.description && <DrawerDescription>{options?.description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className="p-5 pt-0">
          {renderContent}
        </div>
      </DrawerContent>
    </Drawer>
  )

  const renderSheet = (
    <Sheet open={options?.isOpen ?? open} onOpenChange={(state) => {
      setOpen(state)
      if(!state && options?.onClose) {
        options?.onClose?.()
      }
    }}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        {(options?.header || options?.description) && (
          <SheetHeader>
            {options?.header && <SheetTitle>{options?.header}</SheetTitle>}
            {options?.description && <SheetDescription>{options?.description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="p-5 pt-0">
          {renderContent}
        </div>
      </SheetContent>
    </Sheet>
  )

  if(variant === "sheet"){
    return renderSheet
  }

  if(variant === "responsive" && isMobile) {
    return renderDrawer
  }

  return renderDialog
}