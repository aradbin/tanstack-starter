import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/email/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/email/"!</div>
}
