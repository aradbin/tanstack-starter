import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/roles/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/roles/"!</div>
}
