import { createFileRoute } from '@tanstack/react-router'
import PostDetail from '@/components/forum/supa/PostDetail'

export const Route = createFileRoute('/forum/$postId')({
  validateSearch: (search: Record<string, unknown>) => {
    const result: { c?: string } = {}
    if (typeof search.c === 'string') {
      result.c = search.c
    }
    return result
  },
  component: PostRouteComponent,
})

function PostRouteComponent() {
  const { postId } = Route.useParams()
  const { c } = Route.useSearch()
  return <PostDetail postId={postId} initialCommentId={c ?? null} />
}
