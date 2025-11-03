import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'
import DiscussionsLayout from '@/components/DiscussionsLayout'

type AsyncStatus = 'idle' | 'submitting'

export const Route = createFileRoute('/discussions/forum/create-post')({
  component: ForumCreatePostPage,
})

function ForumCreatePostPage() {
  const supabaseClient = supabase
  const { user, loading } = useAuth()
  const navigate = Route.useNavigate()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    title.trim().length > 3 &&
    body.trim().length > 10 &&
    !!user &&
    status !== 'submitting'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!supabaseClient) {
      setError(
        'Supabase is not configured. Provide credentials to enable community posts.',
      )
      return
    }

    if (!canSubmit) return

    setStatus('submitting')
    setError(null)

    try {
      const trimmedTitle = title.trim()
      const trimmedBody = body.trim()
      const displayName =
        typeof user?.user_metadata?.display_name === 'string'
          ? user.user_metadata.display_name.trim()
          : null

      const { error: insertError } = await supabaseClient
        .from('forum_posts')
        .insert({
          title: trimmedTitle,
          body: trimmedBody,
          author_id: user?.id ?? null,
          author_display_name: displayName,
        })

      if (insertError) {
        throw insertError
      }

      setTitle('')
      setBody('')

      navigate({
        to: '/discussions/forum',
        search: { tag: undefined },
      })
    } catch (insertError) {
      setError(
        insertError instanceof Error
          ? insertError.message
          : 'Unable to publish your post. Please try again.',
      )
    } finally {
      setStatus('idle')
    }
  }

  const disabledReason =
    !supabaseClient
      ? 'Supabase not configured.'
      : loading
        ? 'Checking auth status…'
        : !user
          ? 'You must sign in before posting.'
          : !canSubmit
            ? 'Add a title and meaningful body before publishing.'
            : null

  return (
    <DiscussionsLayout
      title="Share a community post"
      description="Log a Free-Range lesson, highlight a duo pivot, or ask for thoughtful feedback. We’ll keep iterating on the format as the coop grows."
      backTo={{
        to: '/discussions/forum',
        label: 'Back to forum',
        search: { tag: undefined },
      }}
    >
      {!supabaseClient ? (
        <section className="rounded border border-border bg-card px-6 py-6 text-sm text-muted-foreground">
          Set <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to enable community posts.
        </section>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-3xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="community-title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="community-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Free-Range streak lessons, Stage 5 pivot notes…"
            className="w-full rounded border border-border bg-base px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            disabled={status === 'submitting' || !supabaseClient}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="community-body" className="text-sm font-medium">
            Body
          </label>
          <textarea
            id="community-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share board states, duel coordination tips, or lessons learned while playing Free-Range TFT…"
            className="min-h-[220px] w-full rounded border border-border bg-base px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            disabled={status === 'submitting' || !supabaseClient}
            required
          />
          <p className="text-xs text-muted">
            Tip: include specific rounds, shop states, or item choices so others
            can learn from your process. Free-Range means thoughtful context.
          </p>
        </div>

        {error ? (
          <p className="rounded bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        {disabledReason ? (
          <p className="text-xs text-muted italic">{disabledReason}</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 rounded bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-base transition hover:-translate-y-0.5 duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Publishing…' : 'Publish post'}
          </button>
          <button
          type="button"
          onClick={() =>
            navigate({
              to: '/discussions/forum',
              search: { tag: undefined },
            })
          }
            className="inline-flex items-center justify-center gap-2 rounded border border-border px-5 py-3 text-sm font-semibold text-text transition hover:-translate-y-0.5 duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </DiscussionsLayout>
  )
}
