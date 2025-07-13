import { Input } from "@/components/ui/input"
import { AnyType } from "@/lib/types"
import { useNavigate } from "@tanstack/react-router"
import debounce from 'lodash.debounce'
import { Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

export default function TableSearch({ search }: { search: AnyType }) {
  const navigate: AnyType = useNavigate()
  const [term, setTerm] = useState(search)

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
    <div className="relative">
      <Search className="absolute left-2 top-2 size-4 text-muted-foreground" />
      <Input
        placeholder="Search"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value)
          debouncedSearch(e.target.value)
        }}
        className="h-8 w-[150px] lg:w-[250px] pl-8"
      />
      {term && <X className="absolute right-2 top-2 size-4 text-muted-foreground" onClick={() => {
        setTerm("")
        debouncedSearch("")
      }} />}
    </div>
  )
}
