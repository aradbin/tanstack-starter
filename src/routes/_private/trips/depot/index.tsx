import { createFileRoute } from '@tanstack/react-router'
import TripList from '../-list'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/_private/trips/depot/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card>
      <CardContent className="p-6">
        <TripList basePath="/trips/depot" />
      </CardContent>
    </Card>
  )
}
