import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-layout/app-sidebar"
import { Breadcrumbs } from "@/components/layout/app-layout/breadcrumbs"

import { FullscreenToggle } from "./app-layout/full-screen-toggle"
import { NavUser } from "./app-layout/nav-user"
import { ThemeToggle } from "./app-layout/theme-toggle"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 w-full bg-background border-b border-sidebar-border rounded-t-xl">
          <div className="flex h-14 justify-between items-center gap-4 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumbs
                breadcrumbs={[
                  {
                    title: "Dashboard",
                    href: "/dashboard",
                  },
                ]}
              />
            </div>
            <div className="grow flex justify-end items-center gap-2">
              <FullscreenToggle />
              <ThemeToggle />
              <NavUser />
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
