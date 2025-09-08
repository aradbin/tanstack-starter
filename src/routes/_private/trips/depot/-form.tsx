import FormComponent from "@/components/form/form-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { fuelPrice, tripRoutesDepot } from "@/lib/organizations/regal-transtrade"
import { useEffect, useState } from "react"
import { formatDateForInput } from "@/lib/utils"
import { subDays } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import SelectField from "@/components/form/select-field"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import InputField from "@/components/form/input-field"
import { useNavigate } from "@tanstack/react-router"
import { useApp } from "@/providers/app-provider"

export default function TripForm({ id }: { id?: string }) {
  const navigate = useNavigate()
  const { vehicles, drivers, helpers } = useApp()
  const [items, setItems] = useState<AnyType[]>([{
    ...tripRoutesDepot[0],
    count: 1,
  }])
  const [expenses, setExpenses] = useState<AnyType[]>([
    { description: "Toll", amount: 90 },
    { description: "Tips", amount: 710 },
    { description: "Fuel", amount: (tripRoutesDepot[0]?.consumption || 0) * fuelPrice },
  ])
  const { data, isLoading } = useQuery({
    queryKey: ['trips', id],
    queryFn: async () => {
      const trip = await getData({ data: {
        table: "trips",
        id
      }})

      setItems(trip?.items || [])
      setExpenses(trip?.expenses || [])

      return trip
    },
    enabled: !!id
  })
  
  useEffect(() => {
    const expenses = {
      toll: 0,
      tips: 0,
      fuel: 0
    }

    items.forEach((item) => {
      if (item.to) {
        expenses.toll += item.toll * item.count
        expenses.tips += item.tips * item.count
        expenses.fuel += item.consumption * item.count * (data?.fuelPrice || fuelPrice)
      }
    })

    setExpenses((prev) => {
      const newExpenses = [...prev]
      const tollIndex = newExpenses.findIndex((expense) => expense.description === "Toll")
      const tipsIndex = newExpenses.findIndex((expense) => expense.description === "Tips")
      const fuelIndex = newExpenses.findIndex((expense) => expense.description === "Fuel")
      if(tollIndex > -1) {
        newExpenses[tollIndex] = {
          ...newExpenses[tollIndex],
          amount: expenses.toll
        }
      } else {
        newExpenses.push({ description: "Toll", amount: expenses.toll })
      }
      if(tipsIndex > -1) {
        newExpenses[tipsIndex] = {
          ...newExpenses[tipsIndex],
          amount: expenses.tips
        }
      } else {
        newExpenses.push({ description: "Tips", amount: expenses.tips })
      }
      if (fuelIndex > -1) {
        newExpenses[fuelIndex] = {
          ...newExpenses[fuelIndex],
          amount: expenses.fuel,
        }
      } else {
        newExpenses.push({ description: "Fuel", amount: expenses.fuel })
      }

      return newExpenses
    })
  }, [items, fuelPrice])

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
        name: "assetId",
        label: "Vehicle",
        type: "select",
        options: vehicles,
        validationOnSubmit: stringRequiredValidation("Vehicle"),
        placeholder: "Select Vehicle",
        isRequired: true
      },
      {
        name: "driverId",
        label: "Driver",
        type: "user",
        options: drivers,
        validationOnSubmit: stringRequiredValidation("Driver"),
        placeholder: "Select Driver",
        isRequired: true
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

  const renderTripItemForm = (index: number) => {
    return (
      <Card className="py-4" key={index}>
        <CardContent className="px-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="grow grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`to-${index}`}>Depot</Label>
                <SelectField field={{
                  name: `to-${index}`,
                  type: "select",
                  value: items[index]?.to || "",
                  placeholder: "Select Depot",
                  isValid: true,
                  isRequired: true,
                  options: tripRoutesDepot.filter((route) => index === 0 ? route.from === 'CPA' : route.from === 'PL')?.map((route) => ({ id: route.to, name: index === 0 ? 'CPA to PL' : route.to })),
                  handleChange: (value: AnyType) => {
                    setItems((prev) => {
                      const newItems = [...prev]
                      newItems[index] = {
                        ...tripRoutesDepot.find((route) => index === 0 ? route.from === 'CPA' : route.from === 'PL' && route.to === value),
                        count: newItems[index]?.count || 1
                      }
                      return newItems
                    })
                  }
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`count-${index}`}>Count</Label>
                <InputField field={{
                  name: `count-${index}`,
                  type: "number",
                  value: items[index]?.count,
                  isValid: true,
                  placeholder: "Enter Count",
                  handleChange: (value: string) => {
                    setItems((prev) => {
                      const newItems = [...prev]
                      newItems[index] = {
                        ...newItems[index],
                        count: Number(value),
                      }
                      return newItems
                    })
                  }
                }} />
              </div>
            </div>
            {index > 0 && <Button type="button" size="icon" variant="destructive" onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}><Trash /></Button>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderTripExpenseForm = (index: number) => {
    return (
      <Card className="py-4" key={index}>
        <CardContent className="px-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="grow grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <InputField field={{
                  name: `description-${index}`,
                  type: "text",
                  value: expenses[index]?.description || "",
                  placeholder: "Enter Description",
                  isValid: true,
                  isRequired: true,
                  handleChange: (value: AnyType) => {
                    setExpenses((prev) => {
                      const newExpenses = [...prev]
                      newExpenses[index] = {
                        ...newExpenses[index],
                        description: value,
                      }
                      return newExpenses
                    })
                  },
                  readonly: index > 2 ? false : true
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <InputField field={{
                  name: `amount-${index}`,
                  type: "number",
                  value: expenses[index]?.amount,
                  isValid: true,
                  placeholder: "Enter Amount",
                  handleChange: (value: string) => {
                    setExpenses((prev) => {
                      const newExpenses = [...prev]
                      newExpenses[index] = {
                        ...newExpenses[index],
                        amount: Number(value),
                      }
                      return newExpenses
                    })
                  },
                  readonly: index > 2 ? false : true
                }} />
              </div>
            </div>
            {index > 2 && <Button type="button" size="icon" variant="destructive" onClick={() => setExpenses((prev) => prev.filter((_, i) => i !== index))}><Trash /></Button>}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <FormComponent
      fields={formFields}
      handleSubmit={async (values: Record<string, any>) => {
        const payload = {
          ...values,
          helperId: values?.helperId || null,
          expenses: expenses?.filter((expense) => expense?.description && expense?.amount),
          items: items?.filter((item) => item?.to && item?.count),
        }
        if(id){
          return await updateData({ data: { table: "trips", id: id, values: payload, title: "Trip" } })
        }else{
          return await createData({ data: { table: "trips", values: {
            ...payload,
            id: generateId(),
            type: "depot",
            fuelPrice: fuelPrice,
          }, title: "Trip" }})
        }
      }}
      values={id && data ? data : {}}
      onSuccess={() => {
        navigate({
          to: `/trips/depot`
        })
      }}
      onCancel={() => {
        navigate({
          to: `/trips/depot`
        })
      }}
      options={{
        isLoading,
        queryKey: 'trips',
      }}
      children={(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <Label>Trips</Label>
            {items?.map((_, index) => renderTripItemForm(index))}
            <Button type="button" variant="outline" className="w-full" onClick={() => {
              setItems((prev) => {
                const newItems = [...prev]
                newItems.push({
                  to: "",
                  count: 1,
                })
                return newItems
              })
            }}><PlusCircle /> Add Another Trip</Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Expenses</Label>
            {expenses?.map((_, index) => renderTripExpenseForm(index))}
            <Button type="button" variant="outline" className="w-full" onClick={() => {
              setExpenses((prev) => {
                const newExpenses = [...prev]
                newExpenses.push({
                  description: "",
                  amount: 0,
                })
                return newExpenses
              })
            }}><PlusCircle /> Add Another Expense</Button>
          </div>
        </div>
      )}
    />
  )
}
