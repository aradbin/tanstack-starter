import { createFileRoute, Outlet } from "@tanstack/react-router"

import AppLayout from "@/components/layout/app-layout"

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
