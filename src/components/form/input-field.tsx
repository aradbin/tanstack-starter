import { FormFieldType } from "@/lib/types"
import { Input } from "@/components/ui/input"

export default function InputField({ field }: { field: FormFieldType }) {
  return (
    <Input
      id={field?.name}
      name={field?.name}
      value={field?.value}
      onBlur={field?.handleBlur}
      onChange={(e) => field?.handleChange(e.target.value)}
      aria-invalid={!field?.isValid}
      type={field?.type || "text"}
      placeholder={field?.placeholder || ""}
      disabled={field?.disabled || false}
      readOnly={field?.readonly || false}
    />
  )
}
