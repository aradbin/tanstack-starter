import AvatarComponent from "@/components/common/avatar-component"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { customerContacts, customers } from "@/lib/db/schema"
import { useApp } from "@/providers/app-provider"
import { useNavigate } from "@tanstack/react-router"
import { Briefcase, BriefcaseBusiness, Edit, Mail, MapPin, Phone } from "lucide-react"

export default function ContactCustomers({
  data
}: {
  data: ({
    customer: typeof customers.$inferSelect
  } & typeof customerContacts.$inferSelect)[]
}) {
  const navigate = useNavigate()
  const { setIsCustomerOpen, setEditId } = useApp()

  if(data?.length){
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {data?.map((customerContact, index) => (
          <Card key={index}>
            <CardHeader className="text-center">
              <AvatarComponent user={customerContact?.customer} options={{ hideBody: true }} classNames='size-12 mx-auto' />
              <p className="font-bold">{customerContact?.customer?.name}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className='flex flex-col gap-2 text-sm text-muted-foreground'>
                <div className="flex items-center">
                  <BriefcaseBusiness className="size-4 mr-2" />{customerContact?.customer?.businessType}
                </div>
                <div className="flex items-center">
                  <Mail className="size-4 mr-2" />{customerContact?.customer?.email}
                </div>
                <div className="flex items-center">
                  <Phone className="size-4 mr-2" />{customerContact?.customer?.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="size-4 mr-2" />{customerContact?.customer?.address}
                </div>
                <Separator className="my-2" />
                <div className="flex items-center">
                  <BriefcaseBusiness className="size-4 mr-2" />{customerContact?.designation}
                </div>
                <div className="flex items-center">
                  <Mail className="size-4 mr-2" />{customerContact?.email}
                </div>
                <div className="flex items-center">
                  <Phone className="size-4 mr-2" />{customerContact?.phone}
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
                <Button className="flex-1" onClick={() => navigate({ to: `/customers/${customerContact?.customerId}` })}>
                  <Briefcase /> Profile
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
      <p className='text-muted-foreground'>No Customers</p>
    </div>
  )
}