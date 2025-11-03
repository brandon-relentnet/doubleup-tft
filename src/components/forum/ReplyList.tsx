import { useMemo, useState, useEffect, useRef } from 'react'
import { useForum } from './ForumProvider'
import type { User } from './types'

const PAGE_SIZE = 10

function authorName(users: User[], authorId: string) {
  return users.find((u) => u.id === authorId)?.displayName ?? 'Anonymous'
}

function snippet(text: string, n = 120) {
  const s = text.trim().replace(/\s+/g, ' ')
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export default function ReplyList({ postId, onReplyTo }: { postId: string; onReplyTo?: (commentId: string) => void }) {
  const { state } = useForum()
  const replies = useMemo(
    () =>
      state.comments
        .filter((c) => c.postId === postId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [state.comments, postId],
  )

  const [page, setPage] = useState(1)
  const prevCount = useRef(0)
  const pendingAnchor = useRef<number | null>(null)
  const pageCount = Math.max(1, Math.ceil(replies.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const view = replies.slice(start, start + PAGE_SIZE)

  // map id -> global index for display (1-based)
  const indexById = useMemo(() => {
    const map = new Map<string, number>()
    replies.forEach((r, i) => map.set(r.id, i + 1))
    return map
  }, [replies])

  // If reply count changes, jump to last page on new replies; clamp page if shrinking
  useEffect(() => {
    if (replies.length > prevCount.current) {
      // new reply added
      const anchorIndex = replies.length // new last reply
      pendingAnchor.current = anchorIndex
      setPage(pageCount)
    } else if (page > pageCount) {
      setPage(pageCount)
    }
    prevCount.current = replies.length
  }, [page, pageCount, replies.length])

  // When page or replies update and a pending anchor exists, scroll into view
  useEffect(() => {
    if (pendingAnchor.current != null) {
      const idx = pendingAnchor.current
      const id = `reply-${idx}`
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Highlight border in accent color briefly
        el.classList.add('highlight-accent-border')
        setTimeout(() => {
          el.classList.remove('highlight-accent-border')
        }, 1600)
        pendingAnchor.current = null
      }
    }
  }, [page, replies.length])

  return (
    <div className="flex flex-col gap-3">
      {!view.length ? (
        <p className="text-sm text-muted">No replies yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {view.map((r, idx) => {
            const quoted = r.parentId ? replies.find((q) => q.id === r.parentId) : null
            const quotedAuthor = quoted ? authorName(state.users, quoted.authorId) : null
            const qIndex = quoted ? indexById.get(quoted.id) : null
            return (
              <li
                key={r.id}
                id={`reply-${start + idx + 1}`}
                className="rounded border border-border bg-surface px-4 py-3 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">
                    #{start + idx + 1} • {new Date(r.createdAt).toLocaleString()} • {authorName(state.users, r.authorId)}
                  </div>
                  {onReplyTo ? (
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={() => onReplyTo(r.id)}
                    >
                      Reply
                    </button>
                  ) : null}
                </div>

                {quoted ? (
                  <details className="mt-2 rounded border border-border bg-card">
                    <summary className="cursor-pointer select-none list-none px-3 py-2 text-xs text-muted">
                      Quoted from #{qIndex} • {new Date(quoted.createdAt).toLocaleString()} • {quotedAuthor} — “{snippet(quoted.body)}”
                    </summary>
                    <div className="px-3 pb-3 space-y-2">
                      <blockquote className="text-sm text-subtle whitespace-pre-wrap">
                        {quoted.body}
                      </blockquote>
                      {qIndex ? (
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                          onClick={() => {
                            const targetPage = Math.ceil(qIndex / PAGE_SIZE)
                            if (targetPage === page) {
                              const id = `reply-${qIndex}`
                              const el = document.getElementById(id)
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                el.classList.add('highlight-accent-border')
                                setTimeout(() => {
                                  el.classList.remove('highlight-accent-border')
                                }, 1600)
                              } else {
                                pendingAnchor.current = qIndex
                              }
                            } else {
                              pendingAnchor.current = qIndex
                              setPage(targetPage)
                            }
                          }}
                        >
                          View original
                        </button>
                      ) : null}
                    </div>
                  </details>
                ) : null}

                <p className="mt-2 text-sm whitespace-pre-wrap">{r.body}</p>
              </li>
            )
          })}
        </ol>
      )}

      <footer className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted">Page {page} of {pageCount}</span>
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
