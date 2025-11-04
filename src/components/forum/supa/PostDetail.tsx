import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import DiscussionsLayout from '@/components/DiscussionsLayout'
// Using direct REST fetch for reliability here
import { Replies } from './Replies'
import FetchErrorCard from '@/components/FetchErrorCard'
import { fetchJson } from '@/lib/supaRest'

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string
  author_display_name: string | null
}

export default function PostDetail({ postId, initialCommentId }: { postId: string; initialCommentId?: string | null }) {
  const [post, setPost] = useState<PostRow | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const { data: rows } = await fetchJson<Array<PostRow>>(
          `/rest/v1/forum_posts?id=eq.${postId}&select=id,title,body,created_at,author_display_name`,
        )
        if (!rows?.length) {
          setError('Post not found.')
          setLoading(false)
          return
        }
        setPost(rows[0])
        setLoading(false)
      } catch (e) {
        if (alive) {
          setError(e instanceof Error ? e.message : 'Network error loading post.')
          setLoading(false)
        }
      } finally {}
    }
    run().catch(() => {})
    return () => {
      alive = false
    }
  }, [postId])

  if (loading && !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <FetchErrorCard
          message={error ?? 'Post not found.'}
          onRetry={() => {
            setError(null)
            setPost(null)
            window.dispatchEvent(new Event('focus'))
          }}
        />
        <div className="mt-4">
          <Link to="/forum" className="text-primary hover:underline">← Back to forum</Link>
        </div>
      </div>
    )
  }

  return (
    <DiscussionsLayout
      backTo={{ to: '/forum', label: 'Back to forum', search: { tag: undefined } }}
      title={post.title}
      description={
        <span className="text-sm uppercase tracking-[0.2em] text-muted">
          {new Date(post.created_at).toLocaleString()} • {post.author_display_name ? (
            <Link to="/u/$name" params={{ name: post.author_display_name }} className="hover:underline">
              {post.author_display_name}
            </Link>
          ) : 'Anonymous'}
        </span>
      }
    >
      <article className="rounded bg-surface px-6 py-5">
        <p className="whitespace-pre-wrap text-sm leading-6 text-text">{post.body}</p>
      </article>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Replies</h2>
        <Replies postId={post.id} initialFocusId={initialCommentId} />
      </section>
    </DiscussionsLayout>
  )
}
