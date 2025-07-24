import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { emailRequiredValidation, stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { businessTypeOptions } from "./-utils"
import { useApp } from "@/providers/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SelectField from "@/components/form/select-field"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import AvatarComponent from "@/components/common/avatar-component"
import InputField from "@/components/form/input-field"

export default function CustomerForm({
  isOpen,
  setIsOpen,
  editId,
  setEditId
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  editId?: AnyType
  setEditId?: (id: AnyType) => void
}) {
  const [selected, setSelected] = useState<AnyType[]>([])
  const { contacts, setIsContactOpen } = useApp()
  const { data, isLoading } = useQuery({
    queryKey: ['customer', editId],
    queryFn: async () => getData({ data: {
      table: "customers",
      id: editId
    }}),
    enabled: !!editId && isOpen
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

  return (
    <ModalComponent variant="sheet" options={{
      header: editId ? 'Edit Customer' : 'Create Customer',
      isOpen: isOpen,
      onClose: () => {
        setIsOpen(false)
        setEditId?.(null)
        setSelected([])
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => editId ?
            updateData({ data: { table: "customers", id: editId, values, title: "Customer" } }) :
            createData({ data: { table: "customers", values: {
              id: generateId(),
              ...values,
            }, title: "Customer" } })}
          values={isOpen && editId && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'customers'
          }}
          children={(
            <Card className="py-4">
              <CardHeader className="px-4">
                <CardTitle>Contacts</CardTitle>
                <CardDescription>Add existing contacts or create new ones</CardDescription>
              </CardHeader>
              <CardContent className="px-4 space-y-4">
                <div className="flex gap-2">
                  <div className="grow">
                    <SelectField field={{
                      name: "",
                      type: "user",
                      value: selected[0],
                      placeholder: "Select Existing",
                      isValid: true,
                      options: contacts,
                      handleChange: (id: AnyType) => {
                        if(id){
                          setSelected([id])
                        }else{
                          setSelected([])
                        }
                      }
                    }} />
                  </div>
                  <Button type="button" size="icon" variant="outline" onClick={() => setIsContactOpen(true)}><Plus /></Button>
                </div>
                {selected.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <Label>Selected Contacts</Label>
                    <Card className="py-4">
                      <CardContent className="flex flex-col gap-4 px-4">
                        {contacts?.find((contact) => contact.id === selected[0]) && (
                          <div className="flex w-full">
                            <div className="grow">
                              <AvatarComponent user={contacts?.find((contact) => contact.id === selected[0]) || { id: "", name: "" }} />
                            </div>
                            <Button type="button" size="icon" variant="destructive" onClick={() => setSelected([])}><Trash /></Button>
                          </div>
                        )}
                        <InputField field={{
                          name: "email",
                          isValid: true,
                        }} />
                        <InputField field={{
                          name: "phone",
                          isValid: true,
                        }} />
                        <InputField field={{
                          name: "designation",
                          isValid: true,
                        }} />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        />
      )}
    </ModalComponent>
  )
}
