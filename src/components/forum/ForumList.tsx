import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useForum } from './ForumProvider'
import SortMenu from './SortMenu'
import type { Post, SortOption, User } from './types'

const PAGE_SIZE = 8

function authorName(users: User[], authorId: string) {
  return users.find((u) => u.id === authorId)?.displayName ?? 'Anonymous'
}

function snippet(text: string, n = 160) {
  const s = text.trim().replace(/\s+/g, ' ')
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export default function ForumList() {
  const { state, getReplyCount, addPost } = useForum()
  const [sort, setSort] = useState<SortOption>('oldest')
  const [page, setPage] = useState(1)
  const [showComposer, setShowComposer] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const sorted = useMemo(() => {
    const withMeta = state.posts.map((p) => ({
      post: p,
      replies: getReplyCount(p.id),
    }))

    if (sort === 'mostActive') {
      return withMeta
        .sort((a, b) => {
          if (b.replies !== a.replies) return b.replies - a.replies
          return a.post.createdAt - b.post.createdAt
        })
        .map((x) => x.post)
    }

    if (sort === 'newest') {
      return [...state.posts].sort((a, b) => b.createdAt - a.createdAt)
    }

    // default: oldest (chronological)
    return [...state.posts].sort((a, b) => a.createdAt - b.createdAt)
  }, [state.posts, sort, getReplyCount])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const view = sorted.slice(start, start + PAGE_SIZE)

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    addPost({ title, body })
    setTitle('')
    setBody('')
    setShowComposer(false)
    // optional: navigate to new post; keep simple here
  }

  const Header = (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold gradient-text w-fit">Forum Demo</h1>
        <p className="text-sm text-muted max-w-2xl">
          Transparent, intuitive, and human-scaled. No algorithms — just posts and
          conversations.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <SortMenu value={sort} onChange={(s) => { setSort(s); setPage(1) }} />
        <button
          className="rounded bg-linear-to-r from-primary to-secondary text-base px-4 py-2 text-sm font-semibold"
          onClick={() => setShowComposer((v) => !v)}
        >
          {showComposer ? 'Close' : 'New Post'}
        </button>
      </div>
    </header>
  )

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12 flex flex-col gap-8">
      {Header}

      {showComposer ? (
        <form
          onSubmit={submitPost}
          className="rounded bg-surface p-4 flex flex-col gap-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded border border-border bg-surface px-3 py-2 text-sm"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post..."
            rows={5}
            className="rounded border border-border bg-surface px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded border border-border px-3 py-2 text-sm hover:bg-highlight-low"
              onClick={() => setShowComposer(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-linear-to-r from-primary to-secondary text-base px-4 py-2 text-sm font-semibold"
            >
              Post
            </button>
          </div>
        </form>
      ) : null}

      {!view.length ? (
        <p className="text-sm text-muted">No posts yet.</p>
      ) : (
        <section className="flex flex-col gap-4">
          {view.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      <footer className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted">
          Page {page} of {pageCount}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded border border-border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="rounded border border-border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const { state, getReplyCount } = useForum()
  const author = authorName(state.users, post.authorId)
  const replies = getReplyCount(post.id)
  return (
    <article className="rounded bg-surface px-6 py-5 shadow-sm">
      <header className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-text">
          <Link to="/forum-demo/$postId" params={{ postId: post.id }} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          {new Date(post.createdAt).toLocaleString()} • {author} • {replies}{' '}
          {replies === 1 ? 'reply' : 'replies'}
        </span>
      </header>
      <p className="mt-3 text-sm leading-6 text-text whitespace-pre-wrap">
        {snippet(post.body)}
      </p>
      <div className="mt-4">
        <Link
          to="/forum-demo/$postId"
          params={{ postId: post.id }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read and discuss →
        </Link>
      </div>
    </article>
  )
}
