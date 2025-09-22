import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/services/')({
  component: RouteComponent,
})

function RouteComponent() {
  return "Services"
}
