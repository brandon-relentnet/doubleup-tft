import { createFileRoute } from '@tanstack/react-router'
import PostView from '@/components/forum/PostView'

export const Route = createFileRoute('/forum-demo/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams()
  return <PostView postId={postId} />
}

