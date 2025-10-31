import type { ReactNode, JSX } from 'react'

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

type HeadingProps = {
  level?: 1 | 2 | 3 | 4
  className?: string
  children: ReactNode
}

export function Heading({ level = 2, className, children }: HeadingProps) {
  const tagMap: Record<1 | 2 | 3 | 4, keyof JSX.IntrinsicElements> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
  }
  const Tag: keyof JSX.IntrinsicElements = tagMap[level] ?? 'h2'
  const base =
    {
      1: 'text-4xl sm:text-5xl font-semibold leading-tight tracking-tight',
      2: 'text-2xl sm:text-3xl font-semibold tracking-tight',
      3: 'text-xl font-semibold',
      4: 'text-lg font-semibold',
    }[level] ?? 'text-2xl font-semibold'
  return <Tag className={classNames(base, className)}>{children}</Tag>
}

type ParagraphProps = {
  className?: string
  children: ReactNode
}

export function Paragraph({ className, children }: ParagraphProps) {
  return (
    <p className={classNames('text-base leading-7 text-foreground/90', className)}>
      {children}
    </p>
  )
}

type LeadProps = {
  className?: string
  children: ReactNode
}

export function Lead({ className, children }: LeadProps) {
  return (
    <p className={classNames('text-lg text-muted-foreground', className)}>
      {children}
    </p>
  )
}

type ListProps = {
  ordered?: boolean
  className?: string
  children: ReactNode
}

export function List({ ordered, className, children }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul'
  const base = ordered
    ? 'list-decimal space-y-2 pl-5 text-base leading-7 text-foreground/90'
    : 'list-disc space-y-2 pl-5 text-base leading-7 text-foreground/90'
  return <Tag className={classNames(base, className)}>{children}</Tag>
}

type ListItemProps = {
  className?: string
  children: ReactNode
}

export function ListItem({ className, children }: ListItemProps) {
  return <li className={classNames(className)}>{children}</li>
}
