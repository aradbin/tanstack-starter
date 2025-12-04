import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Contact, Users } from 'lucide-react'

export const Route = createFileRoute('/_private/partners/')({
  component: RouteComponent,
})

function RouteComponent() {
  const links = [
    { to: '/partners/contact', title: 'Contacts', icon: <Contact /> },
    { to: '/partners/customer', title: 'Customers', icon: <Users /> },
    { to: '/partners/vendor', title: 'Vendors', icon: <Users /> },
    { to: '/partners/supplier', title: 'Suppliers', icon: <Users /> },
  ];
  
  return (
    <div className='flex justify-center items-center gap-6'>
      {links.map(link => (
        <Link to={link.to} className='w-48' key={link.title}>
          <Card>
            <CardHeader>
              <CardTitle className='flex flex-col text-center justify-center items-center gap-2'>
                {link.icon}
                <p>{link.title}</p>
              </CardTitle>
          </CardHeader>
        </Card>
      </Link>
      ))}
    </div>
  )
}
