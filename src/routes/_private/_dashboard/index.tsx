import { createFileRoute } from "@tanstack/react-router"
import MetricSection from "./-metric-section"
import TripSection from "./-trip-section"
// import { syncRegalTranstrade } from "@/lib/organizations/regal-transtrade"

export const Route = createFileRoute("/_private/_dashboard/")({
  component: Home,
})

function Home() {
  return (
    <div className="space-y-6">
      {/* <button onClick={async () => {
        await syncRegalTranstrade()
      }}>sync</button> */}
      <MetricSection />
      <TripSection />
    </div>
  )
}
