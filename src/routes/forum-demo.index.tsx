import { createFileRoute } from '@tanstack/react-router'
import ForumList from '@/components/forum/ForumList'

export const Route = createFileRoute('/forum-demo/')({
  component: ForumDemoIndex,
})

function ForumDemoIndex() {
  return <ForumList />
}

