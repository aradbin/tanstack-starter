import { FormFieldType } from "@/lib/types"
import InputField from "./input-field"

export default function RenderField({ field }: { field: FormFieldType }) {
  switch (field.type) {
    case "file":
      break

    default:
      return <InputField field={field} />
  }
}
