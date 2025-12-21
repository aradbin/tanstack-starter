import TableComponent from '@/components/table/table-component'
import { Button } from '@/components/ui/button'
import { QueryParamType } from '@/lib/db/functions'
import { defaultSearchParamValidation, validate } from '@/lib/validations'
import { useApp } from '@/providers/app-provider'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { memberColumns } from './-columns'
import { useState } from 'react'
import { ModalStateType } from '@/lib/types'
import MemberForm from './-form'

export const Route = createFileRoute('/_private/_organization/members/')({
  validateSearch: validate({
    ...defaultSearchParamValidation,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useSearch()
  const { setDeleteModal } = useApp()
  const [memberModal, setMemberModal] = useState<ModalStateType>(null)

  const query: QueryParamType = {
    table: "members",
    relation: {
      user: true,
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
      key: ["name"]
    }
  }

  return (
    <>
    <TableComponent columns={memberColumns({
      actions: {
        edit: (id) => {
          setMemberModal({
            id,
            isOpen: true
          })
        },
        delete: (id) => {
          setDeleteModal({
            id,
            title: "Member",
            table: "members"
          })
        }
      }
    })} filters={[]} query={query} options={{
      hasSearch: true
    }} toolbar={(
      <Button size="sm" variant="outline" onClick={() => {
        setMemberModal({
          id: null,
          isOpen: true
        })
      }}><PlusCircle /> Create</Button>
    )} />
    <MemberForm modal={memberModal} setModal={setMemberModal} />
    </>
  )
}
