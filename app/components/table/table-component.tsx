import { useMemo, useState } from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getSortedRowModel, useReactTable, VisibilityState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TablePagination } from "./table-pagination"
import { TableToolbar } from "./table-toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { getData, QueryParamType, TableType } from "@/lib/db/functions"
import { defaultPageSize } from "@/lib/variables"
import { AnyType, TableFilterType } from "@/lib/types"
import { useQuery } from '@tanstack/react-query'

interface TableComponentProps<TData, TValue, TTable extends TableType> {
  columns: ColumnDef<TData, TValue>[]
  filters: TableFilterType[]
  query: QueryParamType<TTable>
}

export default function TableComponent<TData, TValue, TTable extends TableType>({
  columns,
  filters,
  query,
}: TableComponentProps<TData, TValue, TTable>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  
  const { data: tableData, isLoading } = useQuery({
    queryKey: [query.table, {
      ...query.sort ? { sort: query.sort } : {},
      ...query.order ? { order: query.order } : {},
      ...query.pagination,
      ...query.where,
    }],
    queryFn: () => getData(query),
  })

  const tableOptions: AnyType = useMemo(() => ({
    data: tableData?.result || [],
    columns,
    rowCount: tableData?.count || tableData?.result?.length || 0,
    state: {
      ...(query?.pagination?.hasPagination === false ? {} : {
        pagination: {
          pageIndex: query?.pagination?.page ? query.pagination.page - 1 : 0,
          pageSize: query?.pagination?.pageSize || defaultPageSize,
        }
      }),
      sorting: [
        ...query.sort ? [{ id: query.sort, desc: query.order === 'desc' }] : []
      ],
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  }), [
    tableData?.result,
    tableData?.count,
    columns,
    query?.sort,
    query?.order,
    query?.pagination?.hasPagination,
    query?.pagination?.page,
    query?.pagination?.pageSize,
    columnVisibility,
    rowSelection,
  ])

  const table = useReactTable(tableOptions)

  console.count('TableComponent')

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar table={table} filters={filters || []} selected={query.where || {}} />
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
                  {Array.from({ length: table.getVisibleFlatColumns().length }).map((_, j) => (
                    <TableCell className="h-12" key={j}>
                      <Skeleton className="h-6 w-full rounded-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleFlatColumns().length}
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
          {table.getSelectedRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length} row(s) selected.
        </div>
        {query?.pagination?.hasPagination !== false && <TablePagination table={table} />}
      </div>
    </div>
  )
}