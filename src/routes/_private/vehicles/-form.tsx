import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { useApp } from "@/providers/app-provider"

export default function VehicleForm() {
  const { vehicleModal, setVehicleModal } = useApp()
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', vehicleModal?.id],
    queryFn: async () => getData({ data: {
      table: "vehicles",
      id: vehicleModal?.id
    }}),
    enabled: !!vehicleModal?.id && vehicleModal?.isOpen
  })

  const formFields: FormFieldType[][] = [
    [
      {
        name: "registrationNumber",
        label: "Registration Number",
        validationOnSubmit: stringRequiredValidation("Registration Number"),
        placeholder: "Enter registration number",
      },
    ],
    [
      {
        name: "registrationDate",
        label: "Registration Date",
        type: "date",
        validationOnSubmit: stringRequiredValidation("Registration Date"),
        placeholder: "Enter registration date",
      },
    ],
    [
      {
        name: "chassisNumber",
        label: "Chassis Number",
        validationOnSubmit: stringValidation("Chassis Number"),
        placeholder: "Enter chassis number",
      },
    ],
    [
      {
        name: "engineNumber",
        label: "Engine Number",
        validationOnSubmit: stringValidation("Engine Number"),
        placeholder: "Enter engine number",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: vehicleModal?.id ? 'Edit Vehicle' : 'Create Vehicle',
      isOpen: vehicleModal?.isOpen,
      onClose: () => {
        setVehicleModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => vehicleModal?.id ?
            updateData({ data: { table: "vehicles", id: vehicleModal?.id, values, title: "Vehicle" } }) :
            createData({ data: { table: "vehicles", values: {
              id: generateId(),
              ...values,
            }, title: "Vehicle" } })}
          values={vehicleModal?.isOpen && vehicleModal?.id && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'vehicles',
          }}
        />
      )}
    </ModalComponent>
  )
}
