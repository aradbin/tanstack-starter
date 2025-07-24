import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { FormFieldType } from "@/lib/types"
import { emailRequiredValidation, stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { useApp } from "@/providers/app-provider"

export default function ContactForm() {
  const { isContactOpen, setIsContactOpen, editId, setEditId } = useApp()
  const { data, isLoading } = useQuery({
    queryKey: ['contact', editId],
    queryFn: async () => getData({ data: {
      table: "contacts",
      id: editId
    }}),
    enabled: !!editId && isContactOpen
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
    <ModalComponent variant="sheet" options={{
      header: editId ? 'Edit Contact' : 'Create Contact',
      isOpen: isContactOpen,
      onClose: () => {
        setIsContactOpen(false)
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
          values={isContactOpen && editId && data ? data : {}}
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
