import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { AnyType, FormFieldType, ModalStateType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { pdf } from "@react-pdf/renderer"
import InvoiceView from "@/routes/_private/invoices/regal-transtrade/-view"
import { createDepotTripInvoice, createInvoicePayment } from "./-utils"
import { paymentMethods } from "@/lib/variables"
import { createData } from "@/lib/db/functions"
import { generateId } from "better-auth"

export default function InvoicePaymentForm({ modal, setModal }: {
  modal: ModalStateType,
  setModal: (state: ModalStateType) => void
}) {
  const formFields: FormFieldType[][] = [
    [
      {
        name: "date",
        label: "Payment Date",
        type: "date",
        validationOnSubmit: stringRequiredValidation("Payment Date"),
        placeholder: "Enter Payment Date",
      },
    ],
    [
      {
        name: "amount",
        label: "Amount",
        type: "number",
        validationOnSubmit: stringRequiredValidation("Amount"),
        placeholder: "Enter Amount",
      },
    ],
    [
      {
        name: "method",
        label: "Payment Method",
        type: "select",
        options: paymentMethods,
        validationOnSubmit: stringRequiredValidation("Payment Method"),
        placeholder: "Enter Payment Method",
      },
    ],
    [
      {
        name: "reference",
        label: "Reference",
        validationOnSubmit: stringValidation("Reference"),
        placeholder: "Enter Reference",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: 'Create Invoice Payment',
      isOpen: modal?.isOpen,
      onClose: () => {
        setModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values) => createInvoicePayment({ data: {
            id: generateId(),
            invoiceId: modal?.id,
            paid: values.amount + modal?.item?.paid || 0,
            ...values,
          }})}
          onSuccess={() => {
            props.close()
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
