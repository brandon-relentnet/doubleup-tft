import { useId } from 'react'
import type { SortOption } from './types'

type Props = {
  value: SortOption
  onChange: (next: SortOption) => void
}

const LABELS: Record<SortOption, string> = {
  oldest: 'Oldest',
  newest: 'Newest',
  mostActive: 'Most Active',
}

export default function SortMenu({ value, onChange }: Props) {
  const id = useId()
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-sm text-muted">Sort</label>
      <select
        id={id}
        className="rounded bg-surface border border-border px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        {(Object.keys(LABELS) as SortOption[]).map((opt) => (
          <option key={opt} value={opt}>
            {LABELS[opt]}
          </option>
        ))}
      </select>
    </div>
  )
}

