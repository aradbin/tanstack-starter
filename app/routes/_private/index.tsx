import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/")({
  component: Home,
})

function Home() {
  return <div className="p-6">Dashboard</div>
}
