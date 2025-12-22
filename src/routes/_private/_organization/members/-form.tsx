import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { getData,updateData } from "@/lib/db/functions"
import { FormFieldType, ModalStateType } from "@/lib/types"
import { stringRequiredValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { createMember } from "./-utils"

const roleOptions = [
  {
    id: 'admin',
    name: 'Admin'
  },
  {
    id: 'member',
    name: 'Member'
  }
]

export default function MemberForm({ modal, setModal }: {
  modal: ModalStateType,
  setModal: (state: ModalStateType) => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['members', modal?.id],
    queryFn: async () => getData({ data: {
      table: "members",
      relation: {
        user: true
      },
      id: modal?.id
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
        name: "email",
        label: "Email",
        type: "email",
        validationOnSubmit: stringRequiredValidation("Email"),
        placeholder: "Enter email",
      },
    ],
    [
      {
        name: "role",
        label: "Role",
        type: "select",
        options: roleOptions,
        validationOnSubmit: stringRequiredValidation("Role"),
        placeholder: "Select role",
        defaultValue: "member",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: modal?.id ? 'Edit Member' : 'Add Member',
      isOpen: modal?.isOpen,
      onClose: () => {
        setModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => modal?.id ?
            updateData({ data: { table: "members", id: modal?.id, values, title: "Member" } }) :
            createMember({ data: {
              values: {
                id: generateId(),
                ...values,
              }
            }}
          )}
          values={modal?.isOpen && modal?.id && data ? {
            name: data?.user?.name,
            email: data?.user?.email,
            role: data?.role,
          } : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'members',
          }}
        />
      )}
    </ModalComponent>
  )
}
