import AvatarComponent from "@/components/common/avatar-component"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { contacts } from "@/lib/db/schema"
import { useApp } from "@/providers/app-provider"
import { Edit, Mail, MapPin, Phone } from "lucide-react"

export default function ContactCard({
  contact
}: {
  contact: typeof contacts.$inferSelect
}) {
  const { setContactModal } = useApp()
  
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <AvatarComponent user={contact} options={{ hideBody: true, avatarFallbackClassNames: 'text-2xl' }} classNames='size-24 mx-auto' />
        <p className="text-2xl font-bold">{contact?.name}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">Services</div>
          </div>
          <div>
            <div className="text-2xl font-bold">56</div>
            <div className="text-xs text-muted-foreground">Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold">892</div>
            <div className="text-xs text-muted-foreground">Invoices</div>
          </div>
        </div>
        <div className='flex flex-col gap-2 text-sm text-muted-foreground'>
          <div className="flex items-center">
            <Mail className="size-4 mr-2" />{contact?.email}
          </div>
          <div className="flex items-center">
            <Phone className="size-4 mr-2" />{contact?.phone}
          </div>
          <div className="flex items-center">
            <MapPin className="size-4 mr-2" />{contact?.address}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button className="flex-1" onClick={() => {
            setContactModal({
              id: contact?.id,
              isOpen: true
            })
          }}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}