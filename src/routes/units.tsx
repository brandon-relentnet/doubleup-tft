import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/units')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/units"!</div>
}
