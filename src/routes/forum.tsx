import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forum')({
  component: ForumLayout,
})

function ForumLayout() {
  return (
    <div className="relative">
      <Outlet />
    </div>
  )
}
