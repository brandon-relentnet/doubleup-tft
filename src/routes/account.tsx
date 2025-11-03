import { Outlet, createFileRoute } from '@tanstack/react-router'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/account')({
  component: AccountLayout,
})

function AccountLayout() {
  usePageMeta({
    title: 'Account Coop | DoubleUp TFT',
    description:
      'Manage your DoubleUp TFT credentials, update passwords, and prepare for upcoming author tools inside the coop.',
  })

  return <Outlet />
}

export default AccountLayout
