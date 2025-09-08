import { Check, Filter } from "lucide-react"

import { capitalize, cn, formatDate, formatDateForInput } from "@/lib/utils"
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
import { Calendar } from "../ui/calendar"

export function TableFilter({
  filter
}: {
  filter: TableFilterType
}) {
  const navigate: AnyType = useNavigate()
  
  const onSelect = (value: AnyType) => {
    navigate({
      search: (prev: AnyType) => {
        if(filter?.type === 'date' && filter?.multiple){
          return {
            ...prev,
            ...(prev.page ? { page: 1 } : {}),
            ...value
          }
        }
        if(filter?.multiple){
          const key = filter.key.toLowerCase()
          const current = filter?.value ? Array.isArray(filter?.value) ? filter?.value : [filter?.value] : []
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
          [filter.key]: value
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

  if(filter?.type === 'date'){
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {filter?.icon ? <filter.icon className="size-3" /> : <Filter className="size-3" />}
            {capitalize(filter?.label || filter?.key)}
            {filter?.multiple && filter?.value?.from && filter?.value?.to && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {formatDate(filter?.value?.from)} - {formatDate(filter?.value?.to)}
                </Badge>
              </>
            )}
            {filter?.value?.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {formatDate(filter?.value)}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          {filter?.multiple ? (
            <Calendar
              mode="range"
              selected={filter?.value?.from && filter?.value?.to ? {
                from: new Date(filter?.value?.from),
                to: new Date(filter?.value?.to)
              } : undefined}
              onSelect={(date) => {
                if(date?.from && date?.to){
                  onSelect({
                    from: formatDateForInput(date?.from),
                    to: formatDateForInput(date?.to)
                  })
                }
              }}
              captionLayout="dropdown"
            />
          ) : (
            <Calendar
              mode="single"
              selected={filter?.value ? new Date(filter?.value) : undefined}
              onSelect={(date) => onSelect(formatDateForInput(date))}
              captionLayout="dropdown"
            />
          )}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {filter?.icon ? <filter.icon className="size-3" /> : <Filter className="size-3" />}
          {capitalize(filter?.label || filter?.key)}
          {filter?.value?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filter.multiple ? filter?.value?.length : 1}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {filter.multiple && filter?.value?.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {filter?.value?.length} selected
                  </Badge>
                ) : (
                  filter?.options?.filter((option) => filter?.value?.includes(option.id)).map((option) => (
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
          <CommandInput placeholder={capitalize(filter?.label || filter?.key)} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filter?.options?.map((option) => {
                const isSelected = filter?.value?.includes(option.id)
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
            {filter?.value?.length > 0 && (
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
