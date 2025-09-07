import { Checkbox } from "@/components/ui/checkbox";
import { AnyType } from "@/lib/types";
import { Table } from "@tanstack/react-table";

export default function TableCheckboxHeader({ table }: { table: Table<AnyType> }) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  )
}