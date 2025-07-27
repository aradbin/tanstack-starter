import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, enamValidation, validate } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { AnyType, TableFilterType } from '@/lib/types'
import { useApp } from '@/providers/app-provider'
import { customerColumns } from './-columns'
import CustomerForm from './-form'
import { businessTypeOptions, businessTypes } from './-utils'

export const Route = createFileRoute('/_private/customers/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
    businessType: enamValidation('Business Type', businessTypes).catch(undefined)
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()
  const { setDeleteId } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<AnyType>(null)

  const query: QueryParamType = {
    table: "customers",
    relation: {
      customerContacts: {
        with: {
          contact: true
        }
      }
    },
    sort: {
      field: params.sort,
      order: params.order
    },
    pagination: {
      page: params.page,
      pageSize: params.pageSize
    },
    where: {
      businessType: params.businessType
    },
    search: {
      term: params.search,
      key: ["name", "email"]
    }
  }

  const filters: TableFilterType[] = [
    {
      key: 'businessType',
      label: 'Business Type',
      options: businessTypeOptions
    },
  ]

  return (
    <>
      <TableComponent columns={customerColumns({
        actions: {
          view: (id) => {
            navigate({
              to: `/customers/${id}`
            })
          },
          edit: (id) => {
            setIsOpen(true)
            setEditId(id)
          },
          delete: (id) => {
            setDeleteId({
              id,
              title: "Customer",
              table: "customers"
            })
          }
        }
      })} filters={filters} query={query} options={{
        hasSearch: true
      }} toolbar={(
        <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}><PlusCircle /> Create</Button>
      )} />
      <CustomerForm isOpen={isOpen} setIsOpen={setIsOpen} editId={editId} setEditId={setEditId} />
    </>
  )
}
