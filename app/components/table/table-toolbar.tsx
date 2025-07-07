import { Table } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableViewOptions } from "./table-view-options"

import { TableFilter } from "./table-filter"
import { useNavigate } from "@tanstack/react-router"
import { AnyType, TableFilterType } from "@/lib/types"
import { capitalize } from "@/lib/utils"

interface TableToolbarProps<TData> {
  table: Table<TData>
  filters: TableFilterType[]
  selected: Record<string, AnyType>
}

export function TableToolbar<TData>({
  table,
  filters,
  selected
}: TableToolbarProps<TData>) {
  const navigate: AnyType = useNavigate()
  const isFiltered = Object.entries(selected)?.some(([_, value]) => value?.length > 0)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search"
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters?.map((filter, index) => <TableFilter key={index} filter={filter} selected={selected[filter.key] || null} /> )}
        {/* {table.getState().sorting.length > 0 && (
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {table.getState().sorting[0].desc ? <ArrowDown /> : <ArrowUp />}
            {capitalize(table.getState().sorting[0].id)}
          </Button>
        )} */}
        {(isFiltered || table.getState().sorting.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigate({
                search: (prev: AnyType) => ({
                  ...prev?.page ? { page: prev?.page } : {},
                  ...prev?.pageSize ? { pageSize: prev?.pageSize } : {},
                }),
                replace: true
              })
            }}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <TableViewOptions table={table} />
        <Button size="sm">Add Task</Button>
      </div>
    </div>
  )
}
