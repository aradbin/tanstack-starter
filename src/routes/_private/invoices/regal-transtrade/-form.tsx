import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { AnyType, FormFieldType, ModalStateType } from "@/lib/types"
import { stringRequiredValidation } from "@/lib/validations"
import { pdf } from "@react-pdf/renderer"
import InvoiceView from "@/routes/_private/invoices/regal-transtrade/-view"
import { createDepotTripInvoice } from "./-utils"

export default function InvoiceForm({ modal, setModal }: {
  modal: ModalStateType,
  setModal: (state: ModalStateType) => void
}) {
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
      header: 'Generate Invoice',
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
            queryKey: 'invoices',
          }}
        />
      )}
    </ModalComponent>
  )
}
