import { createFileRoute, Outlet } from "@tanstack/react-router"

import AppLayout from "@/components/layout/app-layout"
import { AppProvider } from "@/providers/app-provider"
import Modals from "./-modals"

export const Route = createFileRoute("/_private")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppProvider>
      <AppLayout>
        <div className="container flex flex-col gap-4 md:gap-6 p-4 md:p-6">
          <Outlet />
        </div>
        <Modals />
      </AppLayout>
    </AppProvider>
  )
}
