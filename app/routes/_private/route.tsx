import { createFileRoute, Outlet } from "@tanstack/react-router"

import AppLayout from "@/components/layout/app-layout"
import { AppProvider } from "@/providers/app-provider"
import TaskForm from "./tasks/-form"
import DeleteComponent from "@/components/app/delete-component"

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
        <TaskForm />
        <DeleteComponent />
      </AppLayout>
    </AppProvider>
  )
}
