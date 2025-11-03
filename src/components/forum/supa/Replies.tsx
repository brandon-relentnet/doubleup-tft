import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'

type ReplyRow = {
  id: string
  post_id: string
  author_id: string
  author_display_name: string | null
  body: string
  created_at: string
  parent_id: string | null
}

const PAGE_SIZE = 10

function snippet(text: string, n = 120) {
  const s = text.trim().replace(/\s+/g, ' ')
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export function Replies({ postId, initialFocusId }: { postId: string; initialFocusId?: string | null }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<ReplyRow[]>([])
  const [replyText, setReplyText] = useState('')
  const [replyToId, setReplyToId] = useState<string | null>(null)

  const pendingAnchor = useRef<number | null>(null)

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const offset = (page - 1) * PAGE_SIZE

  const fetchTotal = async (): Promise<number> => {
    if (!supabase) return 0
    const { count, error: err } = await supabase
      .from('forum_comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId)
    if (err) throw err
    const next = count ?? 0
    setTotal(next)
    return next
  }

  const fetchPage = async (nextPage: number) => {
    if (!supabase) return
    setLoading(true)
    setError(null)
    const from = (nextPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error: err } = await supabase
      .from('forum_comments')
      .select('id, post_id, author_id, author_display_name, body, created_at, parent_id')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(from, to)
    if (err) {
      setError('Unable to load replies.')
      setLoading(false)
      return
    }
    setRows(data ?? [])
    setLoading(false)
  }

  const load = async () => {
    await fetchTotal()
    await fetchPage(page)
  }

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : 'Unable to load'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  useEffect(() => {
    fetchPage(page).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleRealtimeChange = useCallback(() => {
    // Refetch counts and current page to reflect live updates
    fetchTotal().catch(() => {})
    fetchPage(page).catch(() => {})
  }, [page])

  useRepliesRealtime(postId, handleRealtimeChange)

  // If an initial comment id is provided (e.g., deep link), jump to it once data is available
  useEffect(() => {
    if (!initialFocusId) return
    // attempt to jump once rows are loaded
    gotoOriginal(initialFocusId).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFocusId, rows.length])

  useEffect(() => {
    if (pendingAnchor.current != null) {
      const idx = pendingAnchor.current
      const id = `reply-${idx}`
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('highlight-accent-border')
        setTimeout(() => el.classList.remove('highlight-accent-border'), 1600)
        pendingAnchor.current = null
      }
    }
  }, [rows.length, page])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !user) return
    const text = replyText.trim()
    if (!text) return
    const displayName =
      typeof user.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : null
    const { error: err } = await supabase
      .from('forum_comments')
      .insert({
        post_id: postId,
        body: text,
        parent_id: replyToId,
        author_id: user.id,
        author_display_name: displayName,
      })
    if (err) {
      setError('Failed to post reply.')
      return
    }
    setReplyText('')
    setReplyToId(null)
    const counted = await fetchTotal()
    const nextPage = Math.max(1, Math.ceil(counted / PAGE_SIZE))
    pendingAnchor.current = counted
    setPage(nextPage)
  }

  const view = rows

  const onReplyTo = (id: string) => {
    setReplyToId(id)
    // focus composer
    const ta = document.getElementById('reply-textarea') as HTMLTextAreaElement | null
    ta?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => ta?.focus(), 150)
  }

  const gotoOriginal = async (commentId: string) => {
    if (!supabase) return
    // find the quoted row in current batch
    const inCurrent = view.findIndex((r) => r.id === commentId)
    if (inCurrent >= 0) {
      const anchorIndex = offset + inCurrent + 1
      const el = document.getElementById(`reply-${anchorIndex}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('highlight-accent-border')
        setTimeout(() => el.classList.remove('highlight-accent-border'), 1600)
        return
      }
    }
    // else, compute its 1-based index by counting replies up to its created_at
    const { data: row, error: err1 } = await supabase
      .from('forum_comments')
      .select('id, created_at')
      .eq('id', commentId)
      .maybeSingle()
    if (err1 || !row) return
    const { count } = await supabase
      .from('forum_comments')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', postId)
      .lte('created_at', row.created_at)
    const idx = count ?? 1
    const targetPage = Math.ceil(idx / PAGE_SIZE)
    pendingAnchor.current = idx
    setPage(targetPage)
  }

  if (!supabase) {
    return (
      <div className="text-sm text-muted">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable replies.</div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && !rows.length ? (
        <ol className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="animate-pulse rounded bg-highlight-low h-3 w-40" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="animate-pulse rounded bg-highlight-low h-4 w-full" />
                <div className="animate-pulse rounded bg-highlight-low h-4 w-11/12" />
              </div>
            </li>
          ))}
        </ol>
      ) : error ? (
        <p className="text-sm text-red-200">{error}</p>
      ) : !total ? (
        <p className="text-sm text-muted">No replies yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {view.map((r, i) => {
            const index = offset + i + 1
            const hasQuote = Boolean(r.parent_id)
            return (
              <li key={r.id} id={`reply-${index}`} className="rounded bg-surface px-4 py-3 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">
                    #{index} • {new Date(r.created_at).toLocaleString()} • {r.author_display_name ? (
                      <Link to="/u/$name" params={{ name: r.author_display_name }} className="hover:underline">
                        {r.author_display_name}
                      </Link>
                    ) : 'Anonymous'}
                  </div>
                  {user ? (
                    <button className="text-xs text-primary hover:underline" onClick={() => onReplyTo(r.id)}>
                      Reply
                    </button>
                  ) : null}
                </div>

                {hasQuote ? (
                  <QuotedBlock commentId={r.parent_id!} onViewOriginal={gotoOriginal} />
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
          <button className="rounded border border-border px-3 py-1 text-sm disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </button>
          <button className="rounded border border-border px-3 py-1 text-sm disabled:opacity-50" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
            Next
          </button>
        </div>
      </footer>

      <form onSubmit={onSubmit} className="rounded bg-surface p-4 flex flex-col gap-2">
        {replyToId ? <ReplyingToChip postId={postId} commentId={replyToId} onClear={() => setReplyToId(null)} /> : null}
        {user ? (
          <>
            <textarea
              id="reply-textarea"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={4}
              className="rounded border border-border bg-surface px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2 justify-end">
              <button type="submit" className="rounded bg-linear-to-r from-primary to-secondary text-base px-4 py-2 text-sm font-semibold">
                Post Reply
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Sign in to reply.</p>
        )}
      </form>
    </div>
  )
}

function ReplyingToChip({ postId, commentId, onClear }: { postId: string; commentId: string; onClear: () => void }) {
  const [meta, setMeta] = useState<{ created_at: string; author_display_name: string | null } | null>(null)

  useEffect(() => {
    let alive = true
    async function run() {
      if (!supabase) return
      const { data } = await supabase
        .from('forum_comments')
        .select('created_at, author_display_name')
        .eq('id', commentId)
        .maybeSingle()
      if (!alive) return
      setMeta(data ?? null)
    }
    run().catch(() => {})
    return () => { alive = false }
  }, [postId, commentId])

  if (!meta) return null
  return (
    <div className="rounded bg-surface p-2 text-xs flex items-center justify-between">
      <div className="truncate">Replying to • {new Date(meta.created_at).toLocaleString()} • {meta.author_display_name ?? 'Anonymous'}</div>
      <button type="button" className="ml-3 text-primary hover:underline" onClick={onClear}>Cancel</button>
    </div>
  )
}

function QuotedBlock({ commentId, onViewOriginal }: { commentId: string; onViewOriginal: (id: string) => void }) {
  const [row, setRow] = useState<ReplyRow | null>(null)

  useEffect(() => {
    let alive = true
    async function run() {
      if (!supabase) return
      const { data } = await supabase
        .from('forum_comments')
        .select('id, post_id, author_id, author_display_name, body, created_at, parent_id')
        .eq('id', commentId)
        .maybeSingle()
      if (!alive) return
      setRow((data as ReplyRow | null) ?? null)
    }
    run().catch(() => {})
    return () => { alive = false }
  }, [commentId])

  if (!row) return null
  const summary = `Quoted from • ${new Date(row.created_at).toLocaleString()} • ${row.author_display_name ?? 'Anonymous'} — “${snippet(row.body)}”`

  return (
    <details className="mt-2 rounded bg-surface">
      <summary className="cursor-pointer select-none list-none px-3 py-2 text-xs text-muted">{summary}</summary>
      <div className="px-3 pb-3 space-y-2">
        <blockquote className="text-sm text-subtle whitespace-pre-wrap">{row.body}</blockquote>
        <button type="button" className="text-xs text-primary hover:underline" onClick={() => onViewOriginal(row.id)}>
          View original
        </button>
      </div>
    </details>
  )
}

// Live updates for replies (subscribe to inserts/updates/deletes)
// Hook this into the component lifecycle
// We embed it here for clarity instead of a separate hook file
export function useRepliesRealtime(postId: string, onChange: () => void) {
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel(`forum_comments:post:${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_comments', filter: `post_id=eq.${postId}` }, () => {
        onChange()
      })
      .subscribe()
    return () => {
      supabase?.removeChannel(channel)
    }
  }, [postId, onChange])
}
