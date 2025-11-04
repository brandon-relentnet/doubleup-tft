import { createFileRoute, Link } from '@tanstack/react-router'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import FetchErrorCard from '@/components/FetchErrorCard'
import { fetchJson } from '@/lib/supaRest'
import { useEffect, useMemo, useState } from 'react'

type PostRow = { id: string; title: string; created_at: string }
type CommentRow = { id: string; post_id: string; created_at: string; body: string }

export const Route = createFileRoute('/u/$name')({
  component: UserProfilePage,
})

function UserProfilePage() {
  const { name } = Route.useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<{
    id: string | null
    display_name: string
    created_at: string | null
    bio: string | null
    avatar_url: string | null
  } | null>(null)
  const [posts, setPosts] = useState<PostRow[]>([])
  const [comments, setComments] = useState<CommentRow[]>([])

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true)
      setError(null)
      const supaUrl = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined
      const supaKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined
      if (!supaUrl || !supaKey) {
        setError('Profiles require Supabase credentials.')
        setLoading(false)
        return
      }
      try {
        // Try profiles match by display_name
        let authorId: string | null = null
        let display = name
        let createdAt: string | null = null
        let bio: string | null = null
        let avatar: string | null = null

        try {
          const { data: arr } = await fetchJson<Array<{
            user_id: string
            display_name: string
            created_at: string | null
            bio: string | null
            avatar_url: string | null
          }>>(
            `/rest/v1/profiles?display_name=eq.${encodeURIComponent(name)}&select=user_id,display_name,created_at,bio,avatar_url&limit=1`,
          )
          const prof = arr?.[0]
          if (prof) {
            authorId = prof.user_id
            display = prof.display_name ?? name
            createdAt = prof.created_at ?? null
            bio = prof.bio ?? null
            avatar = prof.avatar_url ?? null
          }
        } catch {}

        // Fallback to infer from forum posts/comments by display_name
        if (!authorId) {
          try {
            const { data: pArr } = await fetchJson<Array<{ author_id: string }>>(
              `/rest/v1/forum_posts?author_display_name=eq.${encodeURIComponent(name)}&select=author_id&order=created_at.desc&limit=1`,
            )
            authorId = pArr?.[0]?.author_id ?? null
          } catch {}
          if (!authorId) {
            try {
              const { data: cArr } = await fetchJson<Array<{ author_id: string }>>(
                `/rest/v1/forum_comments?author_display_name=eq.${encodeURIComponent(name)}&select=author_id&order=created_at.desc&limit=1`,
              )
              authorId = cArr?.[0]?.author_id ?? null
            } catch {}
          }
        }

        if (!authorId) {
          if (!alive) return
          setProfile({ id: null, display_name: display, created_at: createdAt, bio, avatar_url: avatar })
          setPosts([])
          setComments([])
          setLoading(false)
          return
        }

        const [{ data: postRows }, { data: commentRows }] = await Promise.all([
          fetchJson<PostRow[]>(
            `/rest/v1/forum_posts?author_id=eq.${authorId}&select=id,title,created_at&order=created_at.desc`,
          ),
          fetchJson<CommentRow[]>(
            `/rest/v1/forum_comments?author_id=eq.${authorId}&select=id,post_id,created_at,body&order=created_at.desc`,
          ),
        ])

        if (!alive) return
        setProfile({ id: authorId, display_name: display, created_at: createdAt, bio, avatar_url: avatar })
        setPosts(postRows)
        setComments(commentRows)
        setLoading(false)
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Unable to load profile')
        setLoading(false)
      }
    }
    load().catch(() => setLoading(false))
    return () => {
      alive = false
    }
  }, [name])

  const joinedLabel = useMemo(() => (profile?.created_at ? new Date(profile.created_at).toLocaleString() : 'Unknown'), [profile?.created_at])

  return (
    <DiscussionsLayout
      backTo={{ to: '/forum', label: 'Back to forum', search: { tag: undefined } }}
      title={profile?.display_name ?? name}
      description={
        <span className="text-sm text-muted">
          Joined: {joinedLabel}
        </span>
      }
      actions={null}
    >
      {error ? (
        <FetchErrorCard message={error} />
      ) : loading ? (
        <div className="flex flex-col gap-8">
          <section className="rounded bg-surface px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="animate-pulse rounded-full bg-highlight-low size-20" />
              <div className="animate-pulse rounded bg-highlight-low h-4 w-40" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="animate-pulse rounded bg-highlight-low h-5 w-24" />
              <div className="animate-pulse rounded bg-highlight-low h-4 w-full" />
              <div className="animate-pulse rounded bg-highlight-low h-4 w-10/12" />
            </div>
          </section>
          <section className="rounded bg-surface px-6 py-5">
            <div className="animate-pulse rounded bg-highlight-low h-5 w-16" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="animate-pulse rounded bg-highlight-low h-4 w-2/3" />
                  <div className="animate-pulse rounded bg-highlight-low h-3 w-40" />
                </div>
              ))}
            </div>
          </section>
          <section className="rounded bg-surface px-6 py-5">
            <div className="animate-pulse rounded bg-highlight-low h-5 w-24" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="animate-pulse rounded bg-highlight-low h-4 w-full" />
                  <div className="animate-pulse rounded bg-highlight-low h-3 w-40" />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Profile: avatar + bio */}
          <section className="rounded bg-surface px-6 py-5">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.display_name}'s avatar`}
                  className="size-20 rounded-full object-cover"
                />
              ) : (
                <div className="size-20 rounded-full bg-highlight-low flex items-center justify-center text-xl font-semibold text-text">
                  {(profile?.display_name?.[0] ?? '?').toUpperCase()}
                </div>
              )}
              <div className="text-sm text-muted">Joined: {joinedLabel}</div>
            </div>
            <h2 className="text-lg font-semibold mt-4 mb-2">About</h2>
            {profile?.bio ? (
              <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted">No bio yet.</p>
            )}
          </section>

          {/* Posts */}
          <section className="rounded bg-surface px-6 py-5">
            <h2 className="text-lg font-semibold mb-4">Posts</h2>
            {!posts.length ? (
              <p className="text-sm text-muted">No posts yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4">
                    <div>
                      <Link to="/forum/$postId" params={{ postId: p.id }} className="font-medium hover:underline">
                        {p.title}
                      </Link>
                      <div className="text-xs text-muted">{new Date(p.created_at).toLocaleString()}</div>
                    </div>
                    <Link to="/forum/$postId" params={{ postId: p.id }} className="text-sm text-primary hover:underline">
                      Open →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Comments */}
          <section className="rounded bg-surface px-6 py-5">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            {!comments.length ? (
              <p className="text-sm text-muted">No comments yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {comments.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm line-clamp-2 max-w-[60ch] whitespace-pre-wrap">{c.body}</p>
                      <div className="text-xs text-muted">{new Date(c.created_at).toLocaleString()}</div>
                    </div>
                    <Link to="/forum/$postId" params={{ postId: c.post_id }} search={{ c: c.id }} className="text-sm text-primary hover:underline">
                      View in context →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </DiscussionsLayout>
  )
}
