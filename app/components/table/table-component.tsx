import { ReactNode, useMemo, useState } from 'react'
import { ColumnDef, getCoreRowModel, useReactTable, VisibilityState } from "@tanstack/react-table"
import { TablePagination } from "@/components/table/table-pagination"
import { getDatas, QueryParamType } from "@/lib/db/functions"
import { defaultPageSize } from "@/lib/variables"
import { AnyType, TableFilterType } from "@/lib/types"
import { useQuery } from '@tanstack/react-query'
import TableStructure from '@/components/table/table-structure'
import TableSearch from '@/components/table/table-search'
import { TableFilter } from '@/components/table/table-filter'
import TableReset from '@/components/table/table-reset'
import { TableViewOptions } from '@/components/table/table-view-options'

interface TableComponentProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  query: QueryParamType
  filters?: TableFilterType[]
  queryFn?: AnyType
  options?: {
    hasSearch?: boolean
    hasViewOptions?: boolean
  }
  toolbar?: ReactNode
}

export default function TableComponent<TData, TValue>({
  columns,
  filters,
  query,
  queryFn,
  options,
  toolbar
}: TableComponentProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  
  const { data: tableData, isLoading } = useQuery({
    queryKey: [query.table, {
      ...query?.sort,
      ...query?.pagination,
      ...query?.where,
      ...query?.search
    }],
    queryFn: () => queryFn?.({ data: query }) ?? getDatas({ data: query }),
  })
  
  console.log('tableData',tableData)
  console.count('TableComponent')
  
  const tableOptions: AnyType = useMemo(() => ({
    data: tableData?.result || [],
    rowCount: tableData?.count || tableData?.result?.length || 0,
    columns,
    state: {
      ...(query?.pagination?.hasPagination === false ? {} : {
        pagination: {
          pageIndex: query?.pagination?.page ? query.pagination.page - 1 : 0,
          pageSize: query?.pagination?.pageSize || defaultPageSize,
        }
      }),
      ...query.sort?.field ? { sorting: [{ id: query?.sort?.field, desc: query?.sort?.order === 'desc' }] } : {},
      columnVisibility,
      rowSelection,
    },
    defaultColumn: {
      enableSorting: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false
    },
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  }), [
    query,
    columns,
    tableData,
    rowSelection,
    columnVisibility,
  ])

  const table = useReactTable(tableOptions)

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      {(
        options?.hasSearch ||
        (filters && filters?.length > 0) ||
        Object.entries(query?.where || {})?.some(([_, value]) => value?.length > 0) ||
        toolbar
      ) && (
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            {options?.hasSearch && <TableSearch search={query?.search?.term} />}
            {filters?.map((filter, index) => <TableFilter key={index} filter={filter} selected={query?.where?.[filter.key] || null} /> )}
            <TableReset hasReset={filters && filters?.length > 0 && Object.entries(query?.where || {})?.some(([_, value]) => value?.length > 0) || table.getState().sorting.length > 0 || query?.search?.term} />
          </div>
          <div className="flex items-center gap-2">
            {options?.hasViewOptions && <TableViewOptions table={table} />}
            {toolbar}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <TableStructure table={table} isLoading={isLoading} />
      </div>

      {/* Table Footer */}
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
