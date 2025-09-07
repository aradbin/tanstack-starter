import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { createFileRoute } from '@tanstack/react-router'
import { vehicleColumns } from './-columns'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export const Route = createFileRoute('/_private/vehicles/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()
  const { setVehicleModal, setDeleteModal } = useApp()

  const query: QueryParamType = {
    table: "vehicles",
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
      key: ["registrationNumber", "chassisNumber", "engineNumber"]
    }
  }

  return (
    <TableComponent columns={vehicleColumns({
      actions: {
        view: (id) => {
          navigate({
            to: `/vehicles/${id}`
          })
        },
        edit: (id) => {
          setVehicleModal({
            id,
            isOpen: true
          })
        },
        delete: (id) => {
          setDeleteModal({
            id,
            title: "Employee",
            table: "employees"
          })
        }
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => setVehicleModal({
        id: null,
        isOpen: true
      })}><PlusCircle /> Create</Button>
    )} />
  )
}
