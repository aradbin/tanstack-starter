import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { getUser } from "@/lib/auth/functions"
import AppLayout from "@/components/layout/app-layout"

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await getUser()

    return { user }
  },
  loader: async ({ context, location }) => {
    if (!context?.user) {
      throw redirect({
        to: "/login",
        search: { from: location.href },
      })
    }
  },
})

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
