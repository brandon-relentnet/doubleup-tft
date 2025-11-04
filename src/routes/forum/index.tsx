import { createFileRoute, Link } from '@tanstack/react-router'
import { PenSquare } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'

type ForumPost = {
  id: string
  title: string
  body: string
  created_at: string
  author_display_name: string | null
}

export const Route = createFileRoute('/forum/')({
  component: ForumListingPage,
})

function ForumListingPage() {
  const supabaseClient = supabase
  const { user, loading } = useAuth()
  const [posts, setPosts] = useState<Array<ForumPost>>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reqIdRef = useRef(0)

  useEffect(() => {
    if (!supabaseClient) return

    let isCancelled = false

    const fetchOnce = async () => {
      const myId = ++reqIdRef.current
      setLoadingPosts(true)
      setError(null)
      let timeoutHandle: number | null = null
      try {
        await new Promise<void>((resolve, reject) => {
          timeoutHandle = window.setTimeout(() => {
            if (myId === reqIdRef.current) {
              reject(new Error('timeout'))
            }
          }, 8000)
          ;(async () => {
            const { data, error: fetchError } = await supabaseClient
              .from('forum_posts')
              .select(
                `id, title, body, created_at, author_display_name`,
              )
              .order('created_at', { ascending: false })
            if (fetchError) {
              reject(fetchError)
              return
            }
            if (isCancelled || myId !== reqIdRef.current) return
            setPosts(
              (data ?? []).map((row) => ({
                id: row.id,
                title: row.title,
                body: row.body,
                created_at: row.created_at,
                author_display_name: row.author_display_name ?? null,
              })),
            )
            resolve()
          })().catch(reject)
        })
      } catch (e) {
        if (!isCancelled && myId === reqIdRef.current) {
          setError('Unable to load community posts. Check your connection and try again.')
        }
      } finally {
        if (timeoutHandle) window.clearTimeout(timeoutHandle)
        if (!isCancelled && myId === reqIdRef.current) setLoadingPosts(false)
      }
    }

    fetchOnce().catch(() => {
      if (isCancelled) return
      setError('Unable to load community posts. Check your connection and try again.')
      setLoadingPosts(false)
    })

    // Realtime: keep list fresh on inserts/updates/deletes
    const channel = supabaseClient
      .channel('forum_posts:list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_posts' },
        () => {
          // only refresh if not currently loading
          if (!loadingPosts) fetchOnce().catch(() => {})
        },
      )
      .subscribe()

    // Refresh on window focus
    const onFocus = () => {
      if (!loadingPosts) fetchOnce().catch(() => {})
    }
    const onOnline = () => {
      if (!loadingPosts) fetchOnce().catch(() => {})
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        if (!loadingPosts) fetchOnce().catch(() => {})
      }
    }
    window.addEventListener('focus', onFocus)
    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      isCancelled = true
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisible)
      supabaseClient.removeChannel(channel)
    }
  }, [supabaseClient])

  return (
    <DiscussionsLayout
      title="Community Forum"
      description="Browse farm-fresh thoughts from fellow Free-Range tacticians. Share what you have learned, dissect a duo scramble, or highlight a clever pivot. We will expand these tools as the coop grows."
      actions={
        user ? (
          <Link
            to="/forum/create-post"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:bg-muted/40"
          >
            Write a post
          </Link>
        ) : null
      }
    >
      {!supabaseClient ? (
        <section className="rounded bg-surface px-6 py-6 text-sm text-muted-foreground">
          Set <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to enable community posts.
        </section>
      ) : loadingPosts ? (
        <p className="text-sm text-muted">Loading posts…</p>
      ) : error ? (
        <div className="rounded bg-surface px-6 py-6 text-sm text-red-200 space-y-3">
          <p>{error}</p>
          <button
            type="button"
            className="rounded bg-highlight-low px-3 py-2 text-text hover:bg-highlight-med"
            onClick={() => {
              setError(null)
              setLoadingPosts(true)
              // trigger reliable fetch again
              ;(async () => {
                try {
                  const event = new Event('focus')
                  window.dispatchEvent(event)
                } catch {}
              })()
            }}
          >
            Try again
          </button>
        </div>
      ) : !posts.length ? (
        <p className="text-sm text-muted">
          No community posts yet. Be the first to log a Free-Range lesson.
        </p>
      ) : (
        <section className="flex flex-col gap-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded bg-surface px-6 py-5">
              <header className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-text">
                  <Link
                    to="/forum/$postId"
                    params={{ postId: post.id }}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </h3>
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  {new Date(post.created_at).toLocaleString()} •{' '}
                  {post.author_display_name ? (
                    <Link
                      to="/u/$name"
                      params={{ name: post.author_display_name }}
                      className="hover:underline"
                    >
                      {post.author_display_name}
                    </Link>
                  ) : (
                    'Anonymous tactician'
                  )}
                </span>
              </header>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text">
                {post.body}
              </p>
              <div className="mt-3">
                <Link
                  to="/forum/$postId"
                  params={{ postId: post.id }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Open discussion →
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}

      {user && !loading ? (
        <Link
          to="/forum/create-post"
          className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-1"
          aria-label="Write a community post"
        >
          <PenSquare className="size-6" />
        </Link>
      ) : null}
    </DiscussionsLayout>
  )
}
