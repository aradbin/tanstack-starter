import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import VehicleForm from './-form'

export const Route = createFileRoute('/_private/vehicles')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
      <VehicleForm />
    </>
  )
}
