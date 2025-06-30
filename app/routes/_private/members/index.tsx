import TableComponent from '@/components/table/table-component'
import { numberValidation, validate } from '@/lib/validations'
import { defaultPageSize } from '@/lib/variables'
import { createFileRoute } from '@tanstack/react-router'
import { memberColumns } from './-columns'

export const Route = createFileRoute('/_private/members/')({
  component: RouteComponent,
  validateSearch: validate({
    page: numberValidation('Page').catch(1),
    pageSize: numberValidation('Page Size').catch(defaultPageSize),
  })
})

function RouteComponent() {
  const search = Route.useSearch()
  
  return (
    <TableComponent columns={memberColumns} query={{
      table: "members",
      relations: {
        user: true,
      },
      params: search
    }} />
  )
}
