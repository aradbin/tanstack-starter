import { FormFieldType } from "@/lib/types"
import { capitalize } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputField({ field }: { field: FormFieldType }) {
  return (
    <>
      <Label
        htmlFor={field?.name}
        className={!field?.isValid ? "text-destructive" : ""}
      >
        {field?.label || capitalize(field?.name)}
      </Label>
      <Input
        id={field?.name}
        name={field?.name}
        value={field?.value}
        onBlur={field?.handleBlur}
        onChange={(e) => field?.handleChange(e.target.value)}
        aria-invalid={!field?.isValid}
        type={field?.type || "text"}
        placeholder={field?.placeholder || ""}
      />
    </>
  )
}
