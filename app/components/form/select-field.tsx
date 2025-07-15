import { FormFieldType, OptionType } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useRef, useState } from "react"
import { cn, getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function SelectField({
  field,
}: {
  field: FormFieldType
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const avatarOption = (item: OptionType | undefined) => {
    if(!item) return null
    
    return (
      <div className="flex items-center gap-2">
        <Avatar className="rounded-sm">
          <AvatarImage src={item?.image || ""} alt={item?.label} />
          <AvatarFallback className="bg-transparent rounded-sm">
            {getInitials(item?.label)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start overflow-hidden">
          <p className="text-sm font-medium truncate">{item?.label}</p>
          {item?.description && (
            <p className="text-xs text-muted-foreground font-semibold truncate">
              {item?.description}
            </p>
          )}
        </div>
      </div>
    )
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
            field?.type === 'select' ? "h-9" : "h-13",
            !field.value && "text-muted-foreground",
            !field?.isValid && "border-destructive dark:border-destructive"
          )}
        >
          {field?.value
            ? field?.type === 'select'
              ? field?.options?.find((item) => item?.value === field?.value)?.label
              : avatarOption(field?.options?.find((item) => item?.value === field?.value))
            : "Select"}
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
                  key={item?.value}
                  value={`${item?.label} ${item?.value} ${item?.description || ""}`}
                  onSelect={() => {
                    field?.handleChange(item?.value)
                    field.handleBlur?.()
                    setOpen(false)
                  }}
                  className="flex items-center justify-between"
                >
                  {field?.type === 'select' ? (
                    <div className="flex gap-3 items-center w-full">
                      {item?.icon && (
                        <item.icon className="text-muted-foreground size-4" />
                      )}
                      {item?.label}
                    </div>
                  ) : (
                    avatarOption(item)
                  )}
                  <CheckIcon
                    className={cn(
                      "h-4 w-4",
                      field?.value === item?.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}