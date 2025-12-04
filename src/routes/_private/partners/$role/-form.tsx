import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType, ModalStateType } from "@/lib/types"
import { emailValidation, stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { Route } from "./index"
import { capitalize } from "@/lib/utils"
import { partnerTypes } from "@/lib/variables"

export default function PartnerForm({ modal, setModal }: {
  modal: ModalStateType,
  setModal: (state: ModalStateType) => void
}) {
  const { role } = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['partners', modal?.id],
    queryFn: async () => getData({ data: {
      table: "partners",
      id: modal?.id,
    }}),
    enabled: !!modal?.id && modal?.isOpen
  })

  const formFields: FormFieldType[][] = [
    [
      {
        name: "name",
        label: "Name",
        validationOnSubmit: stringRequiredValidation("Name"),
        placeholder: "Enter name",
      },
    ],
    [
      {
        name: "type",
        label: "Type",
        type: "select",
        options: partnerTypes,
        validationOnSubmit: stringRequiredValidation("Type"),
        placeholder: "Select type",
      },
    ],
    [
      {
        name: "phone",
        label: "Phone",
        validationOnSubmit: stringRequiredValidation("Phone"),
        placeholder: "Enter phone number",
      },
    ],
    [
      {
        name: "email",
        label: "Email",
        type: "email",
        validationOnSubmit: emailValidation("Email"),
        placeholder: "Enter email address",
      },
    ],
    [
      {
        name: "address",
        label: "Address",
        type: "textarea",
        validationOnSubmit: stringValidation("Address"),
        placeholder: "Enter address",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: modal?.id ? `Edit ${capitalize(role)}` : `Create ${capitalize(role)}`,
      isOpen: modal?.isOpen,
      onClose: () => {
        setModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={async (values: AnyType) => {
            if (modal?.id) {
              return updateData({
                data: {
                  table: "partners",
                  id: data?.id,
                  values,
                  title: capitalize(role)
                }
              })
            } else {
              return createData({
                data: {
                  table: "partners",
                  values: {
                    ...values,
                    id: generateId()
                  },
                  title: capitalize(role)
                }
              })
            }
          }}
          values={modal?.isOpen && modal?.id && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'partners',
          }}
        />
      )}
    </ModalComponent>
  )
}
