import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType, ModalStateType } from "@/lib/types"
import { stringRequiredValidation } from "@/lib/validations"
import { createDepotTripInvoice } from "../-utils"
import { pdf } from "@react-pdf/renderer"
import InvoiceView from "@/routes/_private/invoices/regal-transtrade/-view"

export default function InvoiceForm({ modal, setModal }: {
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
        validationOnSubmit: stringRequiredValidation("From"),
        placeholder: "Enter From",
      },
      {
        name: "to",
        label: "To",
        type: "date",
        validationOnSubmit: stringRequiredValidation("To"),
        placeholder: "Enter To",
      },
    ],
    [
      {
        name: "date",
        label: "Invoice Date",
        type: "date",
        validationOnSubmit: stringRequiredValidation("Invoice Date"),
        placeholder: "Enter Invoice Date",
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
          handleSubmit={(values: {
            from: string,
            to: string,
            date: string,
            dueDate: string,
          }) => createDepotTripInvoice({ data: { values }})}
          values={modal?.isOpen && modal?.id && data ? data : {}}
          onSuccess={async (response: AnyType) => {
            props.close()
            const blob = await pdf(<InvoiceView modal={{
              id: response.id,
              isOpen: true,
              item: response
            }} />).toBlob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
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
