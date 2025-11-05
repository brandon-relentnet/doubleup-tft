import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Replies } from './Replies'
import type { ForumPostRow } from '@/lib/forumApi'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import FetchErrorCard from '@/components/FetchErrorCard'
import { fetchForumPost } from '@/lib/forumApi'
import { noTagSearch } from '@/lib/router'
import { formatDateTime } from '@/lib/dateFormatting'

export default function PostDetail({
  postId,
  initialCommentId,
}: {
  postId: string
  initialCommentId?: string | null
}) {
  const [post, setPost] = useState<ForumPostRow | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const row = await fetchForumPost(postId)
        if (!row) {
          setError('Post not found.')
          setLoading(false)
          return
        }
        setPost(row)
        setLoading(false)
      } catch (e) {
        if (alive) {
          setError(
            e instanceof Error ? e.message : 'Network error loading post.',
          )
          setLoading(false)
        }
      } finally {
      }
    }
    run().catch(() => {})
    return () => {
      alive = false
    }
  }, [postId])

  if (loading && !error && !post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <article className="rounded bg-surface px-6 py-5">
          <p className="text-sm text-muted">Loading post…</p>
        </article>
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
          <Link
            to="/forum"
            className="hover:text-accent text-subtle hover:underline"
          >
            ← Back to forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DiscussionsLayout
      backTo={{
        to: '/forum',
        label: 'Back to forum',
        search: noTagSearch(),
      }}
      title={post.title}
      description={
        <span className="text-sm uppercase tracking-[0.2em] text-muted">
          {formatDateTime(post.created_at)} •{' '}
          {post.author_display_name ? (
            <Link
              to="/u/$name"
              params={{ name: post.author_display_name }}
              className="gradient-text"
            >
              {post.author_display_name}
            </Link>
          ) : (
            'Anonymous'
          )}
        </span>
      }
    >
      <article className="rounded bg-surface px-6 py-5">
        <p className="whitespace-pre-wrap text-sm leading-6 text-text">
          {post.body}
        </p>
      </article>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Replies</h2>
        <Replies postId={post.id} initialFocusId={initialCommentId} />
      </section>
    </DiscussionsLayout>
  )
}
