import { FormFieldType } from "@/lib/types"
import InputField from "./input-field"
import SelectField from "./select-field"
import DateField from "./date-field"

export default function RenderField({ field }: { field: FormFieldType }) {
  switch (field.type) {
    case "select":
    case "user":
      return <SelectField field={field} />
    case "date":
      return <DateField field={field} />

    default:
      return <InputField field={field} />
  }
}
