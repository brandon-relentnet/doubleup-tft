import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/doubleup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/doubleup"!</div>
}
