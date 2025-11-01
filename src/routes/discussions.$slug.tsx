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
  const { tag } = Route.useSearch()
  const post = findPostBySlug(slug)

  if (!post) {
    return (
      <DiscussionsLayout
        backTo={{
          to: '/discussions',
          label: 'Back to discussions',
          search: { tag },
        }}
        title="Post not found"
        description="The blog entry you are looking for does not exist or has been moved."
      >
        <div className="rounded-xl border border-border bg-card px-6 py-8 text-muted-foreground">
          Double-check the URL or head back to the discussions page to browse
          the latest strategy notes.
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
        ? tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary"
            >
              {tag}
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
        search: { tag },
      }}
      title={title}
      description={summary}
      eyebrow={eyebrow}
    >
      <article className="flex flex-col gap-6 text-base leading-7">
        <Content />
      </article>
    </DiscussionsLayout>
  )
}
