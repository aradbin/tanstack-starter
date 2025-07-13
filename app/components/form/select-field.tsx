import { FormFieldType } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronsDown, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useState } from "react"
import { capitalize, cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export default function SelectField({
  field,
}: {
  field: FormFieldType
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Label
        htmlFor={field?.name}
        className={!field?.isValid ? "text-destructive" : ""}
      >
        {field?.label || capitalize(field?.name)}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {field?.value
              ? field?.options?.find((item) => item?.value === field?.value)?.label
              : "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No option found</CommandEmpty>
              <CommandGroup>
                {field?.options?.map((item?) => (
                  <CommandItem
                    key={item?.value}
                    value={item?.value}
                    onSelect={(currentValue) => {
                      field?.handleChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        field?.value === item?.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex justify-between items-center w-full">
                      {item?.label}
                      {item?.icon && (
                        <item.icon className="text-muted-foreground size-4" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}