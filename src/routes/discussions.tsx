import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/discussions')({
  validateSearch: (search) => ({
    tag: typeof search.tag === 'string' && search.tag.length > 0 ? search.tag : undefined,
  }),
  component: DiscussionsRouteComponent,
})

function DiscussionsRouteComponent() {
  return <Outlet />
}
