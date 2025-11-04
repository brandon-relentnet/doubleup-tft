import type { ReactNode } from 'react'

type SupabaseConfigNoticeProps = {
  feature?: string
  variant?: 'card' | 'inline'
  className?: string
  children?: ReactNode
}

export default function SupabaseConfigNotice({
  feature,
  variant = 'card',
  className = '',
  children,
}: SupabaseConfigNoticeProps) {
  const baseClass =
    variant === 'card'
      ? 'rounded bg-surface px-6 py-6 text-sm text-muted-foreground'
      : 'text-sm text-muted'

  const message =
    children ??
    `Set \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` to enable ${
      feature ?? 'Supabase-powered features'
    }.`

  return <div className={[baseClass, className].filter(Boolean).join(' ')}>{message}</div>
}
