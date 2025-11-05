// import { syncRegalTranstrade } from "@/lib/organizations/regal-transtrade"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/")({
  component: Home,
})

function Home() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* <button onClick={async () => {
        await syncRegalTranstrade()
      }}>sync</button> */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums">10</CardTitle>
          <CardDescription>Total Trips</CardDescription>
          <CardAction><ShieldUser /></CardAction>
        </CardHeader>
        <CardFooter>
          <Link to="/">
            <Button variant="outline" size="sm">
              View All Trips <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card> */}
    </div>
  )
}
