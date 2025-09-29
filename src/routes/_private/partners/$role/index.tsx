import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { partnerColumns } from './-columns'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export const Route = createFileRoute('/_private/partners/$role/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { role } = Route.useParams()
  const params = Route.useSearch()

  const query: QueryParamType = {
    table: "partnerRoles",
    relation: {
      partner: true
        // with: {
        //   partnerEntities: {
        //     with: {
        //       partner: true
        //     }
        //   }
        // }
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
      role: role,
      // businessType: params.businessType
    },
    search: {
      term: params.search,
      key: ["name", "email"]
    }
  }

  return (
    <TableComponent columns={partnerColumns({
      actions: {
        // view: (id) => {
        //   navigate({
        //     to: `/customers/${id}`
        //   })
        // },
        // edit: (id) => {
        //   setCustomerModal({
        //     id,
        //     isOpen: true
        //   })
        // },
        // delete: (id) => {
        //   setDeleteModal({
        //     id,
        //     title: "Customer",
        //     table: "customers"
        //   })
        // }
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => {}}><PlusCircle  /> Create</Button>
    )} />
  )
}
