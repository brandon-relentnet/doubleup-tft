import { Outlet, createFileRoute } from '@tanstack/react-router'
import { ForumProvider } from '@/components/forum/ForumProvider'

export const Route = createFileRoute('/forum-demo')({
  component: DemoLayout,
})

function DemoLayout() {
  return (
    <ForumProvider>
      <Outlet />
    </ForumProvider>
  )
}

