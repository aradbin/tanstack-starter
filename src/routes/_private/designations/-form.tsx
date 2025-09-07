import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { FormFieldType, ModalStateType } from "@/lib/types"
import { stringRequiredValidation } from "@/lib/validations"
import { generateId } from "better-auth"

export default function DesignationForm({ modal, setModal }: {
  modal: ModalStateType,
  setModal: (state: ModalStateType) => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['designations', modal?.id],
    queryFn: async () => getData({ data: {
      table: "designations",
      id: modal?.id
    }}),
    enabled: !!modal?.id && modal?.isOpen
  })

  const formFields: FormFieldType[][] = [
    [
      {
        name: "name",
        validationOnSubmit: stringRequiredValidation("Name"),
        placeholder: "Enter name",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: modal?.id ? 'Edit Designation' : 'Create Designation',
      isOpen: modal?.isOpen,
      onClose: () => {
        setModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => modal?.id ?
            updateData({ data: { table: "designations", id: modal?.id, values, title: "Designation" } }) :
            createData({ data: { table: "designations", values: {
              id: generateId(),
              ...values,
            }, title: "Designation" } })}
          values={modal?.isOpen && modal?.id && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'designations',
          }}
        />
      )}
    </ModalComponent>
  )
}
