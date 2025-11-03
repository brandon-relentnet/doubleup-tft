import { createFileRoute } from '@tanstack/react-router'

import { findPostBySlug } from '../content/posts'
import DiscussionsLayout from '../components/DiscussionsLayout'

export const Route = createFileRoute('/discussions/$slug')({
  component: BlogPostPage,
})

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const { tag: activeTag } = Route.useSearch() as { tag?: string }
  const post = findPostBySlug(slug)

  if (!post) {
    return (
      <DiscussionsLayout
        backTo={{
          to: '/discussions',
          label: 'Back to discussions',
          search: { tag: activeTag },
        }}
        title="Post not found"
        description="That write-up either moved coops or hasn't been harvested yet."
      >
        <div className="rounded-xl border border-border bg-card px-6 py-8 text-muted-foreground">
          Double-check the URL or head back to the discussions page to browse
          our latest field notes and patch dispatches.
        </div>
      </DiscussionsLayout>
    )
  }

  const { title, summary, Content, date, tags, readTimeMinutes } = post

  const eyebrow = (
    <>
      <span>{dateFormatter.format(new Date(date))}</span>
      <span>{readTimeMinutes} min read</span>
      {tags?.length
        ? tags.map((badgeTag) => (
            <span
              key={badgeTag}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary"
            >
              {badgeTag}
            </span>
          ))
        : null}
    </>
  )

  return (
    <DiscussionsLayout
      backTo={{
        to: '/discussions',
        label: 'Back to discussions',
        search: { tag: activeTag },
      }}
      title={title}
      description={summary}
      eyebrow={eyebrow}
    >
      <article className="flex flex-col gap-6 text-text leading-7">
        <Content />
      </article>
    </DiscussionsLayout>
  )
}
