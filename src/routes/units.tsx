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
    <main className="flex container items-center gap-8 lg:flex-row flex-col">
      <div className="rounded bg-surface px-8 py-12 space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Livestock ledger in progress
        </h1>
        <p className="text-muted">
          We&apos;re cataloging carries, frontliners, and tech units so you know
          which champions to pasture together when the shops get spicy.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Quick-read summaries for marquee units by cost and role.</li>
          <li>
            Trait mashups that rescue awkward shops without griefing your duo.
          </li>
          <li>Positioning cues and item pairings for the late-game harvest.</li>
        </ul>
        <p className="text-muted">
          Check back soon. We&apos;ll keep the ledger updated as sets rotate and
          new livestock enters the fields.
        </p>
      </div>
      <img
        src="/blt_sad.png"
        alt="Pengu courier delivering confirmation mail"
        className="w-full max-w-sm lg:max-w-md h-auto"
        loading="lazy"
      />
    </main>
  )
}
