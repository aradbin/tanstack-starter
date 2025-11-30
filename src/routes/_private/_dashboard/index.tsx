import { createFileRoute } from "@tanstack/react-router"
import MetricSection from "./-metric-section"

export const Route = createFileRoute("/_private/_dashboard/")({
  component: Home,
})

function Home() {
  return (
    <MetricSection />
  )
}
