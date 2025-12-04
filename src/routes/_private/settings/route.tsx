import { createFileRoute, Outlet, Link, useParams } from '@tanstack/react-router'
import { Tag } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export const Route = createFileRoute('/_private/settings')({
  component: SettingsLayout,
})

const settingsNavItems = [
  {
    key: 'partnerTypes',
    title: 'Partner Types',
    href: '/settings/partnerTypes',
    icon: Tag,
  },
]

function SettingsLayout() {
  const { key } = useParams({ strict: false })
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className='rounded-xl border p-4 shadow-sm'>
        <SidebarMenu>
          {settingsNavItems.map((item) => (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton isActive={key === item.key} asChild>
                <Link to={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
      <div className='col-span-3'>
        <Outlet />
      </div>
    </div>
  )
}
