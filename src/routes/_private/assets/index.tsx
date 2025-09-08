import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { createFileRoute } from '@tanstack/react-router'
import { assetColumns } from './-columns'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export const Route = createFileRoute('/_private/assets/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const navigate = Route.useNavigate()
  const { setAssetModal, setDeleteModal } = useApp()

  const query: QueryParamType = {
    table: "assets",
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
      key: ["registrationNumber"]
    }
  }

  return (
    <TableComponent columns={assetColumns({
      actions: {
        // view: (id) => {
        //   navigate({
        //     to: `/assets/${id}`
        //   })
        // },
        edit: (id) => {
          setAssetModal({
            id,
            isOpen: true
          })
        },
        delete: (id) => {
          setDeleteModal({
            id,
            title: "Vehicle",
            table: "assets"
          })
        }
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => setAssetModal({
        id: null,
        isOpen: true
      })}><PlusCircle /> Create</Button>
    )} />
  )
}
