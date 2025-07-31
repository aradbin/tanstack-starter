import { footerNavItems } from "@/lib/variables"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavFooter } from "@/components/layout/app-layout/nav-footer"
import { NavMain } from "@/components/layout/app-layout/nav-main"
import TeamSwitcher from "@/components/layout/app-layout/team-toggle"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <TeamSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <ScrollArea>
        <SidebarContent className="gap-0">
          <NavMain />
        </SidebarContent>
      </ScrollArea>
      {footerNavItems?.length > 0 && (
        <SidebarFooter>
          <NavFooter className="mt-auto" />
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
