import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import AssetForm from './-form'

export const Route = createFileRoute('/_private/assets')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
      <AssetForm />
    </>
  )
}
