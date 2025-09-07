import LoadingComponent from '@/components/common/loading-component'
import { getData } from '@/lib/db/functions'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import EmployeeCard from './-employee-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/_private/employees/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['employees', params?.id],
    queryFn: () => getData({ data: {
      table: "employees",
      id: params?.id,
    }})
  })
  
  if(isLoading){
    return <LoadingComponent isLoading={isLoading} />
  }

  if(data){
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <EmployeeCard employee={data} />
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
