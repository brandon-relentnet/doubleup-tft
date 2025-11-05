import { Link, createFileRoute, useRouter  } from '@tanstack/react-router'
import { PenSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as motion from 'motion/react-client'
import type {ForumPostRow} from '@/lib/forumApi';
import DiscussionsLayout from '@/components/DiscussionsLayout'
import FetchErrorCard from '@/components/FetchErrorCard'
import {  fetchForumPosts } from '@/lib/forumApi'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'

export const Route = createFileRoute('/forum/')({
  component: ForumListingPage,
})

function ForumListingPage() {
  const router = useRouter()

  const supabaseClient = supabase
  const { user, loading } = useAuth()
  const [posts, setPosts] = useState<Array<ForumPostRow>>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseClient) return

    let isCancelled = false

    const fetchPosts = async () => {
      setLoadingPosts(true)
      setError(null)
      try {
        const rows = await fetchForumPosts()
        if (isCancelled) return
        setPosts(rows)
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
        <div className="min-h-screen" />
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
        <div className="min-h-screen" />
      ) : (
        <section className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ x: 5 }}
              whileTap={{ x: 10 }}
              transition={{
                y: { delay: index * 0.1 },
                opacity: { delay: index * 0.1 },
              }}
              className="rounded bg-surface px-6 py-5 group cursor-pointer"
              onClick={() =>
                router.navigate({
                  to: '/forum/$postId',
                  params: { postId: post.id },
                })
              }
            >
              <header className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-text">
                  {post.title}
                </h3>
                <span className="text-xs uppercase tracking-[0.2em] text-muted">
                  {new Date(post.created_at).toLocaleString()} •{' '}
                  {post.author_display_name ? (
                    <Link
                      to="/u/$name"
                      params={{ name: post.author_display_name }}
                      className="gradient-text"
                      onClick={(e) => e.stopPropagation()} // prevent triggering article click
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
                  className="text-sm font-medium text-subtle group-hover:text-accent hover:underline transition duration-200"
                  onClick={(e) => e.stopPropagation()} // also prevent article click
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
