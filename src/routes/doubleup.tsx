import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/ComingSoon'
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
    <ComingSoon
      layout="stacked"
      variant="outlined"
      title="Duo playbook loading"
      lead="This hub will host our Free-Range Double Up utilities: synced scouting logs, shared econ plans, and broadcast-ready checklists that help you and your partner stay on the same page."
      bullets={[
        'Editable duo boards to track spikes, items, and shop overlap.',
        'Progress trackers that celebrate streaks and pinpoint pain points.',
        'Exportable reports so your partner can prep even when offline.',
      ]}
      closing="We&apos;re tilling the soil now. Keep playing Free-Range and the tools will be ready before the next ranked sprint."
    />
  )
}
