import { Input } from "@/components/ui/input"
import { AnyType } from "@/lib/types"
import { useNavigate } from "@tanstack/react-router"
import debounce from 'lodash.debounce'
import { useEffect, useMemo } from "react"

export default function TableSearch({ search }: { search: AnyType }) {
  const navigate: AnyType = useNavigate()

  const debouncedSearch = useMemo(() => 
    debounce((value: string) => {
      navigate({ search: (prev: AnyType) => {
        const { search, ...rest } = prev

        return {
          ...rest,
          ...(rest.page ? { page: 1 } : {}),
          ...(value ? { search: value } : {})
        }
      } })
    }, 500)
  , [navigate])

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])

  return (
    <Input
      placeholder="Search"
      defaultValue={search}
      onChange={(e) => debouncedSearch(e.target.value)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  )
}
