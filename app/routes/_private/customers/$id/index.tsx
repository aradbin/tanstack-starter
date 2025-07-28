import LoadingComponent from '@/components/common/loading-component'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getData } from '@/lib/db/functions'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import CustomerCard from './-customer-card'
import CustomerContacts from './-customer-contacts'

export const Route = createFileRoute('/_private/customers/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  
  const { data, isLoading } = useQuery({
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
        <CustomerCard customer={data} />
        <Tabs defaultValue="contacts" className='col-span-2'>
          <TabsList className='w-full'>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="contacts">
            <CustomerContacts data={data?.customerContacts} />
          </TabsContent>
          <TabsContent value="tasks">

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
