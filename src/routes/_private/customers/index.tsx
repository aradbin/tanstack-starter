import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, enamValidation, validate } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { TableFilterType } from '@/lib/types'
import { useApp } from '@/providers/app-provider'
import { customerColumns } from './-columns'
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
  const { setCustomerModal, setDeleteModal } = useApp()

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
      value: params.businessType,
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
            setCustomerModal({
              id,
              isOpen: true
            })
          },
          delete: (id) => {
            setDeleteModal({
              id,
              title: "Customer",
              table: "customers"
            })
          }
        }
      })} filters={filters} query={query} options={{
        hasSearch: true
      }} toolbar={(
        <Button size="sm" variant="outline" onClick={() => setCustomerModal({
          id: null,
          isOpen: true
        })}><PlusCircle /> Create</Button>
      )} />
    </>
  )
}
