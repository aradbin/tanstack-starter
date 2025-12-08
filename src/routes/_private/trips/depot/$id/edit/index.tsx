import { createFileRoute } from '@tanstack/react-router'
import TripForm from '../../-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_private/trips/depot/$id/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Depot Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <TripForm id={id} redirectPath="/trips/depot" />
      </CardContent>
    </Card>
  )
}
