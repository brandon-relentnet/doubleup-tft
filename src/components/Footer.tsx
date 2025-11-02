import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { listPosts } from '../content/posts'

type FooterLink = {
  label: string
  to: string
  search?: Record<string, unknown>
  params?: Record<string, string>
  hint?: string
  summary?: string
}

const PRIMARY_LINKS: Array<FooterLink> = [
  { label: 'Home', to: '/' },
  { label: 'Discussions', to: '/discussions', search: { tag: undefined } },
  { label: 'Items', to: '/items' },
  { label: 'Strategies', to: '/strategies' },
  { label: 'Units', to: '/units' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const topDiscussions = listPosts()
    .slice(0, 3)
    .map((post) => ({
      label: post.title,
      to: '/discussions/$slug',
      params: { slug: post.slug },
      search: { tag: undefined },
      hint: `${post.readTimeMinutes} min read • ${new Date(
        post.date,
      ).toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
      })}`,
      summary: post.summary,
    }))

  return (
    <footer className="bg-base">
      <div className="container flex flex-col gap-14 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)] text-center lg:text-left">
          <div className="gap-10 flex flex-col-reverse lg:flex-col">
            <nav>
              <p className="text-xs uppercase tracking-[0.35em] font-bold gradient-text w-fit mx-auto lg:mx-0">
                Navigation
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                {PRIMARY_LINKS.map(({ label, to, search, params }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      search={search}
                      params={params}
                      className="transition hover:text-text"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col items-center lg:items-start gap-3 mb-2 justify-center lg:justify-start">
              <div className="flex items-center gap-4 lg:flex-row flex-col">
                <img src="/blt_solo.png" alt="BLTFT icon" className="size-12" />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] font-bold gradient-text w-fit mx-auto lg:mx-0">
                    BLTFT
                  </p>
                  <p className="text-lg font-semibold text-text">
                    Free-Range TFT
                  </p>
                </div>
              </div>
              <p className="max-w-sm text-sm text-subtle mx-auto lg:mx-0">
                We raise boards the slow way. No factory builds. Scout with
                intent, season every move, and share the harvest with the coop.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs mb-6 uppercase tracking-[0.35em] font-bold gradient-text w-fit mx-auto lg:mx-0">
              Top Discussions
            </p>
            <ul className="text-sm flex flex-col gap-2 text-muted">
              {topDiscussions.map(
                ({ label, to, search, params, hint, summary }) => (
                  <Link to={to} key={label} search={search} params={params}>
                    <motion.li
                      whileHover={{ x: 10 }}
                      whileTap={{ x: 20 }}
                      className="bg-surface p-4 rounded group"
                    >
                      <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-text transition group-hover:text-accent">
                          {label}
                        </h1>
                        {summary ? (
                          <p className="text-sm text-subtle leading-relaxed">
                            {summary}
                          </p>
                        ) : null}
                        {hint ? (
                          <p className="text-xs uppercase tracking-[0.2em] text-muted">
                            {hint}
                          </p>
                        ) : null}
                      </div>
                    </motion.li>
                  </Link>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="bg-linear-to-r from-primary to-secondary h-1 w-full rounded-full" />

        <div className="flex flex-col gap-2 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} BLTFT.{' '}
            <span className="italic text-muted">
              Raised in open pastures with equal parts patience and grit.
            </span>
          </p>
          <p>
            We play for the{' '}
            <span className="font-semibold gradient-text">Flavor.</span>{' '}
          </p>
        </div>
      </div>
    </footer>
  )
}
