import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/strategies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/strategies"!</div>
}
