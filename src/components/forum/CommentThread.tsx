import { useMemo, useState } from 'react'
import { useForum } from './ForumProvider'
import type { Comment, User } from './types'

function groupByParent(comments: Comment[]) {
  const map = new Map<string | null, Comment[]>()
  for (const c of comments) {
    const key = c.parentId ?? null
    const arr = map.get(key) ?? []
    arr.push(c)
    map.set(key, arr)
  }
  return map
}

function authorName(users: User[], authorId: string) {
  return users.find((u) => u.id === authorId)?.displayName ?? 'Anonymous'
}

type ThreadProps = {
  postId: string
}

export default function CommentThread({ postId }: ThreadProps) {
  const { state } = useForum()
  const all = useMemo(
    () => state.comments.filter((c) => c.postId === postId).sort((a, b) => a.createdAt - b.createdAt),
    [state.comments, postId],
  )
  const byParent = useMemo(() => groupByParent(all), [all])
  const top = byParent.get(null) ?? []

  return (
    <div className="flex flex-col gap-3">
      {top.map((c) => (
        <CommentNode key={c.id} comment={c} byParent={byParent} depth={0} />
      ))}
    </div>
  )
}

function CommentNode({ comment, byParent, depth }: { comment: Comment; byParent: Map<string | null, Comment[]>; depth: number }) {
  const { state, addComment } = useForum()
  const children = byParent.get(comment.id) ?? []
  const [collapsed, setCollapsed] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [text, setText] = useState('')
  const author = authorName(state.users, comment.authorId)

  const onReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addComment({ postId: comment.postId, body: text, parentId: comment.id })
    setText('')
    setReplyOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded border border-border bg-surface px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            {new Date(comment.createdAt).toLocaleString()} • {author}
          </span>
        </div>
        <p className="mt-2 text-sm whitespace-pre-wrap">{comment.body}</p>
        <div className="mt-2 flex items-center gap-3">
          <button
            className="text-xs text-primary hover:underline"
            onClick={() => setReplyOpen((v) => !v)}
          >
            {replyOpen ? 'Cancel' : 'Reply'}
          </button>
          {children.length ? (
            <button
              className="text-xs text-muted hover:underline"
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? `Show replies (${children.length})` : `Hide replies (${children.length})`}
            </button>
          ) : null}
        </div>
        {replyOpen ? (
          <form onSubmit={onReply} className="mt-2 flex flex-col gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="rounded border border-border bg-card px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded bg-linear-to-r from-primary to-secondary text-base px-3 py-1 text-sm font-semibold"
              >
                Reply
              </button>
              <button
                type="button"
                className="rounded border border-border px-3 py-1 text-sm"
                onClick={() => setReplyOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {!collapsed && children.length ? (
        <div className="pl-4 border-l border-border flex flex-col gap-2">
          {children.map((c) => (
            <CommentNode key={c.id} comment={c} byParent={byParent} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

