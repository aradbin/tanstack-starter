import { Input } from "@/components/ui/input";
import { AnyType } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";

export default function TableSearch({
  search
}: {
  search: AnyType
}) {
  const navigate: AnyType = useNavigate()
  return (
    <Input
      placeholder="Search"
      value={search}
      onChange={(e) =>
        navigate({
          search: (prev: AnyType) => ({
            ...prev,
            ...(prev.page ? { page: 1 } : {}),
            search: e.target.value
          }),
          replace: true
        })
      }
      className="h-8 w-[150px] lg:w-[250px]"
    />
  )
}