import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type ComingSoonImage = {
  src: string
  alt: string
  className?: string
}

type ComingSoonProps = {
  title: ReactNode
  lead?: ReactNode
  paragraphs?: Array<ReactNode>
  bulletHeading?: ReactNode
  bullets?: Array<ReactNode>
  closing?: ReactNode
  eyebrow?: ReactNode
  image?: ComingSoonImage
  layout?: 'split' | 'stacked'
  variant?: 'plain' | 'outlined'
  cardClassName?: string
  children?: ReactNode
}

export default function ComingSoon({
  title,
  lead,
  paragraphs,
  bulletHeading,
  bullets,
  closing,
  eyebrow,
  image,
  layout = 'split',
  variant = 'plain',
  cardClassName = '',
  children,
}: ComingSoonProps) {
  const mainClassName =
    layout === 'split'
      ? 'container flex flex-col items-center gap-8 lg:flex-row'
      : 'container px-4 py-16 sm:px-6 lg:px-8'

  const baseCardClass =
    variant === 'outlined'
      ? 'rounded-3xl border border-border bg-surface px-8 py-12 space-y-5'
      : 'rounded bg-surface px-8 py-12 space-y-5'

  const composedCardClass = [
    baseCardClass,
    layout === 'split' ? 'w-full max-w-2xl' : '',
    cardClassName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className={mainClassName}>
      <article className={composedCardClass}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtle">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>

        {lead ? <p className="text-muted">{lead}</p> : null}

        {paragraphs?.map((paragraph, index) => (
          <p key={`paragraph-${index}`} className="text-muted">
            {paragraph}
          </p>
        ))}

        {bulletHeading ? <p className="text-muted">{bulletHeading}</p> : null}

        {bullets?.length ? (
          <ul className="list-disc space-y-2 pl-5 text-muted">
            {bullets.map((bullet, index) => (
              <li key={`bullet-${index}`}>{bullet}</li>
            ))}
          </ul>
        ) : null}

        {closing ? <p className="text-muted">{closing}</p> : null}

        {children}
      </article>

      {layout === 'split' && image ? (
        <motion.img
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src={image.src}
          alt={image.alt}
          className={image.className ?? 'w-full max-w-sm lg:max-w-md h-auto'}
          loading="lazy"
        />
      ) : null}
    </main>
  )
}
