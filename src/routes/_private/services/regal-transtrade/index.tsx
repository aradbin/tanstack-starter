import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPinHouse, Warehouse } from 'lucide-react'

export const Route = createFileRoute('/_private/services/regal-transtrade/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex justify-center items-center gap-6'>
      <Link to="/services/regal-transtrade/depot" className='w-48'>
        <Card>
          <CardHeader>
            <CardTitle className='flex flex-col text-center justify-center items-center gap-2'>
              <Warehouse />
              <p>Depot Trips</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
      <Link to="/services/regal-transtrade/district" className='w-48'>
        <Card>
          <CardHeader>
            <CardTitle className='flex flex-col text-center justify-center items-center gap-2'>
              <MapPinHouse />
              <p>District Trips</p>
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </div>
  )
}
