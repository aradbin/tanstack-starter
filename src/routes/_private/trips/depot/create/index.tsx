import { createFileRoute } from '@tanstack/react-router'
import TripForm from '../-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_private/trips/depot/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Depot Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <TripForm redirectPath="/trips/depot" />
      </CardContent>
    </Card>
  )
}
