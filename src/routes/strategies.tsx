import { createFileRoute } from '@tanstack/react-router'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/strategies')({
  component: StrategiesPage,
})

function StrategiesPage() {
  usePageMeta({
    title: 'Free-Range Game Plans & Duo Rotations | DoubleUp TFT',
    description:
      'Explore adaptable stage plans, reroll routes, and duo coordination frameworks designed for Free-Range TFT players.',
  })

  return (
    <main className="container px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-surface px-8 py-12 shadow-lg shadow-black/10 space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Strategy greenhouse under construction
        </h1>
        <p className="text-muted">
          We&apos;re cultivating crop rotation plans that help you pivot without
          abandoning your economy or your partner. Expect playbooks that focus on
          stage tempo, scouting habits, and flexible win conditions.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Stage-by-stage spending maps for both aggressive and patient lines.</li>
          <li>Reroll and upgrade decision trees that respect lobby overlap.</li>
          <li>Partner delegation checklists so both boards stay sturdy.</li>
        </ul>
        <p className="text-muted">
          We&apos;ll post the first rotation guides after the next patch settles. Until
          then, keep reading the lobbies and cooking with what the carousel gives
          you.
        </p>
      </div>
    </main>
  )
}
