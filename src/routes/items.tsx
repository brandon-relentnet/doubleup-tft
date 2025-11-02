import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/items')({
  component: ItemsPage,
})

function ItemsPage() {
  return (
    <main className="container px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-surface px-8 py-12 shadow-lg shadow-black/10">
        <h1 className="text-3xl font-extrabold tracking-tight">Items directory coming soon</h1>
        <p className="mt-4 text-muted">
          Once auth and content pipelines are in place, we will populate this page with fully editable
          item breakdowns straight from the coop.
        </p>
      </div>
    </main>
  )
}
