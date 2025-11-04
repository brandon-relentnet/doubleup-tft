import { createFileRoute, Link } from '@tanstack/react-router'
import DiscussionsLayout from '@/components/DiscussionsLayout'
import { supabase } from '@/lib/supabaseClient'
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
      if (!supabase) {
        setError('Profiles require Supabase credentials.')
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        // Try profiles table first
        const { data: prof } = await supabase
          .from('profiles')
          .select('user_id, display_name, created_at, bio, avatar_url')
          .eq('display_name', name)
          .maybeSingle()

        let authorId: string | null = (prof as any)?.user_id ?? null
        let display = prof?.display_name ?? name
        let createdAt: string | null = (prof?.created_at as string | null) ?? null
        let bio: string | null = (prof?.bio as string | null) ?? null
        let avatar: string | null = (prof?.avatar_url as string | null) ?? null

        if (!authorId) {
          // Fallback: infer from latest post/comment by display name
          const { data: postAuthor } = await supabase
            .from('forum_posts')
            .select('author_id')
            .eq('author_display_name', name)
            .order('created_at', { ascending: false })
            .limit(1)
          authorId = postAuthor?.[0]?.author_id ?? null
          if (!authorId) {
            const { data: commentAuthor } = await supabase
              .from('forum_comments')
              .select('author_id')
              .eq('author_display_name', name)
              .order('created_at', { ascending: false })
              .limit(1)
            authorId = commentAuthor?.[0]?.author_id ?? null
          }
        }

        if (!authorId) {
          setProfile({ id: null, display_name: display, created_at: createdAt, bio, avatar_url: avatar })
          setPosts([])
          setComments([])
          setLoading(false)
          return
        }

        // Fetch authored posts/comments
        const [{ data: postRows }, { data: commentRows }] = await Promise.all([
          supabase
            .from('forum_posts')
            .select('id, title, created_at')
            .eq('author_id', authorId)
            .order('created_at', { ascending: false }),
          supabase
            .from('forum_comments')
            .select('id, post_id, created_at, body')
            .eq('author_id', authorId)
            .order('created_at', { ascending: false }),
        ])

        if (!alive) return
        setProfile({ id: authorId, display_name: display, created_at: createdAt, bio, avatar_url: avatar })
        setPosts((postRows as PostRow[]) ?? [])
        setComments((commentRows as CommentRow[]) ?? [])
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
        <div className="rounded bg-surface px-6 py-6 text-sm text-red-200">{error}</div>
      ) : loading ? (
        <p className="text-sm text-muted">Loading profile…</p>
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
