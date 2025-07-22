import { Check, PlusCircle } from "lucide-react"

import { capitalize, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { AnyType, TableFilterType } from "@/lib/types"
import { useNavigate } from "@tanstack/react-router"
import OptionComponent from "../common/option-component"
import AvatarComponent from "../common/avatar-component"

export function TableFilter({
  filter,
  selected
}: {
  filter: TableFilterType
  selected: AnyType
}) {
  const navigate: AnyType = useNavigate()
  const { key, label, options } = filter

  const onSelect = (value: AnyType) => {
    navigate({
      search: (prev: AnyType) => {
        if(filter?.multiple){
          const key = filter.key.toLowerCase()
          const current = selected ? Array.isArray(selected) ? selected : [selected] : []
          const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
          const { [key]: _, ...rest } = prev
          return {
            ...rest,
            ...(rest.page ? { page: 1 } : {}),
            ...(updated.length > 0) ? { [key]: updated } : {},
          }
        }

        return {
          ...prev,
          ...(prev.page ? { page: 1 } : {}),
          [key]: value
        }
      },
      replace: true
    })
  }

  const onClear = () => {
    navigate({
      search: (prev: AnyType) => {
        const filterKey = filter.key.toLowerCase()
        const { [filterKey]: _, ...rest } = prev
        return {
          ...rest,
          ...(rest.page ? { page: 1 } : {}),
        }
      },
      replace: true
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {capitalize(label || key)}
          {selected?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filter.multiple ? selected?.length : 1}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {filter.multiple && selected?.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selected?.length} selected
                  </Badge>
                ) : (
                  options?.filter((option) => selected?.includes(option.id)).map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.id}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.name}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={capitalize(label || key)} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selected?.includes(option.id)
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => onSelect(option.id)}
                    className="flex items-center justify-between"
                  >
                    {filter?.type === 'avatar' ? (
                      <AvatarComponent user={option} />
                    ) : (
                      <OptionComponent option={option} />
                    )}
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected?.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onClear()}
                    className="justify-center text-center"
                  >
                    Clear filters
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
