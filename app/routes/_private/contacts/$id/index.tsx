import LoadingComponent from '@/components/common/loading-component'
import { getData } from '@/lib/db/functions'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import ContactCard from './-contact-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContactCustomers from './-contact-customers'

export const Route = createFileRoute('/_private/contacts/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', params?.id],
    queryFn: () => getData({ data: {
      table: "contacts",
      relation: {
        customerContacts: {
          with: {
            customer: true
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
        <ContactCard contact={data} />
        <Tabs defaultValue="customers" className='col-span-2'>
          <TabsList className='w-full'>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="customers">
            <ContactCustomers data={data?.customerContacts} />
          </TabsContent>
          <TabsContent value="tasks">

          </TabsContent>
        </Tabs>
      </div>
    )
  }
}
