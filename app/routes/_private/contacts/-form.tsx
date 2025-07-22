import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useApp } from "@/providers/app-provider"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { emailRequiredValidation, stringRequiredValidation, stringValidation } from "@/lib/validations"
import { formatDateForInput } from "@/lib/utils"
import { generateId } from "better-auth"

export default function ContactForm({
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
    queryKey: ['contact', editId],
    queryFn: async () => getData({ data: {
      table: "contacts",
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
    <ModalComponent options={{
      header: editId ? 'Edit Contact' : 'Create Contact',
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
            updateData({ data: { table: "contacts", id: editId, values, title: "Contact" } }) :
            createData({ data: { table: "contacts", values: {
              id: generateId(),
              ...values,
            }, title: "Contact" } })}
          values={isOpen && editId && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'contacts'
          }}
        />
      )}
    </ModalComponent>
  )
}
