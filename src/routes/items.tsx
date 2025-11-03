import { createFileRoute } from '@tanstack/react-router'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/items')({
  component: ItemsPage,
})

function ItemsPage() {
  usePageMeta({
    title: 'Item Pantry & Slam Priorities | DoubleUp TFT',
    description:
      'Preview the farm-to-board item planner: upcoming slam priorities, augment pairings, and component trade routes tailored for Free-Range Double Up play.',
  })

  return (
    <main className="flex container items-center gap-8 lg:flex-row flex-col">
      <div className="rounded bg-surface px-8 py-12 space-y-5 flex-1 mr-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          The pantry is still curing
        </h1>
        <p className="text-muted">
          We are charting slam priorities, augment pairings, and partner trade
          routes so your pantry always supports the board you are
          building&mdash;no matter how the shops roll.
        </p>
        <p className="text-muted">Soon you&apos;ll find:</p>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>Stage-by-stage slam matrices tuned for Double Up tempo.</li>
          <li>Component swap recommendations for duo coordination.</li>
          <li>
            Flexible best-in-slot templates that respect Free-Range pivots.
          </li>
        </ul>
        <p className="text-muted">
          Until then, keep trusting your gut and trade extras with your partner.
          Fresh guidance is on the way.
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
