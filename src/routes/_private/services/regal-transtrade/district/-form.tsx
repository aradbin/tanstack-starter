import FormComponent from "@/components/form/form-component"
import { useQuery } from "@tanstack/react-query"
import { getData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { useState } from "react"
import { formatDateForInput } from "@/lib/utils"
import { subDays } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"
import InputField from "@/components/form/input-field"
import { useNavigate } from "@tanstack/react-router"
import { useApp } from "@/providers/app-provider"
import { createTrip, updateTrip } from "../-utils"
import DateField from "@/components/form/date-field"
import SelectField from "@/components/form/select-field"
import { paymentMethods } from "@/lib/variables"

export default function TripForm({ id }: { id?: string }) {
  const navigate = useNavigate()
  const { vehicles, drivers, helpers } = useApp()
  const [items, setItems] = useState<AnyType[]>([
    {
      destination: "",
      amount: ""
    }
  ])
  const [expenses, setExpenses] = useState<AnyType[]>([
    {
      description: "Driver Allowance",
      amount: ""
    }
  ])
  const [payments, setPayments] = useState<AnyType[]>([
    {
      date: formatDateForInput(new Date()),
      amount: "",
      method: "cash",
      note: ""
    }
  ])
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

      setItems(trip?.metadata?.items || [])
      setExpenses(trip?.metadata?.expenses || [])
      setPayments(trip?.metadata?.payments || [])

      return {
        date: formatDateForInput(trip?.from),
        vehicleId: trip?.serviceEntities?.find((entity: AnyType) => entity.entityType === "assets" && entity.role === "vehicle")?.entityId,
        driverId: trip?.serviceEntities?.find((entity: AnyType) => entity.entityType === "employees" && entity.role === "driver")?.entityId,
        helperId: trip?.serviceEntities?.find((entity: AnyType) => entity.entityType === "employees" && entity.role === "helper")?.entityId,
        customer: trip?.metadata?.customer?.name || "",
        phone: trip?.metadata?.customer?.phone || "",
        reference: trip?.metadata?.customer?.reference || "",
      }
    },
    enabled: !!id
  })

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
    [
      {
        name: "customer",
        validationOnSubmit: stringRequiredValidation("Customer"),
        placeholder: "Enter Customer Name",
        isRequired: true,
      },
      {
        name: "phone",
        validationOnSubmit: stringRequiredValidation("Customer Phone Number"),
        placeholder: "Enter Customer Phone Number",
        isRequired: true,
      },
      {
        name: "reference",
        label: "Reference By",
        validationOnSubmit: stringValidation("Reference By"),
        placeholder: "Enter Reference By",
      }
    ],
  ]

  const renderTripItemForm = (index: number) => {
    return (
      <Card className="py-4" key={index}>
        <CardContent className="px-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="grow grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`destination-${index}`}>Destination</Label>
                <InputField field={{
                  name: `destination-${index}`,
                  value: items[index]?.destination || "",
                  placeholder: "Enter Destination",
                  isValid: true,
                  isRequired: true,
                  handleChange: (value: AnyType) => {
                    setItems((prev) => {
                      const newItems = [...prev]
                      newItems[index] = {
                        ...newItems[index],
                        destination: value,
                      }
                      return newItems
                    })
                  }
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`amount-${index}`}>Fare</Label>
                <InputField field={{
                  name: `amount-${index}`,
                  type: "number",
                  value: items[index]?.amount || "",
                  isValid: true,
                  placeholder: "Enter Fare",
                  handleChange: (value: string) => {
                    setItems((prev) => {
                      const newItems = [...prev]
                      newItems[index] = {
                        ...newItems[index],
                        amount: Number(value),
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
                }} />
              </div>
            </div>
            {index > 0 && <Button type="button" size="icon" variant="destructive" onClick={() => setExpenses((prev) => prev.filter((_, i) => i !== index))}><Trash /></Button>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderTripPaymentForm = (index: number) => {
    return (
      <Card className="py-4" key={index}>
        <CardContent className="px-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`date-${index}`}>Date</Label>
                <DateField field={{
                  name: `date-${index}`,
                  type: "date",
                  value: payments[index]?.date || formatDateForInput(new Date()),
                  placeholder: "Enter Date",
                  isValid: true,
                  isRequired: true,
                  handleChange: (value: AnyType) => {
                    setPayments((prev) => {
                      const newPayments = [...prev]
                      newPayments[index] = {
                        ...newPayments[index],
                        date: value,
                      }
                      return newPayments
                    })
                  },
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <InputField field={{
                  name: `amount-${index}`,
                  type: "number",
                  value: payments[index]?.amount,
                  isValid: true,
                  placeholder: "Enter Amount",
                  handleChange: (value: string) => {
                    setPayments((prev) => {
                      const newPayments = [...prev]
                      newPayments[index] = {
                        ...newPayments[index],
                        amount: Number(value),
                      }
                      return newPayments
                    })
                  },
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`method-${index}`}>Payment Method</Label>
                <SelectField field={{
                  name: `method-${index}`,
                  type: "select",
                  value: payments[index]?.method || "cash",
                  placeholder: "Select Method",
                  isValid: true,
                  isRequired: true,
                  options: paymentMethods,
                  handleChange: (value: AnyType) => {
                    setPayments((prev) => {
                      const newPayments = [...prev]
                      newPayments[index] = {
                        ...newPayments[index],
                        method: value
                      }
                      return newPayments
                    })
                  }
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`note-${index}`}>Note</Label>
                <InputField field={{
                  name: `note-${index}`,
                  value: payments[index]?.note || "",
                  isValid: true,
                  placeholder: "Enter Note",
                  handleChange: (value: string) => {
                    setPayments((prev) => {
                      const newPayments = [...prev]
                      newPayments[index] = {
                        ...newPayments[index],
                        note: value,
                      }
                      return newPayments
                    })
                  },
                }} />
              </div>
            </div>
            {index > 0 && <Button type="button" size="icon" variant="destructive" onClick={() => setPayments((prev) => prev.filter((_, i) => i !== index))}><Trash /></Button>}
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
          type: "district",
          helperId: values?.helperId || null,
          items: items?.filter((item) => item?.destination && item?.amount),
          expenses: expenses?.filter((expense) => expense?.description && expense?.amount),
          payments: payments?.filter((payment) => payment?.date && payment?.amount),
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
          to: `/services/regal-transtrade/district`
        })
      }}
      onCancel={() => {
        navigate({
          to: `/services/regal-transtrade/district`
        })
      }}
      options={{
        isLoading,
        queryKey: 'services',
      }}
      children={(
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <Label>Trips</Label>
              {items?.map((_, index) => renderTripItemForm(index))}
              <Button type="button" variant="outline" className="w-full" onClick={() => {
                setItems((prev) => {
                  const newItems = [...prev]
                  newItems.push({
                    destination: "",
                    amount: ""
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
                    amount: "",
                  })
                  return newExpenses
                })
              }}><PlusCircle /> Add Another Expense</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Payments</Label>
            {payments?.map((_, index) => renderTripPaymentForm(index))}
            <Button type="button" variant="outline" className="w-full" onClick={() => {
              setPayments((prev) => {
                const newPayments = [...prev]
                newPayments.push({
                  date: formatDateForInput(new Date()),
                  amount: "",
                  method: "cash",
                  note: "",
                })
                return newPayments
              })
            }}><PlusCircle /> Add Another Payment</Button>
          </div>
        </div>
      )}
    />
  )
}
