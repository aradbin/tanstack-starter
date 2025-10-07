import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { FormFieldType, ModalStateType } from "@/lib/types"
import { stringRequiredValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { createTripInvoice } from "../-utils"

export default function InvoiceCreateForm({ modal, setModal }: {
  modal: ModalStateType,
  setModal: (state: ModalStateType) => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['invoices', modal?.id],
    queryFn: async () => getData({ data: {
      table: "invoices",
      id: modal?.id
    }}),
    enabled: !!modal?.id && modal?.isOpen
  })

  const formFields: FormFieldType[][] = [
    [
      {
        name: "from",
        label: "From",
        type: "date",
        validationOnSubmit: stringRequiredValidation("From Date"),
        placeholder: "Enter From Date",
      },
    ],
    [
      {
        name: "to",
        label: "To",
        type: "date",
        validationOnSubmit: stringRequiredValidation("To Date"),
        placeholder: "Enter To Date",
      },
    ],
    [
      {
        name: "dueDate",
        label: "Due Date",
        type: "date",
        validationOnSubmit: stringRequiredValidation("Due Date"),
        placeholder: "Enter Due Date",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: modal?.id ? 'Edit Invoice' : 'Generate Invoice',
      isOpen: modal?.isOpen,
      onClose: () => {
        setModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => modal?.id ?
            updateData({ data: { table: "invoices", id: modal?.id, values, title: "Invoice" } }) :
            createTripInvoice({ data: { values: {
              type: "depot",
              ...values,
            }}})}
          values={modal?.isOpen && modal?.id && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'invoices',
          }}
        />
      )}
    </ModalComponent>
  )
}
