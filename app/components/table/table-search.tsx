import { Input } from "@/components/ui/input";

export default function TableSearch() {
  return (
    <Input
      placeholder="Search"
      value={""}
      onChange={(e) =>
        console.log(e.target.value)
      }
      className="h-8 w-[150px] lg:w-[250px]"
    />
  )
}