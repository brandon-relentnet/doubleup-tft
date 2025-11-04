import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import * as motion from 'motion/react-client'

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
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl gradient-text w-fit"
            >
              {title}
            </motion.h1>
            {description ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-xl"
              >
                {description}
              </motion.div>
            ) : null}
          </div>
          {actions ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="shrink-0"
            >
              {actions}
            </motion.div>
          ) : null}
        </div>
      </header>

      <main className="flex flex-col gap-8 sm:gap-10">{children}</main>
    </div>
  )
}
