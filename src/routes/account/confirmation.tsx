import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/account/confirmation')({
  component: AccountConfirmationPage,
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : undefined,
  }),
})

export default function AccountConfirmationPage() {
  const { email } = Route.useSearch() as { email?: string }
  const supabaseClient = supabase
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState<string | null>(null)

  usePageMeta({
    title: 'Confirm Your Coop Access | DoubleUp TFT',
    description:
      'Check your inbox to finish securing your DoubleUp TFT account and unlock farm-fresh publishing tools.',
  })

  const handleResend = async () => {
    if (!email) {
      setStatus('error')
      setMessage(
        'Enter your email on the account page to resend the confirmation.',
      )
      return
    }

    if (!supabaseClient) {
      setStatus('error')
      setMessage('Supabase is not configured for this environment.')
      return
    }

    setStatus('submitting')
    try {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email,
      })
      if (error) throw error
      setStatus('success')
      setMessage('Confirmation email sent. Check your inbox.')
    } catch (err: unknown) {
      const errorText =
        err instanceof Error
          ? err.message
          : 'Unable to resend confirmation email.'
      setStatus('error')
      setMessage(errorText)
    }
  }

  return (
    <main className="container flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-4xl gap-10 rounded bg-surface px-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="order-2 space-y-6 text-center lg:order-1 lg:text-left">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] font-bold gradient-text w-fit">
              Finish signing in
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              We just want to make sure you're real, that's all.
            </h1>
            <p className="text-sm text-subtle">
              We sent a confirmation email to {email ?? 'your address'}. Tap the
              big button inside and you&apos;ll unlock publishing access for
              every farm-fresh TFT post you draft.
            </p>
          </div>

          {message ? (
            <p
              className={
                status === 'error'
                  ? 'rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-200'
                  : 'rounded-xl bg-primary/10 px-4 py-2 text-sm text-primary'
              }
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-start">
            <Link to="/account">
              <motion.span
                whileHover={{ x: -10 }}
                whileTap={{ x: -20 }}
                className="inline-flex items-center justify-center gap-2 rounded bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-base"
              >
                Return to account
              </motion.span>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleResend}
              disabled={status === 'submitting'}
              className="inline-flex items-center cursor-pointer justify-center gap-2 rounded border border-border px-5 py-3 text-sm font-semibold text-text disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Resending…' : 'Resend email'}
            </motion.button>
          </div>

          <p className="text-xs text-muted">
            Tip: the email may hide in spam, promotions, or updates. Add us to
            your safe senders so future harvest reports land right in your
            inbox.
          </p>
        </div>

        <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            src="/blt_pengu_mail.png"
            alt="Pengu courier delivering confirmation mail"
            className="h-auto w-full max-w-xs drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  )
}
