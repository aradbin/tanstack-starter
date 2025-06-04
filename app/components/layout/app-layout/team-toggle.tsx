import { useRouteContext } from "@tanstack/react-router"
import { Building, ChevronsUpDown, Landmark, Plus } from "lucide-react"

import { capitalize } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"

export default function TeamToggle() {
  const user = useRouteContext({ from: "/_private" }).user
  const active = user?.session?.activeOrganizationId
    ? user?.members?.find(
        (member) =>
          member?.organizations?.id === user.session.activeOrganizationId
      )
    : user?.members?.[0]
  console.log("TeamToggle user:", user)
  const { open } = useSidebar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {active?.organizations?.logo ? (
              <img
                src={active?.organizations?.logo}
                alt={active?.organizations?.name}
                className="size-4"
              />
            ) : (
              <Landmark className="size-4" />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {active?.organizations?.name}
            </span>
            <span className="truncate text-xs">
              {capitalize(active?.members?.role)}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side={open ? "bottom" : "right"}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        {user?.members?.map((member, index) => (
          <DropdownMenuItem
            key={index}
            className={`gap-2 p-2 cursor-pointer ${member?.organizations?.id === active?.organizations?.id ? "bg-accent text-accent-foreground" : ""}`}
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              {member?.organizations?.logo ? (
                <img
                  src={member.organizations.logo}
                  alt={member.organizations.name}
                  className="size-4 shrink-0"
                />
              ) : (
                <Landmark className="size-4 shrink-0" />
              )}
            </div>
            {member?.organizations?.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">
            Add Organization
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
