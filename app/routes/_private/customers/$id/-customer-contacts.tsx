import AvatarComponent from "@/components/common/avatar-component"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { contacts, customerContacts } from "@/lib/db/schema"
import { useApp } from "@/providers/app-provider"
import { useNavigate } from "@tanstack/react-router"
import { BriefcaseBusiness, Contact, Edit, Mail, MapPin, Phone, User } from "lucide-react"

export default function CustomerContacts({
  data
}: {
  data: ({
    contact: typeof contacts.$inferSelect
  } & typeof customerContacts.$inferSelect)[]
}) {
  const navigate = useNavigate()
  const { setIsCustomerOpen, setEditId } = useApp()

  if(data?.length){
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {data?.map((customerContact, index) => (
          <Card className="w-full" key={index}>
            <CardHeader className="text-center">
              <AvatarComponent user={customerContact?.contact} options={{ hideBody: true }} classNames='size-12 mx-auto' />
              <p className="font-bold">{customerContact?.contact?.name}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className='flex flex-col gap-2 text-sm text-muted-foreground'>
                <div className="flex items-center">
                  <BriefcaseBusiness className="size-4 mr-2" />{customerContact?.designation}
                </div>
                <div className="flex items-center">
                  <Mail className="size-4 mr-2" />{customerContact?.email || customerContact?.contact?.email}
                </div>
                <div className="flex items-center">
                  <Phone className="size-4 mr-2" />{customerContact?.phone || customerContact?.contact?.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="size-4 mr-2" />{customerContact?.contact?.address}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Button className="flex-1" onClick={() => {
                  setIsCustomerOpen(true)
                  setEditId(customerContact?.customerId)
                }}>
                  <Edit />
                  Edit
                </Button>
                <Button className="flex-1" onClick={() => navigate({ to: `/contacts/${customerContact?.contact?.id}` })}>
                  <Contact /> Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full justify-center items-center">
      <p className='text-muted-foreground'>No contacts</p>
    </div>
  )
}