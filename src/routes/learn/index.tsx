import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import LearnLayout from '../../components/LearnLayout'
import { listPosts } from '../../content/posts'

export const Route = createFileRoute('/learn/')({
  component: LearnIndexPage,
})

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

function LearnIndexPage() {
  const posts = listPosts()
  const { tag } = Route.useSearch()
  const navigate = Route.useNavigate()
  const allTags = useMemo(() => {
    const unique = new Set<string>()
    posts.forEach((post) => post.tags?.forEach((t) => unique.add(t)))
    return Array.from(unique).sort((a, b) => a.localeCompare(b))
  }, [posts])

  const filteredPosts = tag
    ? posts.filter((post) => post.tags?.includes(tag))
    : posts

  return (
    <LearnLayout
      title="Learn"
      description="Long-form breakdowns, patch reflections, and cheat sheets. Everything here is written in React components so it stays easy to restyle or swap in interactive bits later."
      actions={
        tag ? (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: '/learn',
                search: () => ({ tag: undefined }),
                replace: true,
              })
            }
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted/40"
          >
            Clear filter
          </button>
        ) : null
      }
    >
      {allTags.length ? (
        <div className="flex flex-wrap gap-2">
          {allTags.map((availableTag) => {
            const isActive = availableTag === tag
            return (
              <Link
                key={availableTag}
                to="/learn"
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
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              ) : null}
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {post.title}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {post.summary}
            </p>

            <div className="mt-4">
              <Link
                to="/learn/$slug"
                params={{ slug: post.slug }}
                search={{ tag }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Read post →
              </Link>
            </div>
          </article>
        ))}
        {!filteredPosts.length ? (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-muted-foreground">
            No posts match this tag yet. Clear the filter or check back after
            the next patch notes drop.
          </div>
        ) : null}
      </section>
    </LearnLayout>
  )
}

