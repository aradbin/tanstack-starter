/**
 * Trip list component with optimized table view
 * Displays trips with efficient querying and clean UI
 */

import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import { Edit, Eye, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { getTrips, deleteTrip } from "./-utils"
import type {
  TripFilters,
  TripWithRelations,
  DepotTripCalculations,
} from "./-types"

interface TripListProps {
  filters?: TripFilters
  basePath?: string
}

export default function TripList({
  filters = {},
  basePath = "/trips/depot",
}: TripListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch trips with filters
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["trips", filters],
    queryFn: async () => {
      return await getTrips({
        data: {
          filters,
        },
      })
    },
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) {
      return
    }

    setDeletingId(id)
    try {
      await deleteTrip({ data: { id } })
      await refetch()
    } catch (error) {
      console.error("Error deleting trip:", error)
      alert("Failed to delete trip")
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading trips...
        </CardContent>
      </Card>
    )
  }

  const trips: TripWithRelations[] = data?.trips || []
  const calculations = data?.calculations as DepotTripCalculations | undefined

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {calculations && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calculations.totalTrips}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(calculations.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(calculations.totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Fuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calculations.totalFuel}L
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fuel Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(calculations.totalFuelExpense)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trips Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Depot Trips</CardTitle>
          <Link to={`${basePath}/create` as any}>
            <Button>Add New Trip</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No trips found. Create your first trip to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Helper</TableHead>
                    <TableHead className="text-right">Trips</TableHead>
                    <TableHead className="text-right">Fuel (L)</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => {
                    const tripCount =
                      trip.items?.reduce(
                        (sum, item) => sum + (item.count || 0),
                        0
                      ) || 0
                    const totalFuel =
                      trip.items?.reduce((sum, item) => {
                        const liters =
                          typeof item.fuelLitersTotal === "number"
                            ? item.fuelLitersTotal
                            : parseFloat(item.fuelLitersTotal || "0")
                        return sum + liters
                      }, 0) || 0
                    const totalIncome =
                      trip.items?.reduce((sum, item) => {
                        const income =
                          typeof item.incomeTotal === "number"
                            ? item.incomeTotal
                            : parseFloat(item.incomeTotal || "0")
                        return sum + income
                      }, 0) || 0
                    const totalExpenses =
                      trip.expenses?.reduce((sum, expense) => {
                        const amount =
                          typeof expense.amount === "number"
                            ? expense.amount
                            : parseFloat(expense.amount || "0")
                        return sum + amount
                      }, 0) || 0

                    return (
                      <TableRow key={trip.id}>
                        <TableCell>
                          {format(new Date(trip.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {trip.vehicle?.name || trip.vehicle?.registrationNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {trip.driver
                            ? `${trip.driver.firstName} ${trip.driver.lastName}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {trip.helper
                            ? `${trip.helper.firstName} ${trip.helper.lastName}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tripCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {totalFuel?.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {formatCurrency(totalIncome)}
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {formatCurrency(totalExpenses)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`${basePath}/${trip.id}` as any}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`${basePath}/${trip.id}/edit` as any}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(trip.id)}
                              disabled={deletingId === trip.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
