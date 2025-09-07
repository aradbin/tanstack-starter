import LoadingComponent from '@/components/common/loading-component'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getData } from '@/lib/db/functions'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import VehicleCard from './-vehicle-card'

export const Route = createFileRoute('/_private/vehicles/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['assets', params?.id],
    queryFn: () => getData({ data: {
      table: "assets",
      id: params?.id,
    }})
  })
  
  if(isLoading){
    return <LoadingComponent isLoading={isLoading} />
  }

  if(data){
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <VehicleCard vehicle={data} />
        <Tabs defaultValue="trips" className='col-span-2'>
          <TabsList className='w-full'>
            <TabsTrigger value="trips">Trips</TabsTrigger>
          </TabsList>
          <TabsContent value="trips">
            
          </TabsContent>
        </Tabs>
      </div>
    )
  }
}
