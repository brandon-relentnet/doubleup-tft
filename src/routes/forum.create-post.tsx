import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabaseClient'

export const Route = createFileRoute('/forum/create-post')({
  component: CreatePostPage,
  beforeLoad: () => {
    if (!supabase) return
  },
})

function CreatePostPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(
    () => title.trim().length > 0 && body.trim().length > 0,
    [title, body],
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !user || !canSubmit) return
    setSubmitting(true)
    setError(null)
    const displayName =
      typeof user.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name
        : null
    const { data, error: err } = await supabase
      .from('forum_posts')
      .insert({
        title: title.trim(),
        body: body.trim(),
        author_id: user.id,
        author_display_name: displayName,
      })
      .select('id')
      .single()
    if (err) {
      setError('Failed to create post.')
      setSubmitting(false)
      return
    }
    setSubmitting(false)
    navigate({ to: '/forum/$postId', params: { postId: data!.id } })
  }

  return (
    <DiscussionsLayout
      backTo={{ to: '/forum', label: 'Back to forum', search: { tag: undefined } }}
      title="Create a new post"
      description="Share a topic or question to start a discussion."
    >
      {!supabase ? (
        <section className="rounded bg-surface px-6 py-6 text-sm text-muted-foreground">
          Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable posting.
        </section>
      ) : !user ? (
        <section className="rounded bg-surface px-6 py-6 text-sm text-muted-foreground">
          Please sign in to create a post.
        </section>
      ) : (
        <form onSubmit={onSubmit} className="rounded bg-surface p-4 flex flex-col gap-3">
          {error ? (
            <p className="text-sm text-red-200">{error}</p>
          ) : null}
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
            rows={8}
            className="rounded border border-border bg-surface px-3 py-2 text-sm"
          />
          <div className="flex items-center justify-end gap-2">
            <Link to="/forum" className="rounded border border-border px-3 py-2 text-sm hover:bg-highlight-low">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="rounded bg-linear-to-r from-primary to-secondary text-base px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </form>
      )}
    </DiscussionsLayout>
  )
}
