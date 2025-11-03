export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-highlight-low ${className}`} />
}

export function SkeletonLines({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`h-4 w-full ${i ? 'mt-2' : ''}`} />
      ))}
    </div>
  )
}

