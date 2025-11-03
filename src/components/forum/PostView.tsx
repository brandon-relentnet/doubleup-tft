import { Link } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { useForum } from './ForumProvider'
import ReplyList from './ReplyList'

export default function PostView({ postId }: { postId: string }) {
  const { state, addComment } = useForum()
  const post = useMemo(() => state.posts.find((p) => p.id === postId), [state.posts, postId])
  const author = useMemo(() => state.users.find((u) => u.id === post?.authorId)?.displayName ?? 'Anonymous', [state.users, post?.authorId])

  const [text, setText] = useState('')
  const [replyToId, setReplyToId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const repliesChrono = useMemo(
    () => state.comments.filter((c) => c.postId === postId).sort((a, b) => a.createdAt - b.createdAt),
    [state.comments, postId],
  )

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="text-sm text-muted">Post not found.</p>
        <div className="mt-4">
          <Link to="/forum-demo" className="text-primary hover:underline">← Back to forum</Link>
        </div>
      </div>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addComment({ postId: post.id, body: text, parentId: replyToId ?? undefined })
    setText('')
    setReplyToId(null)
  }

  const handleReplyTo = (commentId: string) => {
    setReplyToId(commentId)
    // Scroll to and focus the composer
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      textareaRef.current?.focus()
    }, 0)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 flex flex-col gap-8">
      <nav className="text-sm">
        <Link to="/forum-demo" className="text-primary hover:underline">← Back to forum</Link>
      </nav>

      <article className="rounded bg-surface px-6 py-5 shadow-sm">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text">{post.title}</h1>
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            {new Date(post.createdAt).toLocaleString()} • {author}
          </span>
        </header>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text">{post.body}</p>
      </article>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Replies</h2>
        <ReplyList postId={post.id} onReplyTo={handleReplyTo} />
        <form ref={formRef} onSubmit={onSubmit} className="rounded bg-surface p-4 flex flex-col gap-2">
          {replyToId ? (
            <ReplyingToBanner commentId={replyToId} replies={repliesChrono} onClear={() => setReplyToId(null)} />
          ) : null}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a reply..."
            rows={4}
            className="rounded border border-border bg-surface px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              type="submit"
              className="rounded bg-linear-to-r from-primary to-secondary text-base px-4 py-2 text-sm font-semibold"
            >
              Post Reply
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ReplyingToBanner({ commentId, replies, onClear }: { commentId: string; replies: Array<{ id: string; createdAt: number; authorId: string; body: string }>; onClear: () => void }) {
  const { state } = useForum()
  const idx = replies.findIndex((r) => r.id === commentId)
  const comment = replies[idx]
  const author = comment ? (state.users.find((u) => u.id === comment.authorId)?.displayName ?? 'Anonymous') : ''
  if (!comment) return null
  return (
    <div className="rounded bg-surface p-2 text-xs flex items-center justify-between">
      <div className="truncate">
        Replying to #{idx + 1} • {new Date(comment.createdAt).toLocaleString()} • {author}
      </div>
      <button type="button" className="ml-3 text-primary hover:underline" onClick={onClear}>
        Cancel
      </button>
    </div>
  )
}
