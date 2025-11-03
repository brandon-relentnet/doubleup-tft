import { createFileRoute } from '@tanstack/react-router'
import PostDetail from '@/components/forum/supa/PostDetail'

export const Route = createFileRoute('/forum/$postId')({
  component: () => {
    const { postId } = Route.useParams()
    return <PostDetail postId={postId} />
  },
})

