import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { useQuery } from "@tanstack/react-query"
import { createData, getData, updateData } from "@/lib/db/functions"
import { FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { generateId } from "better-auth"
import { useApp } from "@/providers/app-provider"

export default function AssetForm() {
  const { assetModal, setAssetModal } = useApp()
  const { data, isLoading } = useQuery({
    queryKey: ['assets', assetModal?.id],
    queryFn: async () => {
      const response = await getData({ data: {
        table: "assets",
        id: assetModal?.id
      }})

      return {
        ...response,
        registrationNumber: response?.metadata?.registrationNumber,
        registrationDate: response?.metadata?.registrationDate,
        fitnessExpiryDate: response?.metadata?.fitnessExpiryDate,
        taxTokenExpiryDate: response?.metadata?.taxTokenExpiryDate,
        roadPermitExpiryDate: response?.metadata?.roadPermitExpiryDate
      }
    },
    enabled: !!assetModal?.id && assetModal?.isOpen
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
        name: "fitnessExpiryDate",
        label: "Fitness Expiry Date",
        type: "date",
        validationOnSubmit: stringValidation("Fitness Expiry Date"),
        placeholder: "Enter fitness expiry date",
      },
    ],
    [
      {
        name: "taxTokenExpiryDate",
        label: "Tax Token Expiry Date",
        type: "date",
        validationOnSubmit: stringValidation("Tax Token Expiry Date"),
        placeholder: "Enter tax token expiry date",
      },
    ],
    [
      {
        name: "roadPermitExpiryDate",
        label: "Road Permit Expiry Date",
        type: "date",
        validationOnSubmit: stringValidation("Road Permit Expiry Date"),
        placeholder: "Enter road permit expiry date",
      },
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: assetModal?.id ? 'Edit Vehicle' : 'Create Vehicle',
      isOpen: assetModal?.isOpen,
      onClose: () => {
        setAssetModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => {
            const payload = {
              type: "vehicle",
              metadata: {
                registrationNumber: values.registrationNumber,
                registrationDate: values.registrationDate,
                fitnessExpiryDate: values.fitnessExpiryDate,
                taxTokenExpiryDate: values.taxTokenExpiryDate,
                roadPermitExpiryDate: values.roadPermitExpiryDate
              }
            }
            if(assetModal?.id){
              return updateData({ data: { table: "assets", id: assetModal?.id, values: payload, title: "Vehicle" } })
            }
            
            return createData({ data: { table: "assets", values: {
              id: generateId(),
              ...payload,
            }, title: "Vehicle" } })
          }}
          values={assetModal?.isOpen && assetModal?.id && data ? data : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'assets',
          }}
        />
      )}
    </ModalComponent>
  )
}
