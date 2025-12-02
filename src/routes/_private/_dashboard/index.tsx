import { createFileRoute } from "@tanstack/react-router"
import MetricSection from "./-metric-section"
import TripSection from "./-trip-section"

export const Route = createFileRoute("/_private/_dashboard/")({
  component: Home,
})

function Home() {
  return (
    <div className="space-y-6">
      <MetricSection />
      <TripSection />
    </div>
  )
}
