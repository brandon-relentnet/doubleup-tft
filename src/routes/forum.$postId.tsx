import { createFileRoute } from '@tanstack/react-router'
import PostDetail from '@/components/forum/supa/PostDetail'

export const Route = createFileRoute('/forum/$postId')({
  component: () => {
    const { postId } = Route.useParams()
    const { c } = Route.useSearch() as { c?: string }
    return <PostDetail postId={postId} initialCommentId={c ?? null} />
  },
})
