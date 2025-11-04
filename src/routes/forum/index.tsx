import { createFileRoute, Link } from '@tanstack/react-router'
import { PenSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import FetchErrorCard from '@/components/FetchErrorCard'
import { fetchJson } from '@/lib/supaRest'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'
import * as motion from 'motion/react-client'

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

  useEffect(() => {
    if (!supabaseClient) return

    let isCancelled = false

    const fetchPosts = async () => {
      setLoadingPosts(true)
      setError(null)
      try {
        const { data: rows } = await fetchJson<Array<any>>(
          '/rest/v1/forum_posts?select=id,title,body,created_at,author_display_name&order=created_at.desc',
        )
        if (isCancelled) return
        setPosts(
          (rows ?? []).map((row) => ({
            id: row.id,
            title: row.title,
            body: row.body,
            created_at: row.created_at,
            author_display_name: row.author_display_name ?? null,
          })),
        )
      } catch (e) {
        if (!isCancelled) {
          setError(
            e instanceof Error ? e.message : 'Network error loading posts.',
          )
        }
      } finally {
        if (!isCancelled) setLoadingPosts(false)
      }
    }

    fetchPosts().catch((fetchError) => {
      if (isCancelled) return
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load community posts right now. Please try again later.',
      )
      setLoadingPosts(false)
    })

    // Realtime: keep list fresh on inserts/updates/deletes
    // Optional realtime refresh (skip if it causes issues). We can re-add later.
    const channel = null as any

    // Refresh on window focus
    const onFocus = () => fetchPosts().catch(() => {})
    window.addEventListener('focus', onFocus)

    return () => {
      isCancelled = true
      window.removeEventListener('focus', onFocus)
      if (channel) supabaseClient.removeChannel(channel)
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
        <p className="text-sm text-muted min-h-screen text-center">
          Loading posts…
        </p>
      ) : error ? (
        <FetchErrorCard
          message={error}
          onRetry={() => {
            setError(null)
            const e = new Event('focus')
            window.dispatchEvent(e)
          }}
        />
      ) : !posts.length ? (
        <p className="text-sm text-muted">
          No community posts yet. Be the first to log a Free-Range lesson.
        </p>
      ) : (
        <section className="flex flex-col gap-4">
          {posts.map((post) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ x: 5 }}
              whileTap={{ x: 10 }}
              key={post.id}
              transition={{
                delay: posts.findIndex((p) => p.id === post.id) * 0.06,
              }}
              className="rounded bg-surface px-6 py-5"
            >
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
            </motion.article>
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
