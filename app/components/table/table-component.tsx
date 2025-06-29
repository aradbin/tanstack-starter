import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { TablePagination } from "./table-pagination"
import { TableToolbar } from "./table-toolbar"
import { useState } from "react"
import { useGetQuery } from "@/lib/queries"
import { Skeleton } from "@/components/ui/skeleton"
import { getQuery, RelationType, TableType } from "@/lib/db/functions"
import { defaultPageSize } from "@/lib/variables"

interface TableComponentProps<TData, TValue, TTable extends TableType> {
  columns: ColumnDef<TData, TValue>[]
  query: {
    table: TTable
    relations?: RelationType<TTable>
    params?: unknown
  }
}

export default function TableComponent<TData, TValue, TTable extends TableType>({
  columns,
  query,
}: TableComponentProps<TData, TValue, TTable>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: tableData, isLoading } = useGetQuery(query.table, () => getQuery(query), {
    params: query.params,
    initialData: null,
  })

  console.log('table', isLoading, query.params, tableData)

  const table = useReactTable({
    data: tableData || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              Array.from({ length: table.initialState.pagination.pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    colSpan={columns.length}
                    className="h-12"
                  >
                    <Skeleton className="h-6 w-full rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  )
}
