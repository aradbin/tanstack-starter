import AvatarComponent from '@/components/common/avatar-component'
import LoadingComponent from '@/components/common/loading-component'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getData } from '@/lib/db/functions'
import { contacts, customerContacts, customers } from '@/lib/db/schema'
import { useApp } from '@/providers/app-provider'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BriefcaseBusiness, Edit, Mail, MapPin, MessageCircle, Phone, PlusCircle } from 'lucide-react'

export const Route = createFileRoute('/_private/customers/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const { setIsCustomerOpen, setEditId } = useApp()
  const { data, isLoading }: {
    data: (typeof customers.$inferSelect & {
      customerContacts: ({
        contact: typeof contacts.$inferSelect
      } & typeof customerContacts.$inferSelect)[]
    }) | undefined,
    isLoading: boolean
  } = useQuery({
    queryKey: ['customers', params?.id],
    queryFn: () => getData({ data: {
      table: "customers",
      relation: {
        customerContacts: {
          with: {
            contact: true
          }
        }
      },
      id: params?.id,
    }})
  })

  if(isLoading){
    return <LoadingComponent isLoading={isLoading} />
  }
  
  if(data){
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className="w-full">
          <CardHeader className="text-center">
            <AvatarComponent user={data} options={{ hideBody: true, avatarFallbackClassNames: 'text-2xl' }} classNames='size-24 mx-auto' />
            <p className="text-2xl font-bold">{data?.name}</p>
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
                <BriefcaseBusiness className="size-4 mr-2" />{data?.businessType}
              </div>
              <div className="flex items-center">
                <Mail className="size-4 mr-2" />{data?.email}
              </div>
              <div className="flex items-center">
                <Phone className="size-4 mr-2" />{data?.phone}
              </div>
              <div className="flex items-center">
                <MapPin className="size-4 mr-2" />{data?.address}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Button className="flex-1" onClick={() => {
                setIsCustomerOpen(true)
                setEditId(data?.id)
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="contacts" className='col-span-2'>
          <TabsList className='w-full'>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts">
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {data?.customerContacts?.map((customerContact, index) => (
                <Card key={index}>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="email">

          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if(!isLoading && !data) {
    throw new Error('Customer data not found')
  }

  return null
}
