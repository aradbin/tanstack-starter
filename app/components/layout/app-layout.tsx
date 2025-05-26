import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/layout/app-layout/breadcrumbs"
import { AppSidebar } from "@/components/layout/app-layout/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumbs
              breadcrumbs={[
                {
                  title: "Dashboard",
                  href: "/dashboard",
                },
              ]}
            />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
