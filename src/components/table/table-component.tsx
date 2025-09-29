import { ReactNode, useMemo, useState } from 'react'
import { ColumnDef, getCoreRowModel, getPaginationRowModel, PaginationState, useReactTable, VisibilityState } from "@tanstack/react-table"
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
import { Badge } from '../ui/badge'

interface TableComponentProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  filters?: TableFilterType[]
  query: QueryParamType
  queryFn?: AnyType
  options?: {
    hasSearch?: boolean
    hasViewOptions?: boolean
  }
  toolbar?: ReactNode
  children?: {
    childrenBefore?: (tableData: AnyType, isLoading: boolean) => ReactNode | ReactNode,
    childrenAfter?: (tableData: AnyType, isLoading: boolean) => ReactNode | ReactNode
  }
}

export default function TableComponent<TData, TValue>({
  columns,
  filters,
  query,
  queryFn,
  options,
  toolbar,
  children
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
      ...(query?.pagination?.hasPagination === false || query?.pagination?.hasManualPagination === false ? {} : {
        pagination: {
          pageIndex: query?.pagination?.page ? query.pagination.page - 1 : 0,
          pageSize: query?.pagination?.pageSize || defaultPageSize,
        }
      }),
      ...query.sort?.field ? { sorting: [{ id: query?.sort?.field, desc: query?.sort?.order === 'desc' }] } : {},
      columnVisibility,
      rowSelection,
    },
    initialState: {
      ...(query?.pagination?.hasManualPagination === false ? {
        pagination: {
          pageIndex: 0,
          pageSize: defaultPageSize,
        }
      } : {}),
    },
    defaultColumn: {
      enableSorting: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false
    },
    manualSorting: true,
    manualPagination: query?.pagination?.hasManualPagination === false ? false : true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    // onPaginationChange: query?.pagination?.hasManualPagination === false ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        toolbar
      ) && (
        <div className="flex items-baseline justify-between">
          <div className="flex flex-1 items-center flex-wrap gap-2">
            {options?.hasSearch && <TableSearch search={query?.search?.term} />}
            {filters?.map((filter, index) => <TableFilter key={index} filter={filter} /> )}
            <TableReset hasReset={filters?.some(f => !!f.value) || table.getState().sorting.length > 0 || query?.search?.term} />
          </div>
          <div className="flex items-center gap-2">
            {options?.hasViewOptions && <TableViewOptions table={table} />}
            {toolbar}
          </div>
        </div>
      )}

      {typeof children?.childrenBefore === 'function' ? children.childrenBefore(tableData, isLoading) : children?.childrenBefore}

      {/* Table */}
      <div className="rounded-md border">
        <TableStructure table={table} isLoading={isLoading} />
      </div>

      {typeof children?.childrenAfter === 'function' ? children.childrenAfter(tableData, isLoading) : children?.childrenAfter}

      {/* Table Footer */}
      <div className="flex flex-col lg:flex-row lg:justify-between flex-wrap gap-4">
        <div className="flex gap-8 lg:gap-2 items-center justify-between lg:justify-start">
          <Badge variant="outline" className='text-sm'>Total: {table.getRowCount()}</Badge>
          {table.getSelectedRowModel().rows.length > 0 && (
            <Badge variant="outline" className='text-sm'>
              {table.getSelectedRowModel().rows.length} of{" "}
              {table.getRowModel().rows.length} row(s) selected.
            </Badge>
          )}
          {query?.pagination?.hasPagination !== false && (
            <Badge variant="outline" className='text-sm'>
              Page {table.getState().pagination.pageIndex + 1} of{" "} {table.getPageCount()}
            </Badge>
          )}
        </div>  
        {query?.pagination?.hasPagination !== false && <TablePagination table={table} hasManualPagination={query?.pagination?.hasManualPagination === false ? false : true} />}
      </div>
    </div>
  )
}
