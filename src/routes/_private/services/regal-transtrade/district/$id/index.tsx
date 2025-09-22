import AvatarComponent from '@/components/common/avatar-component'
import LoadingComponent from '@/components/common/loading-component'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { getData } from '@/lib/db/functions'
import { useApp } from '@/providers/app-provider'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Edit, Trash } from 'lucide-react'

export const Route = createFileRoute('/_private/services/regal-transtrade/district/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const navigate = Route.useNavigate()
  const { setDeleteModal } = useApp()

  const { data, isLoading } = useQuery({
    queryKey: ['services', params?.id],
    queryFn: () => getData({ data: {
      table: "services",
      relation: {
        vehicle: true,
        driver: true,
        helper: true
      },
      id: params?.id,
    }})
  })
  
  if(isLoading){
    return <LoadingComponent isLoading={isLoading} />
  }

  if(data){
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            <div className='flex justify-start items-center gap-4'>
              <Link to='/services/depot'>
                <Button size="icon" variant="outline"><ArrowLeft /></Button>
              </Link>
              Trip Details
            </div>
            {params?.id && (
              <div className='flex justify-end items-center gap-2'>
                <Link to='/services/depot/$id/edit' params={{ id: params?.id }}>
                  <Button size="icon"><Edit /></Button>
                </Link>
                <Button size="icon" variant="destructive" onClick={() => {
                  setDeleteModal({
                    id: params?.id,
                    title: "Trip",
                    table: "services",
                    onSuccess: () => {
                      navigate({
                        to: '/services/depot'
                      })
                    }
                  })
                }}>
                  <Trash />
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className='w-auto'>
            <TableBody>
              <TableRow className='border-none hover:bg-transparent'>
                <TableHead>Vehicle</TableHead>
                <TableCell>{data?.vehicle?.registrationNumber}</TableCell>
              </TableRow>
              <TableRow className='border-none hover:bg-transparent'>
                <TableHead>Driver</TableHead>
                <TableCell>
                  <AvatarComponent user={{
                    ...data?.driver,
                    email: data?.driver?.phone
                  }} />
                </TableCell>
              </TableRow>
              <TableRow className='border-none hover:bg-transparent'>
                <TableHead>Helper</TableHead>
                <TableCell>
                  <AvatarComponent user={{
                    ...data?.helper,
                    email: data?.helper?.phone
                  }} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
}
