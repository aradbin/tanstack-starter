import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { getData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { emailRequiredValidation, stringRequiredValidation, stringValidation } from "@/lib/validations"
import { businessTypeOptions, createCustomer, updateCustomer } from "./-utils"
import { useApp } from "@/providers/app-provider"
import { Card, CardContent } from "@/components/ui/card"
import SelectField from "@/components/form/select-field"
import { Button } from "@/components/ui/button"
import { Plus, PlusCircle, Trash } from "lucide-react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import InputField from "@/components/form/input-field"

export default function CustomerForm() {
  const { contacts, isCustomerOpen, setIsCustomerOpen, setIsContactOpen, editId, setEditId } = useApp()
  const [selected, setSelected] = useState<AnyType[]>([{}])
  const { data, isLoading } = useQuery({
    queryKey: ['customers', editId],
    queryFn: async () => {
      const response = await getData({ data: {
        table: "customers",
        relation: {
          customerContacts: {
            with: {
              contact: true
            }
          }
        },
        id: editId
      }})

      if(response?.customerContacts?.length){
        setSelected(response.customerContacts.map((customerContact: AnyType) => ({
          id: customerContact.contactId,
          email: customerContact.email,
          phone: customerContact.phone,
          designation: customerContact.designation
        })))
      }

      return response
    },
    enabled: !!editId && isCustomerOpen
  })

  const formFields: FormFieldType[][] = [
    [
      {
        name: "name",
        validationOnSubmit: stringRequiredValidation("Name"),
        placeholder: "Enter name",
      },
    ],
    [
      {
        name: "email",
        validationOnSubmit: emailRequiredValidation("Email"),
        placeholder: "example@email.com",
      }
    ],
    [
      {
        name: "businessType",
        type: "select",
        label: "Business Type",
        validationOnSubmit: stringRequiredValidation("Business Type"),
        options: businessTypeOptions
      },
    ],
    [
      {
        name: "address",
        validationOnSubmit: stringValidation("Address"),
        placeholder: "Enter address",
      },
    ],
    [
      {
        name: "phone",
        validationOnSubmit: stringValidation("Phone Number"),
        placeholder: "Enter phone number",
      },
    ],
  ]

  const renderContactForm = (index: number) => {
    return (
      <Card className="py-4" key={index}>
        <CardContent className="px-4 space-y-4">
          <div className="flex gap-2">
            <div className="grow">
              <SelectField field={{
                name: "contact_id",
                type: "user",
                value: selected[index]?.id,
                placeholder: "Select Existing",
                isValid: true,
                options: contacts ?? [],
                handleChange: (value: AnyType) => {
                  if(value){
                    const find = contacts.find((contact) => contact.id === value)
                    if(find){
                      setSelected((prev) => {
                        const newSelected = [...prev]
                        newSelected[index] = {
                          ...find,
                          designation: "",
                        }
                        return newSelected
                      })
                    }
                  }else{
                    setSelected((prev) => {
                      const newSelected = [...prev]
                      newSelected[index] = {}
                      return newSelected
                    })
                  }
                }
              }} />
            </div>
            <Button type="button" size="icon" variant="outline" onClick={() => setIsContactOpen(true)}><Plus /></Button>
            <Button type="button" size="icon" variant="destructive" onClick={() => setSelected((prev) => prev.filter((_, i) => i !== index))}><Trash /></Button>
          </div>
          {selected[index]?.id && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <InputField field={{
                  name: `email-${index}`,
                  value: selected[index]?.email,
                  isValid: true,
                  placeholder: "Enter email",
                  handleChange: (value: string) => {
                    const newSelected = [...selected]
                    newSelected[index] = {
                      ...newSelected[index],
                      email: value
                    }
                    setSelected(newSelected)
                  }
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`phone-${index}`}>Phone</Label>
                <InputField field={{
                  name: `phone-${index}`,
                  value: selected[index]?.phone,
                  isValid: true,
                  placeholder: "Enter phone number",
                  handleChange: (value: string) => {
                    const newSelected = [...selected]
                    newSelected[index] = {
                      ...newSelected[index],
                      phone: value
                    }
                    setSelected(newSelected)
                  }
                }} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`designation-${index}`}>Designation</Label>
                <InputField field={{
                  name: `designation-${index}`,
                  value: selected[index]?.designation,
                  isValid: true,
                  placeholder: "Enter designation",
                  handleChange: (value: string) => {
                    const newSelected = [...selected]
                    newSelected[index] = {
                      ...newSelected[index],
                      designation: value
                    }
                    setSelected(newSelected)
                  }
                }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <ModalComponent variant="sheet" options={{
      header: editId ? 'Edit Customer' : 'Create Customer',
      isOpen: isCustomerOpen,
      onClose: () => {
        setIsCustomerOpen(false)
        setEditId(null)
        setSelected([{}])
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => editId ?
            updateCustomer({ data: { values: {
              ...values,
              contacts: selected
            }, id: editId } }) :
            createCustomer({ data: { values: {
              ...values,
              contacts: selected
            }}})}
          values={isCustomerOpen && editId && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: [['customers'],['contacts']]
          }}
          children={(
            <div className="flex flex-col gap-2">
              <Label>Contacts</Label>
              {selected?.map((_, index) => renderContactForm(index))}
              <Button type="button" variant="outline" className="w-full" onClick={() => setSelected((prev) => [...prev, {}])}><PlusCircle /> Add Another Contact</Button>
            </div>
          )}
        />
      )}
    </ModalComponent>
  )
}
