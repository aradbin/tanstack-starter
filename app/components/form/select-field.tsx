import { FormFieldType, OptionType } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import OptionComponent from "../common/option-component"
import AvatarComponent from "../common/avatar-component"

export default function SelectField({
  field,
}: {
  field: FormFieldType
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const renderOption = (option: OptionType) => {
    if(field?.type === 'user') {
      return <AvatarComponent user={option} />
    } else {
      return <OptionComponent option={option} />
    }
  }

  const renderValue = () => {
    if(field?.value){
      const selected = field?.options?.find((item) => item?.id === field?.value)
      if(selected) {
        return renderOption(selected)
      }
    }

    return field?.placeholder || "Select"
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !field.value && "text-muted-foreground",
            !field?.isValid && "border-destructive dark:border-destructive"
          )}
        >
          <div className="flex items-center justify-start">
            {renderValue()}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0" style={{ minWidth: triggerRef?.current?.offsetWidth }}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No option found</CommandEmpty>
            <CommandGroup>
              {field?.options?.map((item) => (
                <CommandItem
                  key={item?.id}
                  value={`${item?.name} ${item?.email}`}
                  onSelect={() => {
                    field?.handleChange?.(item?.id)
                    field.handleBlur?.()
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  {renderOption(item)}
                  <CheckIcon
                    className={cn(
                      "h-4 w-4",
                      field?.value === item?.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {!field?.isRequired && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => field?.handleChange?.("")} className="justify-center text-center">
                    Clear Selection
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
