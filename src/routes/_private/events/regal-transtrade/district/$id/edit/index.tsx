import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import TripForm from '../../-form'

export const Route = createFileRoute('/_private/events/regal-transtrade/district/$id/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <TripForm id={params?.id} />
      </CardContent>
    </Card>
  )
}
