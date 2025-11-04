import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/ComingSoon'
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
    <ComingSoon
      title="The pantry is still curing"
      lead="We are charting slam priorities, augment pairings, and partner trade routes so your pantry always supports the board you are building—no matter how the shops roll."
      bulletHeading="Soon you&apos;ll find:"
      bullets={[
        'Stage-by-stage slam matrices tuned for Double Up tempo.',
        'Component swap recommendations for duo coordination.',
        'Flexible best-in-slot templates that respect Free-Range pivots.',
      ]}
      closing="Until then, keep trusting your gut and trade extras with your partner. Fresh guidance is on the way."
      image={{
        src: '/blt_sad.png',
        alt: 'Pengu courier delivering confirmation mail',
      }}
      cardClassName="flex-1 mr-8"
    />
  )
}
