import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getTripById } from '../../-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'

export const Route = createFileRoute('/_private/trips/depot/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => await getTripById({ data: { id } }),
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          Loading trip details...
        </CardContent>
      </Card>
    )
  }

  if (!trip) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          Trip not found
        </CardContent>
      </Card>
    )
  }

  const totalExpenses = trip.expenses?.reduce(
    (sum, expense) => sum + (typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount || '0')),
    0
  ) || 0

  const totalTrips = trip.items?.reduce((sum, item) => sum + (item.count || 0), 0) || 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to={"/trips/depot" as any}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
        </Link>
        <Link to={`/trips/depot/${id}/edit` as any}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Trip
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">
                {format(new Date(trip.date), 'MMM dd, yyyy')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Vehicle</div>
              <div className="font-medium">
                {trip.vehicle?.name || trip.vehicle?.registrationNumber || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Driver</div>
              <div className="font-medium">
                {trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Helper</div>
              <div className="font-medium">
                {trip.helper ? `${trip.helper.firstName} ${trip.helper.lastName}` : '-'}
              </div>
            </div>
          </div>

          {/* Trip Items */}
          <div>
            <h3 className="font-semibold mb-3">Trip Items ({totalTrips} trips)</h3>
            <div className="space-y-2">
              {trip.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">
                      {item.from} → {item.to}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Count: {item.count}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div>Toll: {formatCurrency(typeof item.tollTotal === 'number' ? item.tollTotal : parseFloat(item.tollTotal || '0'))}</div>
                    <div>Tips: {formatCurrency(typeof item.tipsTotal === 'number' ? item.tipsTotal : parseFloat(item.tipsTotal || '0'))}</div>
                    <div>Fuel: {typeof item.fuelLitersTotal === 'number' ? item.fuelLitersTotal : parseFloat(item.fuelLitersTotal || '0')}L</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses */}
          <div>
            <h3 className="font-semibold mb-3">
              Expenses (Total: {formatCurrency(totalExpenses)})
            </h3>
            <div className="space-y-2">
              {trip.expenses?.map((expense, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {expense.expenseType}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount || '0'))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {trip.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{trip.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
