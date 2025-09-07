import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { createFileRoute } from '@tanstack/react-router'
import { designationColumns } from './-columns'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import DesignationForm from './-form'

export const Route = createFileRoute('/_private/designations/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setDeleteModal } = useApp()
  const [designationModal, setDesignationModal] = useState<ModalStateType>(null)

  const query: QueryParamType = {
    table: "designations",
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
      key: ["name"]
    }
  }

  return (
    <>
    <TableComponent columns={designationColumns({
      actions: {
        edit: (id) => {
          setDesignationModal({
            id,
            isOpen: true
          })
        },
        delete: (id) => {
          setDeleteModal({
            id,
            title: "Designation",
            table: "designations"
          })
        }
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => {
        setDesignationModal({
          id: null,
          isOpen: true
        })
      }}><PlusCircle /> Create</Button>
    )} />
    <DesignationForm modal={designationModal} setModal={setDesignationModal} />
    </>
  )
}
