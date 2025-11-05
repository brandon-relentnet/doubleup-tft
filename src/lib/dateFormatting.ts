const shortFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const longFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatPostDate(
  input: string | number | Date,
  variant: 'short' | 'long' = 'short',
) {
  const formatter = variant === 'long' ? longFormatter : shortFormatter
  return formatter.format(new Date(input))
}

export function formatDateTime(input: string | number | Date) {
  return new Date(input).toLocaleString()
}
