import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/")({
  component: Home,
})

function Home() {
  return <div></div>
}
