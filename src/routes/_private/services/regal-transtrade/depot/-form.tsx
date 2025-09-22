import FormComponent from "@/components/form/form-component"
import { useQuery } from "@tanstack/react-query"
import { getData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
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
import { createTrip, updateTrip } from "../-utils"
import { useAuth } from "@/providers/auth-provider"

export default function TripForm({ id }: { id?: string }) {
  const navigate = useNavigate()
  const { vehicles, drivers, helpers } = useApp()
  const { user } = useAuth()
  const [tripRoutesDepot, setTripRoutesDepot] = useState<AnyType[]>([])
  const [fuelPrice, setFuelPrice] = useState<number>(0)
  const [items, setItems] = useState<AnyType[]>([])
  const [fixedExpenses, setFixedExpenses] = useState<AnyType[]>([])
  const [expenses, setExpenses] = useState<AnyType[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['services', id],
    queryFn: async () => {
      const trip = await getData({ data: {
        table: "services",
        relation: {
          serviceEntities: true
        },
        id
      }})

      return {
        date: formatDateForInput(trip?.from),
        vehicleId: trip?.serviceEntities?.find((entity: AnyType) => entity.entityType === "assets" && entity.role === "vehicle")?.entityId,
        driverId: trip?.serviceEntities?.find((entity: AnyType) => entity.entityType === "employees" && entity.role === "driver")?.entityId,
        helperId: trip?.serviceEntities?.find((entity: AnyType) => entity.entityType === "employees" && entity.role === "helper")?.entityId,
        metadata: trip?.metadata || {},
      }
    },
    enabled: !!id
  })

  const updateFixedExpense = () => {
    const expenses = {
      toll: 0,
      tips: 0,
      fuel: 0
    }

    items.forEach((item) => {
      if (item.route) {
        expenses.toll += item.route.expense.toll * item.count
        expenses.tips += item.route.expense.tips * item.count
        expenses.fuel += item.route.expense.fuel * item.count * (fuelPrice || 0)
      }
    })

    setFixedExpenses((prev) => {
      const newFixedExpenses = [...prev]
      const tollIndex = newFixedExpenses.findIndex((expense) => expense.description === "Toll")
      const tipsIndex = newFixedExpenses.findIndex((expense) => expense.description === "Tips")
      const fuelIndex = newFixedExpenses.findIndex((expense) => expense.description === "Fuel")
      if(tollIndex > -1) {
        newFixedExpenses[tollIndex] = {
          ...newFixedExpenses[tollIndex],
          amount: expenses.toll
        }
      } else {
        newFixedExpenses.push({ description: "Toll", amount: expenses.toll })
      }
      if(tipsIndex > -1) {
        newFixedExpenses[tipsIndex] = {
          ...newFixedExpenses[tipsIndex],
          amount: expenses.tips
        }
      } else {
        newFixedExpenses.push({ description: "Tips", amount: expenses.tips })
      }
      if (fuelIndex > -1) {
        newFixedExpenses[fuelIndex] = {
          ...newFixedExpenses[fuelIndex],
          amount: expenses.fuel,
        }
      } else {
        newFixedExpenses.push({ description: "Fuel", amount: expenses.fuel })
      }

      return newFixedExpenses
    })
  }
  
  useEffect(() => {
    if(id && data){
      const routes = data?.metadata?.routes || []
      const price = data?.metadata?.fuelPrice || 0
      if(tripRoutesDepot !== routes){
        setTripRoutesDepot(routes)
      }
      if(fuelPrice !== price){
        setFuelPrice(price)
      }
      if(items.length === 0){
        setItems(data?.metadata?.items || [])
      }
      if(fixedExpenses.length === 0){
        setFixedExpenses(data?.metadata?.expenses?.filter((expense: AnyType) => ["Toll", "Tips", "Fuel"].some((word) => expense?.description?.includes(word))) || [])
      }else{
        updateFixedExpense()
      }
      if(expenses.length === 0){
        setExpenses(data?.metadata?.expenses?.filter((expense: AnyType) => !["Toll", "Tips", "Fuel"].some((word) => expense?.description?.includes(word))) || [])
      }
    }
    if(!id && user){
      const routes = JSON.parse(user?.activeOrganization?.metadata || "{}")?.tripRoutesDepot || []
      const price = JSON.parse(user?.activeOrganization?.metadata || "{}")?.fuelPrice || 0
      if(tripRoutesDepot !== routes){
        setTripRoutesDepot(routes)
      }
      if(fuelPrice !== price){
        setFuelPrice(price)
      }
      if(items.length === 0){
        setItems([{
          route: routes?.find((route: AnyType) => route.to === 'PL') || null,
          count: 1,
        }])
      }
      if(fixedExpenses.length === 0){
        setFixedExpenses([
          { description: "Toll", amount: routes?.find((route: AnyType) => route.to === 'PL')?.expense?.toll || 0 },
          { description: "Tips", amount: routes?.find((route: AnyType) => route.to === 'PL')?.expense?.tips || 0 },
          { description: "Fuel", amount: (routes?.find((route: AnyType) => route.to === 'PL')?.expense?.fuel || 0) * fuelPrice },
        ])
      }else{
        updateFixedExpense()
      }
    }
  }, [user, id, data, items])

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
                <Label htmlFor={`route-${index}`}>Depot</Label>
                <SelectField field={{
                  name: `route-${index}`,
                  type: "select",
                  value: items[index]?.route ? JSON.stringify(items[index]?.route) : "",
                  placeholder: "Select Depot",
                  isValid: true,
                  isRequired: true,
                  options: tripRoutesDepot.filter((route) => index === 0 ? route.from === 'CPA' : route.from === 'PL')?.map((route) => ({ id: JSON.stringify(route), name: index === 0 ? 'CPA to PL' : route.to })),
                  handleChange: (value: AnyType) => {
                    setItems((prev) => {
                      const newItems = [...prev]
                      newItems[index] = {
                        ...newItems[index],
                        route: JSON.parse(value),
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

  const renderTripExpenseForm = (index: number, readonly: boolean = false) => {
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
                  value: readonly ? fixedExpenses[index]?.description : expenses[index]?.description || "",
                  placeholder: "Enter Description",
                  isValid: true,
                  isRequired: true,
                  handleChange: (value: AnyType) => {
                    if(readonly){
                      setFixedExpenses((prev) => {
                        const newExpenses = [...prev]
                        newExpenses[index] = {
                          ...newExpenses[index],
                          description: value,
                        }
                        return newExpenses
                      })
                    }else{
                      setExpenses((prev) => {
                        const newExpenses = [...prev]
                        newExpenses[index] = {
                          ...newExpenses[index],
                          description: value,
                        }
                        return newExpenses
                      })
                    }
                  },
                  readonly: readonly
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <InputField field={{
                  name: `amount-${index}`,
                  type: "number",
                  value: readonly ? fixedExpenses[index]?.amount : expenses[index]?.amount || "",
                  isValid: true,
                  placeholder: "Enter Amount",
                  handleChange: (value: string) => {
                    if(readonly){
                      setFixedExpenses((prev) => {
                        const newExpenses = [...prev]
                        newExpenses[index] = {
                          ...newExpenses[index],
                          amount: Number(value),
                        }
                        return newExpenses
                      })
                    }else{
                      setExpenses((prev) => {
                        const newExpenses = [...prev]
                        newExpenses[index] = {
                          ...newExpenses[index],
                          amount: Number(value),
                        }
                        return newExpenses
                      })
                    }
                  },
                  readonly: readonly
                }} />
              </div>
            </div>
            {!readonly && <Button type="button" size="icon" variant="destructive" onClick={() => setExpenses((prev) => prev.filter((_, i) => i !== index))}><Trash /></Button>}
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
          type: "depot",
          items: items?.filter((item) => item?.route && item?.count),
          expenses: [...fixedExpenses?.filter((expense) => expense?.description && expense?.amount), ...expenses?.filter((expense) => expense?.description && expense?.amount)],
          routes: tripRoutesDepot || [],
          fuelPrice: fuelPrice || 0,
        }
        if(id){
          return await updateTrip({ data: { id: id, values: payload } })
        }else{
          return await createTrip({ data: { values: payload }})
        }
      }}
      values={id && data ? data : {}}
      onSuccess={() => {
        navigate({
          to: `/services/regal-transtrade/depot`
        })
      }}
      onCancel={() => {
        navigate({
          to: `/services/regal-transtrade/depot`
        })
      }}
      options={{
        isLoading,
        queryKey: 'services',
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
                  route: null,
                  count: "",
                })
                return newItems
              })
            }}><PlusCircle /> Add Another Trip</Button>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Expenses</Label>
            {fixedExpenses?.map((_, index) => renderTripExpenseForm(index, true))}
            {expenses?.map((_, index) => renderTripExpenseForm(index))}
            <Button type="button" variant="outline" className="w-full" onClick={() => {
              setExpenses((prev) => {
                const newExpenses = [...prev]
                newExpenses.push({
                  description: "",
                  amount: "",
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
