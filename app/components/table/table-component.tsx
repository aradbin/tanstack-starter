import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
import { AnyType } from "@/lib/types"
import { defaultPageSize } from "@/lib/variables"

interface TableComponentProps<TData, TValue, TTable extends TableType> {
  columns: ColumnDef<TData, TValue>[]
  query: {
    table: TTable
    relations?: RelationType<TTable>
    params?: AnyType
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
    params: query.params
  })

  console.log('table', isLoading, query, tableData, sorting)

  const table = useReactTable({
    data: tableData?.result || [],
    columns,
    rowCount: tableData?.count || tableData?.result?.length || 0,
    state: {
      ...(query?.params?.hasPagination === false ? {} : {
        pagination: {
          pageIndex: query?.params?.page ? query.params.page - 1 : 0,
          pageSize: query?.params?.pageSize || defaultPageSize,
        }
      }),
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
              Array.from({ length: table.getState().pagination.pageSize }).map((_, i) => (
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
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {query?.params?.hasPagination !== false && <TablePagination table={table} />}
      </div>
    </div>
  )
}
