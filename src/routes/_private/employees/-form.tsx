import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, getDatas, updateData } from "@/lib/db/functions"
import { FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { useApp } from "@/providers/app-provider"

export default function EmployeeForm() {
  const { employeeModal, setEmployeeModal } = useApp()
  const { data, isLoading } = useQuery({
    queryKey: ['employees', employeeModal?.id],
    queryFn: async () => {
      const response = await getData({ data: {
        table: "employees",
        id: employeeModal?.id
      }})

      return {
        ...response,
        nid: response?.metadata?.nid,
        licenseNumber: response?.metadata?.licenseNumber,
        portId: response?.metadata?.portId
      }
    },
    enabled: !!employeeModal?.id && employeeModal?.isOpen
  })

  const { data: designations } = useQuery({
    queryKey: ['designations', 'all'],
    queryFn: async () => {
      const response = await getDatas({ data: { table: "designations" } })

      if(response?.result) {
        return response?.result
      }

      return []
    },
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
        name: "designationId",
        label: "Designation",
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
        name: "nid",
        label: "NID",
        validationOnSubmit: stringValidation("NID"),
        placeholder: "Enter NID",
      },
    ],
    [
      {
        name: "licenseNumber",
        label: "License Number",
        validationOnSubmit: stringValidation("License Number"),
        placeholder: "Enter license number",
      },
    ],
    [
      {
        name: "portId",
        label: "Port ID",
        validationOnSubmit: stringValidation("Port ID"),
        placeholder: "Enter port ID",
      },
    ],
    [
      {
        name: "joiningDate",
        type: "date",
        label: "Joining Date",
        validationOnSubmit: stringValidation("Joining Date"),
        placeholder: "Enter joining date",
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
          handleSubmit={(values: Record<string, any>) => {
            const payload = {
              ...values,
              joiningDate: values?.joiningDate || null,
              metadata: {
                nid: values?.nid,
                licenseNumber: values?.licenseNumber,
                portId: values?.portId
              }
            }
            if(employeeModal?.id){
              return updateData({ data: { table: "employees", id: employeeModal?.id, values: payload, title: "Employee" } })
            }

            return createData({ data: { table: "employees", values: {
              id: generateId(),
              ...payload,
            }, title: "Employee" } })
          }}
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
