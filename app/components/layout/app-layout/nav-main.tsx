import { Link } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"

import { NavItemType } from "@/lib/types"
import { mainNavItems } from "@/lib/variables"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain() {
  const { openMobile, setOpenMobile } = useSidebar()

  const renderMenuItem = (item: NavItemType) => {
    if (item?.items?.length) {
      return (
        <Collapsible className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between [&[data-state=open]>svg]:rotate-180">
              <span className="flex items-center">
                {item?.icon && <item.icon className="me-4 h-4 w-4" />}
                <span>{item?.title}</span>
                {item?.label && (
                  <Badge variant="secondary" className="me-2">
                    {item?.label}
                  </Badge>
                )}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuItem key={subItem.title}>
                  {renderMenuItem(subItem)}
                </SidebarMenuItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <SidebarMenuButton onClick={() => setOpenMobile(!openMobile)} asChild>
        <Link to={item?.href}>
          {item?.icon && <item.icon className="me-2 h-4 w-4" />}
          <span>{item?.title}</span>
          {item?.label && (
            <Badge variant="secondary" className="me-2">
              {item?.label}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    )
  }

  return (
    <>
      {mainNavItems?.map((group, index) => (
        <SidebarGroup key={index} className="px-2 py-0">
          {group?.title && (
            <SidebarGroupLabel>{group?.title}</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {group?.items?.map((item, index) => (
                <SidebarMenuItem key={index}>
                  {renderMenuItem(item)}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
