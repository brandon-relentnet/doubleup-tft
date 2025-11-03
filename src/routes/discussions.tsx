import { Outlet, createFileRoute } from '@tanstack/react-router'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/discussions')({
  validateSearch: (search) => ({
    tag:
      typeof search.tag === 'string' && search.tag.length > 0
        ? search.tag
        : undefined,
  }),
  component: DiscussionsRouteComponent,
})

function DiscussionsRouteComponent() {
  usePageMeta({
    title: 'Field Notes & Patch Dispatches | DoubleUp TFT',
    description:
      'Browse Free-Range TFT essays, patch breakdowns, and duo coordination guides built for adaptable Double Up play.',
  })

  return <Outlet />
}
