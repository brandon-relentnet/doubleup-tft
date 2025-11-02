import type { JSX, ReactNode } from 'react'

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

type HeadingProps = {
  level?: 1 | 2 | 3 | 4
  className?: string
  children: ReactNode
}

const headingTags: Record<Required<HeadingProps>['level'], keyof JSX.IntrinsicElements> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
}

const headingStyles: Record<Required<HeadingProps>['level'], string> = {
  1: 'text-4xl sm:text-5xl font-semibold leading-tight w-fit tracking-tight gradient-text',
  2: 'text-2xl sm:text-3xl font-semibold tracking-tight w-fit gradient-text',
  3: 'text-xl font-semibold gradient-text w-fit',
  4: 'text-lg font-semibold gradient-text w-fit',
}

export function Heading({ level = 2, className, children }: HeadingProps) {
  const Tag = headingTags[level]
  const base = headingStyles[level]
  return <Tag className={classNames(base, className)}>{children}</Tag>
}

type ParagraphProps = {
  className?: string
  children: ReactNode
}

export function Paragraph({ className, children }: ParagraphProps) {
  return (
    <p className={classNames('text-text leading-7', className)}>{children}</p>
  )
}

type LeadProps = {
  className?: string
  children: ReactNode
}

export function Lead({ className, children }: LeadProps) {
  return (
    <blockquote
      className={classNames(
        'text-lg text-text font-semibold bg-highlight-low rounded p-4 italic',
        className,
      )}
    >
      "{children}"
    </blockquote>
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
    ? 'list-decimal space-y-2 pl-5 text-text leading-7'
    : 'list-disc space-y-2 pl-5 text-text leading-7'
  return <Tag className={classNames(base, className)}>{children}</Tag>
}

type ListItemProps = {
  className?: string
  children: ReactNode
}

export function ListItem({ className, children }: ListItemProps) {
  return <li className={classNames(className)}>{children}</li>
}
