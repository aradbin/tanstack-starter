import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/events/')({
  component: RouteComponent,
})

function RouteComponent() {
  return "Events"
}
