import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import DiscussionsLayout from '@/components/DiscussionsLayout'
// Using direct REST fetch for reliability here
import { Replies } from './Replies'

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
      const supaUrl = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined
      const supaKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined
      if (!supaUrl || !supaKey) {
        if (alive) {
          setError('Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
          setLoading(false)
        }
        return
      }
      const controller = new AbortController()
      const timer = window.setTimeout(() => controller.abort(), 12000)
      try {
        const rest = `${supaUrl}/rest/v1/forum_posts?id=eq.${postId}&select=id,title,body,created_at,author_display_name`
        const res = await fetch(rest, {
          headers: {
            apikey: supaKey,
            authorization: `Bearer ${supaKey}`,
          },
          signal: controller.signal,
        })
        if (!alive) return
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          setError(`Failed to load post (${res.status}). ${text || ''}`)
          setLoading(false)
          return
        }
        const rows = (await res.json()) as Array<PostRow>
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
      } finally {
        window.clearTimeout(timer)
      }
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
        <div className="rounded bg-surface px-6 py-6 text-sm text-red-200 space-y-3">
          <p>{error ?? 'Post not found.'}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded bg-highlight-low px-3 py-2 text-text hover:bg-highlight-med"
              onClick={() => {
                // trigger effect again by spoofing postId change (no-op here): just reset state
                setError(null)
                setPost(null)
                // Re-run effect by touching history state minimally
                window.dispatchEvent(new Event('focus'))
              }}
            >
              Try again
            </button>
            <Link to="/forum" className="text-primary hover:underline">← Back to forum</Link>
          </div>
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
