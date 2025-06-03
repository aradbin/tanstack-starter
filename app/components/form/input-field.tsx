import { FieldType } from "@/lib/types"
import { capitalize } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputField({ field }: { field: FieldType }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={field.name}>
        {field.label || capitalize(field.name)}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        type={field.type || "text"}
        placeholder={field.placeholder || capitalize(field.name)}
      />
    </div>
  )
}
