import { FormFieldType } from "@/lib/types"
import InputField from "./input-field"
import SelectField from "./select-field"

export default function RenderField({ field }: { field: FormFieldType }) {
  switch (field.type) {
    case "select":
      return <SelectField field={field} />

    default:
      return <InputField field={field} />
  }
}
