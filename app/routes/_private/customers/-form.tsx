import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { emailRequiredValidation, stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { businessTypeOptions } from "./-utils"

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
        />
      )}
    </ModalComponent>
  )
}
