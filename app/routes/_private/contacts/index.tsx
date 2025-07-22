import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'
import { contactColumns } from './-columns'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import ContactForm from './-form'
import { AnyType } from '@/lib/types'
import { useApp } from '@/providers/app-provider'

export const Route = createFileRoute('/_private/contacts/')({
  validateSearch: validate({
    ...defaultSearchParamValidation
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setDeleteId } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<AnyType>(null)

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
    <>
      <TableComponent columns={contactColumns({
        actions: {
          edit: (id) => {
            setIsOpen(true)
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
        <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}><PlusCircle /> Create</Button>
      )} />
      <ContactForm isOpen={isOpen} setIsOpen={setIsOpen} editId={editId} setEditId={setEditId} />
    </>
  )
}
