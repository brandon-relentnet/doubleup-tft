export default function FetchErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded bg-surface px-6 py-6 text-sm text-red-200 space-y-3">
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="rounded bg-highlight-low px-3 py-2 text-text hover:bg-highlight-med"
          onClick={onRetry}
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

