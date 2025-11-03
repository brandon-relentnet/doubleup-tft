import { createFileRoute } from '@tanstack/react-router'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/units')({
  component: UnitsPage,
})

function UnitsPage() {
  usePageMeta({
    title: 'Unit Ledger & Trait Pairings | DoubleUp TFT',
    description:
      'Coming soon: unit spotlights, frontline pairings, and trait mashups that keep Free-Range Double Up boards humming.',
  })

  return (
    <main className="container px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-surface px-8 py-12 shadow-lg shadow-black/10 space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Livestock ledger in progress
        </h1>
        <p className="text-muted">
          We&apos;re cataloging carries, frontliners, and tech units so you know which
          champions to pasture together when the shops get spicy.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Quick-read summaries for marquee units by cost and role.</li>
          <li>Trait mashups that rescue awkward shops without griefing your duo.</li>
          <li>Positioning cues and item pairings for the late-game harvest.</li>
        </ul>
        <p className="text-muted">
          Check back soon. We&apos;ll keep the ledger updated as sets rotate and new
          livestock enters the fields.
        </p>
      </div>
    </main>
  )
}
