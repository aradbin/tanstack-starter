import AvatarComponent from "@/components/common/avatar-component"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { employees } from "@/lib/db/schema/employees"
import { capitalize } from "@/lib/utils"
import { useApp } from "@/providers/app-provider"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Cake, Edit, IdCard, Phone } from "lucide-react"

export default function EmployeeCard({
  employee
}: {
  employee: typeof employees.$inferSelect
}) {
  const { setEmployeeModal } = useApp()

  return (
    <Card className="relative w-full">
      <Link to="/employees" className="absolute top-4 left-4">
        <Button variant="outline" size="icon"><ArrowLeft /></Button>
      </Link>
      <CardHeader className="text-center">
        <AvatarComponent user={employee} options={{ hideBody: true, avatarFallbackClassNames: 'text-2xl' }} classNames='size-24 mx-auto' />
        <p className="text-2xl font-bold">{employee?.name}</p>
        <p className="text-sm text-muted-foreground">{capitalize(employee?.designation)}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">Trips</div>
          </div>
          <div>
            <div className="text-2xl font-bold">56</div>
            <div className="text-xs text-muted-foreground">Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold">892</div>
            <div className="text-xs text-muted-foreground">Invoices</div>
          </div>
        </div> */}
        <div className='flex flex-col gap-2 text-sm text-muted-foreground'>
          <div className="flex items-center">
            <Phone className="size-4 mr-2" />{employee?.phone}
          </div>
          <div className="flex items-center">
            <IdCard className="size-4 mr-2" />{employee?.nid}
          </div>
          <div className="flex items-center">
            <Cake className="size-4 mr-2" />{employee?.dob}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button className="flex-1" onClick={() => {
            setEmployeeModal({
              id: employee?.id,
              isOpen: true
            })
          }}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}