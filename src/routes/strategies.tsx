import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/ComingSoon'
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
    <ComingSoon
      title="Strategy greenhouse under construction"
      lead="We&apos;re cultivating crop rotation plans that help you pivot without abandoning your economy or your partner. Expect playbooks that focus on stage tempo, scouting habits, and flexible win conditions."
      bullets={[
        'Stage-by-stage spending maps for both aggressive and patient lines.',
        'Reroll and upgrade decision trees that respect lobby overlap.',
        'Partner delegation checklists so both boards stay sturdy.',
      ]}
      closing="We&apos;ll post the first rotation guides after the next patch settles. Until then, keep reading the lobbies and cooking with what the carousel gives you."
      image={{
        src: '/blt_sad.png',
        alt: 'Pengu courier delivering confirmation mail',
      }}
    />
  )
}
