import TableComponent from '@/components/table/table-component'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, stringValidation, validate } from '@/lib/validations'
import { createFileRoute } from '@tanstack/react-router'
import { partnerColumns } from './-columns'
import { Button } from '@/components/ui/button'
import { Briefcase, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import PartnerForm from './-form'
import { useApp } from '@/providers/app-provider'
import { capitalize } from '@/lib/utils'
import { partnerTypes } from '@/lib/variables'

export const Route = createFileRoute('/_private/partners/$role/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
    type: stringValidation('Type').catch(undefined),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { role } = Route.useParams()
  const params = Route.useSearch()
  const { setDeleteModal } = useApp()
  const [partnerModal, setPartnerModal] = useState<ModalStateType>(null)

  const query: QueryParamType = {
    table: "partners",
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
      type: params.type
    },
    search: {
      term: params.search,
      key: ["name", "email", "phone"]
    }
  }

  return (
    <>
      <TableComponent columns={partnerColumns({
        actions: {
          edit: (id) => {
            setPartnerModal({
              id,
              isOpen: true
            })
          },
          delete: (id) => {
            setDeleteModal({
              id,
              title: capitalize(role),
              table: "partners"
            })
          }
        }
      })} filters={[
        { key: "type", label: "Type", options: partnerTypes, icon: Briefcase, value: params.type }
      ]} query={query} options={{
        hasSearch: true
      }} toolbar={(
        <Button size="sm" variant="outline" onClick={() => {
          setPartnerModal({
            id: null,
            isOpen: true
          })
        }}><PlusCircle  /> Create</Button>
      )} />
      <PartnerForm modal={partnerModal} setModal={setPartnerModal} />
    </>
  )
}
