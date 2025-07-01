import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableViewOptions } from "./table-view-options"

import { priorities, statuses } from "./data"
import { TableFilter } from "./table-filter"
import { TableFilterProps } from "@/lib/db/functions"

interface TableToolbarProps<TData> {
  table: Table<TData>
  filters: TableFilterProps[]
}

export function TableToolbar<TData>({
  table,
  filters
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

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
        {filters?.map((filter, index) => <TableFilter key={index} filter={filter} /> )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
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
