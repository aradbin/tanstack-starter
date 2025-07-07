import { AnyType, TableFilterType } from "@/lib/types";
import { useSearch } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useState } from "react";
import { Input } from "@/components/ui/input";

const TableProviderContext = createContext<{
  from: AnyType
  params: AnyType
  setParams: (params: AnyType) => void
}>({
  from: "",
  params: {},
  setParams: () => {}
})

export function TableProvider({
  children,
  from,
  filters
}: {
  children: ReactNode
  from: AnyType
  filters?: TableFilterType[]
}) {
  const search = useSearch({
    from
  })

  const [params, setParams] = useState(search)

  return (
    <TableProviderContext.Provider value={{
      from,
      params,
      setParams
    }}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search"
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </div>
      </div>
    </TableProviderContext.Provider>
  )
}

export const useTable = () => {
  const context = useContext(TableProviderContext)

  if (context === undefined)
    throw new Error("useTable must be used within a TableProvider")

  return context
}