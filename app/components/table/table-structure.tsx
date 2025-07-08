import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, Table as TableType } from "@tanstack/react-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function TableStructure({ table, isLoading }: { table: TableType<unknown>, isLoading: boolean }) {
  return (
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
  )
}