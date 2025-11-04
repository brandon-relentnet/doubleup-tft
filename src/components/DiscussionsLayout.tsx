import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type DiscussionsLayoutProps = {
  title: string
  description?: ReactNode
  children: ReactNode
  backTo?: {
    to: string
    label?: string
    search: { tag?: string }
  }
  eyebrow?: ReactNode
  actions?: ReactNode
}

export default function DiscussionsLayout({
  title,
  description,
  backTo,
  eyebrow,
  actions,
  children,
}: DiscussionsLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 sm:gap-10">
      {backTo ? (
        <nav className="text-sm text-muted-foreground">
          <Link
            to={backTo.to}
            search={backTo.search}
            className="hover:underline"
          >
            ← {backTo.label ?? 'Back'}
          </Link>
        </nav>
      ) : null}

      <header className="space-y-4 text-balance">
        {eyebrow ? (
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl gradient-text w-fit">
              {title}
            </h1>
            {description ? (
              <div className="text-lg text-muted-foreground max-w-xl">
                {description}
              </div>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </header>

      <main className="flex flex-col gap-8 sm:gap-10">{children}</main>
    </div>
  )
}
