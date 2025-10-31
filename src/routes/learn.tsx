import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn')({
  validateSearch: (search) => ({
    tag: typeof search.tag === 'string' && search.tag.length > 0 ? search.tag : undefined,
  }),
  component: LearnRouteComponent,
})

function LearnRouteComponent() {
  return <Outlet />
}
