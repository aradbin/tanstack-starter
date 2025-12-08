/**
 * Clean, reusable trip form component
 * Uses custom hook for business logic, focuses on UI presentation
 */

import { useNavigate } from "@tanstack/react-router"
import { subDays } from "date-fns"
import { PlusCircle, Trash } from "lucide-react"
import FormComponent from "@/components/form/form-component"
import InputField from "@/components/form/input-field"
import SelectField from "@/components/form/select-field"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useApp } from "@/providers/app-provider"
import { formatDateForInput } from "@/lib/utils"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { useTripForm } from "../-hooks"
import { createTrip, updateTrip } from "../-utils"
import type { FormFieldType } from "@/lib/types"

interface TripFormProps {
  id?: string
  redirectPath?: string
}

export default function TripForm({ id, redirectPath }: TripFormProps) {
  const navigate = useNavigate()
  const { vehicles, drivers, helpers } = useApp()

  // Use custom hook for form logic
  const {
    items,
    expenses,
    fixedExpenses,
    availableRoutes,
    fuelPrice,
    addItem,
    removeItem,
    updateItem,
    addExpense,
    removeExpense,
    updateExpense,
    getTotalExpenses,
    getTotalTripCount,
    convertToTripInput,
    isLoading,
    initialData,
  } = useTripForm({ id })

  // Form fields configuration
  const formFields: FormFieldType[][] = [
    [
      {
        name: "date",
        type: "date",
        defaultValue: formatDateForInput(subDays(new Date(), 1)),
        validationOnSubmit: stringRequiredValidation("Date"),
        placeholder: "Enter Trip Date",
      },
      {
        name: "vehicleId",
        label: "Vehicle",
        type: "select",
        options: vehicles,
        validationOnSubmit: stringRequiredValidation("Vehicle"),
        placeholder: "Select Vehicle",
        isRequired: true,
      },
      {
        name: "driverId",
        label: "Driver",
        type: "user",
        options: drivers,
        validationOnSubmit: stringRequiredValidation("Driver"),
        placeholder: "Select Driver",
        isRequired: true,
      },
      {
        name: "helperId",
        label: "Helper",
        type: "user",
        options: helpers,
        validationOnSubmit: stringValidation("Helper"),
        placeholder: "Select Helper",
      },
    ],
  ]

  // Handle form submission
  const handleSubmit = async (values: Record<string, any>) => {
    const tripInput = convertToTripInput(values)

    if (id) {
      return await updateTrip({ data: { id, trip: tripInput } })
    } else {
      return await createTrip({ data: { trip: tripInput } })
    }
  }

  // Handle navigation
  const handleSuccess = () => {
    navigate({ to: redirectPath || `/trips/depot` })
  }

  const handleCancel = () => {
    navigate({ to: redirectPath || `/trips/depot` })
  }

  return (
    <FormComponent
      fields={formFields}
      handleSubmit={handleSubmit}
      values={
        id && initialData
          ? {
              date: formatDateForInput(initialData.date),
              vehicleId: initialData.vehicleId,
              driverId: initialData.driverId,
              helperId: initialData.helperId,
            }
          : {}
      }
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      options={{
        isLoading,
        queryKey: "trips",
      }}
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Label className="text-xs text-muted-foreground">Total Trips</Label>
            <p className="text-2xl font-semibold">{getTotalTripCount()}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Total Expenses</Label>
            <p className="text-2xl font-semibold">₹{getTotalExpenses()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trip Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Trip Items</Label>
              <span className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <TripItemCard
                  key={index}
                  index={index}
                  item={item}
                  availableRoutes={availableRoutes}
                  onUpdate={(updates) => updateItem(index, updates)}
                  onRemove={() => removeItem(index)}
                  showRemove={index > 0}
                  isFirstItem={index === 0}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addItem}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Trip
            </Button>
          </div>

          {/* Expenses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Expenses</Label>
              <span className="text-sm text-muted-foreground">
                ₹{getTotalExpenses()}
              </span>
            </div>

            <div className="space-y-3">
              {/* Fixed Expenses */}
              {fixedExpenses.map((expense, index) => (
                <ExpenseCard
                  key={`fixed-${index}`}
                  index={index}
                  expense={expense}
                  onUpdate={() => {}} // Fixed expenses are calculated
                  onRemove={() => {}}
                  readonly
                />
              ))}

              {/* Custom Expenses */}
              {expenses.map((expense, index) => (
                <ExpenseCard
                  key={`custom-${index}`}
                  index={index}
                  expense={expense}
                  onUpdate={(updates) => updateExpense(index, updates)}
                  onRemove={() => removeExpense(index)}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addExpense}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Expense
            </Button>
          </div>
        </div>
      </div>
    </FormComponent>
  )
}

// Trip Item Card Component
interface TripItemCardProps {
  index: number
  item: { route: any; count: number }
  availableRoutes: any[]
  onUpdate: (updates: any) => void
  onRemove: () => void
  showRemove: boolean
  isFirstItem: boolean
}

function TripItemCard({
  index,
  item,
  availableRoutes,
  onUpdate,
  onRemove,
  showRemove,
  isFirstItem,
}: TripItemCardProps) {
  // Filter routes based on position (first item starts from CPA)
  const filteredRoutes = availableRoutes.filter((route) =>
    isFirstItem ? route.from === "CPA" : route.from === "PL"
  )

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor={`route-${index}`}>
                {isFirstItem ? "Route" : "Depot"}
              </Label>
              <SelectField
                field={{
                  name: `route-${index}`,
                  type: "select",
                  value: item.route ? JSON.stringify(item.route) : "",
                  placeholder: "Select Depot",
                  isValid: true,
                  isRequired: true,
                  options: filteredRoutes.map((route) => ({
                    id: JSON.stringify(route),
                    name: isFirstItem ? "CPA to PL" : route.to,
                  })),
                  handleChange: (value: string) => {
                    onUpdate({ route: JSON.parse(value) })
                  },
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`count-${index}`}>Count</Label>
              <InputField
                field={{
                  name: `count-${index}`,
                  type: "number",
                  value: item.count,
                  isValid: true,
                  placeholder: "Enter Count",
                  handleChange: (value: string) => {
                    onUpdate({ count: Number(value) })
                  },
                }}
              />
            </div>
          </div>

          {showRemove && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={onRemove}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Show route details */}
        {item.route && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground grid grid-cols-3 gap-2">
            <div>Toll: ₹{item.route.expense.toll * item.count}</div>
            <div>Tips: ₹{item.route.expense.tips * item.count}</div>
            <div>Fuel: {item.route.expense.fuel * item.count}L</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Expense Card Component
interface ExpenseCardProps {
  index: number
  expense: { description: string; amount: number }
  onUpdate: (updates: any) => void
  onRemove: () => void
  readonly?: boolean
}

function ExpenseCard({
  index,
  expense,
  onUpdate,
  onRemove,
  readonly = false,
}: ExpenseCardProps) {
  return (
    <Card className={readonly ? "bg-muted/50" : ""}>
      <CardContent className="pt-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor={`expense-desc-${index}`}>Description</Label>
              <InputField
                field={{
                  name: `expense-desc-${index}`,
                  type: "text",
                  value: expense.description,
                  placeholder: "Enter Description",
                  isValid: true,
                  isRequired: true,
                  handleChange: (value: string) => {
                    onUpdate({ description: value })
                  },
                  readonly,
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`expense-amount-${index}`}>Amount</Label>
              <InputField
                field={{
                  name: `expense-amount-${index}`,
                  type: "number",
                  value: expense.amount,
                  isValid: true,
                  placeholder: "Enter Amount",
                  handleChange: (value: string) => {
                    onUpdate({ amount: Number(value) })
                  },
                  readonly,
                }}
              />
            </div>
          </div>

          {!readonly && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={onRemove}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
