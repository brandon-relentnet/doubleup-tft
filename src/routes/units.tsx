import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/ComingSoon'
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
    <ComingSoon
      title="Livestock ledger in progress"
      lead="We&apos;re cataloging carries, frontliners, and tech units so you know which champions to pasture together when the shops get spicy."
      bullets={[
        'Quick-read summaries for marquee units by cost and role.',
        'Trait mashups that rescue awkward shops without griefing your duo.',
        'Positioning cues and item pairings for the late-game harvest.',
      ]}
      closing="Check back soon. We&apos;ll keep the ledger updated as sets rotate and new livestock enters the fields."
      image={{
        src: '/blt_sad.png',
        alt: 'Pengu courier delivering confirmation mail',
      }}
    />
  )
}
