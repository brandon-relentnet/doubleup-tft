import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import DiscussionsLayout from '../../components/DiscussionsLayout'
import { listPosts } from '../../content/posts'
import { useAuth } from '@/components/AuthProvider'

export const Route = createFileRoute('/discussions/')({
  component: DiscussionsIndexPage,
})

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

function DiscussionsIndexPage() {
  const posts = listPosts()
  const { tag: activeTag } = Route.useSearch() as { tag?: string }
  const navigate = Route.useNavigate()
  useAuth()
  const allTags = useMemo(() => {
    const unique = new Set<string>()
    posts.forEach((post) => post.tags?.forEach((t) => unique.add(t)))
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [posts])

  const filteredPosts = activeTag
    ? posts.filter((post) => post.tags?.includes(activeTag))
    : posts

  const actionButtons = (
    <div className="flex flex-wrap gap-2">
      {activeTag ? (
        <button
          type="button"
          onClick={() =>
            navigate({
              to: '/discussions',
              search: () => ({ tag: undefined }),
              replace: true,
            })
          }
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted/40"
        >
          Clear filter
        </button>
      ) : null}
    </div>
  )

  return (
    <DiscussionsLayout
      title="Discussions"
      description="Field-tested essays, patch dispatches, and duo coordination drills—all written in composable React blocks so we can season them with live data and interactivity whenever the meta shifts."
      actions={actionButtons}
    >
      {allTags.length ? (
        <div className="flex flex-wrap gap-2">
          {allTags.map((availableTag) => {
            const isActive = availableTag === activeTag
            return (
              <Link
                key={availableTag}
                to="/discussions"
                search={{ tag: isActive ? undefined : availableTag }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:bg-muted/40'
                }`}
              >
                #{availableTag}
              </Link>
            )
          })}
        </div>
      ) : null}

      <section className="flex flex-col gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-xl border border-border bg-card px-6 py-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-card/80"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>{dateFormatter.format(new Date(post.date))}</span>
              <span>{post.readTimeMinutes} min read</span>
              {post.tags?.length ? (
                <span className="flex gap-2">
                  {post.tags.map((badgeTag) => (
                    <span
                      key={badgeTag}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary"
                    >
                      {badgeTag}
                    </span>
                  ))}
                </span>
              ) : null}
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {post.title}
            </h2>
            <p className="mt-2 text-muted">{post.summary}</p>

            <div className="mt-4">
              <Link
                to="/discussions/$slug"
                params={{ slug: post.slug }}
                search={{ tag: activeTag }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Read post →
              </Link>
            </div>
          </article>
        ))}
        {!filteredPosts.length ? (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-muted-foreground">
            No posts match that tag yet. Clear the filter or stop by after the
            next harvest—we log every patch once the fields settle.
          </div>
        ) : null}
      </section>
    </DiscussionsLayout>
  )
}
