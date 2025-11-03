import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import { supabase } from '@/lib/supabaseClient'
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
      if (!supabase) return
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('forum_posts')
        .select('id, title, body, created_at, author_display_name')
        .eq('id', postId)
        .maybeSingle()
      if (!alive) return
      if (err) {
        setError('Unable to load post.')
        setLoading(false)
        return
      }
      setPost((data as PostRow | null) ?? null)
      setLoading(false)
    }
    run().catch((e) => setError(e instanceof Error ? e.message : 'Unable to load'))
    return () => {
      alive = false
    }
  }, [postId])

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="text-sm text-muted">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable forum posts.</p>
      </div>
    )
  }

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
        <p className="text-sm text-red-200">{error ?? 'Post not found.'}</p>
        <div className="mt-4">
          <Link to="/forum" className="text-primary hover:underline">← Back to forum</Link>
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
