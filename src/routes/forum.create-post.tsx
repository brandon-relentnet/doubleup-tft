import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forum/create-post')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/forum/create-post"!</div>
}
