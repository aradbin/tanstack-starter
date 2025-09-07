import { createFileRoute, Outlet } from '@tanstack/react-router'
import EmployeeForm from './-form'

export const Route = createFileRoute('/_private/employees')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
      <EmployeeForm />
    </>
  )
}
