import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, BookUser, Contact, ShieldUser, Users } from "lucide-react"

export const Route = createFileRoute("/_private/")({
  component: Home,
})

function Home() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums">10</CardTitle>
          <CardDescription>Total Members</CardDescription>
          <CardAction><ShieldUser /></CardAction>
        </CardHeader>
        <CardFooter>
          <Link to="/members">
            <Button variant="outline" size="sm">
              View All Members <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums">20</CardTitle>
          <CardDescription>Total Employees</CardDescription>
          <CardAction><Users /></CardAction>
        </CardHeader>
        <CardFooter>
          <Link to="/">
            <Button variant="outline" size="sm">
              View All Employees <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums">150</CardTitle>
          <CardDescription>Total Contacts</CardDescription>
          <CardAction><Contact /></CardAction>
        </CardHeader>
        <CardFooter>
          <Link to="/">
            <Button variant="outline" size="sm">
              View All Contacts <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums">1253</CardTitle>
          <CardDescription>Total Clients</CardDescription>
          <CardAction><BookUser /></CardAction>
        </CardHeader>
        <CardFooter>
          <Link to="/">
            <Button variant="outline" size="sm">
              View All Clients <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
