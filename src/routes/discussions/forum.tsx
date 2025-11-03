import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/discussions/forum')({
  component: ForumLayout,
})

function ForumLayout() {
  return <Outlet />
}
