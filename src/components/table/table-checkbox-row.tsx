import { Checkbox } from "@/components/ui/checkbox";
import { AnyType } from "@/lib/types";
import { Row } from "@tanstack/react-table";

export default function TableCheckboxRow({ row }: { row: Row<AnyType> }) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  )
}