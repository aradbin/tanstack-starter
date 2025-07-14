import { AnyType, OptionType } from "@/lib/types"

export default function TableRowFromOptions({
  value,
  options
}: {
  value: AnyType
  options: OptionType[]
}) {
  const matched = options.find((item) => item.value === value)
  
  if (!matched) {
    return null
  }

  return (
    <div className="flex gap-2 items-center">
      {matched?.icon && (
        <matched.icon className="h-4 w-4 text-muted-foreground" />
      )}
      {matched?.label}
    </div>
  )
} 