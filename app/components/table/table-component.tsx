import { useMemo, useState } from 'react'
import { ColumnDef, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getSortedRowModel, useReactTable, VisibilityState,
} from "@tanstack/react-table"
import { TablePagination } from "@/components/table/table-pagination"
import { TableToolbar } from "@/components/table/table-toolbar"
import { getData, QueryParamType, TableType } from "@/lib/db/functions"
import { defaultPageSize } from "@/lib/variables"
import { AnyType, TableFilterType } from "@/lib/types"
import { useQuery } from '@tanstack/react-query'
import TableStructure from '@/components/table/table-structure'

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
  const [params, setParams] = useState(query)
  
  const { data: tableData, isLoading } = useQuery({
    queryKey: [query.table, {
      ...query?.sort,
      ...query?.pagination,
      ...query?.where,
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
        ...query.sort?.field ? [{ id: query?.sort?.field, desc: query?.sort?.order === 'desc' }] : []
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
    query?.sort?.field,
    query?.sort?.order,
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
        <TableStructure table={table} isLoading={isLoading} />
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