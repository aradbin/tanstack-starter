import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { useApp } from "@/providers/app-provider"
import { designations } from "@/lib/variables"

export default function EmployeeForm() {
  const { employeeModal, setEmployeeModal } = useApp()
  const { data, isLoading } = useQuery({
    queryKey: ['employees', employeeModal?.id],
    queryFn: async () => getData({ data: {
      table: "employees",
      id: employeeModal?.id
    }}),
    enabled: !!employeeModal?.id && employeeModal?.isOpen
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
        name: "designation",
        type: "select",
        options: designations,
        validationOnSubmit: stringRequiredValidation("Designation"),
        placeholder: "Enter designation",
      },
    ],
    [
      {
        name: "phone",
        validationOnSubmit: stringRequiredValidation("Phone Number"),
        placeholder: "Enter phone number",
      },
    ],
    [
      {
        name: "dob",
        type: "date",
        label: "Date of Birth",
        validationOnSubmit: stringValidation("Date of Birth"),
        placeholder: "Enter Date of Birth",
      },
    ],
    [
      {
        name: "nid",
        label: "NID",
        validationOnSubmit: stringValidation("NID"),
        placeholder: "Enter NID",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: employeeModal?.id ? 'Edit Employee' : 'Create Employee',
      isOpen: employeeModal?.isOpen,
      onClose: () => {
        setEmployeeModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => employeeModal?.id ?
            updateData({ data: { table: "employees", id: employeeModal?.id, values, title: "Employee" } }) :
            createData({ data: { table: "employees", values: {
              id: generateId(),
              ...values,
            }, title: "Employee" } })}
          values={employeeModal?.isOpen && employeeModal?.id && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'employees',
          }}
        />
      )}
    </ModalComponent>
  )
}
