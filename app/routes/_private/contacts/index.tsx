import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'
import { contactColumns } from './-columns'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useApp } from '@/providers/app-provider'

export const Route = createFileRoute('/_private/contacts/')({
  validateSearch: validate({
    ...defaultSearchParamValidation
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setIsContactOpen, setEditId, setDeleteId } = useApp()

  const query: QueryParamType = {
    table: "contacts",
    sort: {
      field: params.sort,
      order: params.order
    },
    pagination: {
      page: params.page,
      pageSize: params.pageSize
    },
    search: {
      term: params.search,
      key: ["name", "email"]
    }
  }

  return (
    <TableComponent columns={contactColumns({
      actions: {
        edit: (id) => {
          setIsContactOpen(true)
          setEditId(id)
        },
        delete: (id) => {
          setDeleteId({
            id,
            title: "Contact",
            table: "contacts"
          })
        }
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => setIsContactOpen(true)}><PlusCircle /> Create</Button>
    )} />
  )
}
