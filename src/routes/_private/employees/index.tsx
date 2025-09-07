import TableComponent from '@/components/table/table-component'
import { createFileRoute } from '@tanstack/react-router'
import { employeeColumns } from './-columns'
import { getDatas, QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, enamValidation, stringValidation, validate } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useApp } from '@/providers/app-provider'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_private/employees/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
    designation: stringValidation('Designation').catch(undefined),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()
  const { setEmployeeModal, setDeleteModal } = useApp()

  const { data: designations } = useQuery({
    queryKey: ['designations', 'all'],
    queryFn: async () => {
      const response = await getDatas({ data: { table: "designations" } })
      return response?.result || []
    },
  })

  const query: QueryParamType = {
    table: "employees",
    relation: {
      designation: true
    },
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
      key: ["name", "nid", "phone"]
    },
    where: {
      designationId: params.designation
    }
  }

  return (
    <TableComponent columns={employeeColumns({
      actions: {
        view: (id) => {
          navigate({
            to: `/employees/${id}`
          })
        },
        edit: (id) => {
          setEmployeeModal({
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
    })} filters={[
      {
        key: "designation",
        value: params.designation,
        label: "Designation",
        options: designations,
      }
    ]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => setEmployeeModal({
        id: null,
        isOpen: true
      })}><PlusCircle /> Create</Button>
    )} />
  )
}
