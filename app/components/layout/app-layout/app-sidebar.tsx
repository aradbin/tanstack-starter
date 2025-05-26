import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BookOpen, Folder, LayoutGrid } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { NavItem } from "@/lib/types"
import { NavMain } from "@/components/layout/app-layout/nav-main"
import { NavFooter } from "@/components/layout/app-layout/nav-footer"
import { NavUser } from "@/components/layout/app-layout/nav-user"

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutGrid,
  },
]

const footerNavItems: NavItem[] = [
  {
    title: "Repository",
    href: "/",
    icon: Folder,
  },
  {
    title: "Documentation",
    href: "/",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                  {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                </div>
                <div className="ml-1 grid flex-1 text-left text-sm">
                  <span className="mb-0.5 truncate leading-none font-semibold">
                    Tanstack Start
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
