import { createFileRoute } from '@tanstack/react-router'
import TripForm from '../-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_private/events/regal-transtrade/district/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create District Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <TripForm />
      </CardContent>
    </Card>
  )
}
