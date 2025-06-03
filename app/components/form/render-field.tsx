import { FieldType } from "@/lib/types"

import InputField from "./input-field"

export default function RenderField({ field }: { field: FieldType }) {
  switch (field.type) {
    case "file":
      break

    default:
      return <InputField field={field} />
  }
}
