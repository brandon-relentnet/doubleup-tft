import { createFileRoute } from '@tanstack/react-router'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/doubleup')({
  component: DoubleUpPage,
})

function DoubleUpPage() {
  usePageMeta({
    title: 'Double Up Playbook | Free-Range TFT Duo Tools',
    description:
      'The Double Up playbook will deliver duo coordination tools, progress tracking, and shared scouting logs grounded in Free-Range TFT fundamentals.',
  })

  return (
    <main className="container px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-surface px-8 py-12 space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Duo playbook loading
        </h1>
        <p className="text-muted">
          This hub will host our Free-Range Double Up utilities: synced scouting
          logs, shared econ plans, and broadcast-ready checklists that help you
          and your partner stay on the same page.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Editable duo boards to track spikes, items, and shop overlap.</li>
          <li>Progress trackers that celebrate streaks and pinpoint pain points.</li>
          <li>Exportable reports so your partner can prep even when offline.</li>
        </ul>
        <p className="text-muted">
          We&apos;re tilling the soil now. Keep playing Free-Range and the tools will be
          ready before the next ranked sprint.
        </p>
      </div>
    </main>
  )
}
