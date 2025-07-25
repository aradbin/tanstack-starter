import { ChevronsUpDown, Landmark, Plus } from "lucide-react"

import { useAuth } from "@/lib/auth/hook"
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
  const user = useAuth()
  const active = user?.activeOrganizationId
    ? user?.organizations?.find(
        (organization) => organization?.id === user?.activeOrganizationId
      )
    : user?.organizations?.[0]

  const { open } = useSidebar()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {active?.logo ? (
              <img src={active?.logo} alt={active?.name} className="size-4" />
            ) : (
              <Landmark className="size-4" />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{active?.name}</span>
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
        {user?.organizations?.map((organization, index) => (
          <DropdownMenuItem
            key={index}
            className={`gap-2 p-2 ${organization?.id === active?.id ? "bg-accent text-accent-foreground" : ""}`}
          >
            <div className="flex size-6 items-center justify-center rounded-sm border">
              {organization?.logo ? (
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="size-4 shrink-0"
                />
              ) : (
                <Landmark className="size-4 shrink-0" />
              )}
            </div>
            {organization?.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
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
