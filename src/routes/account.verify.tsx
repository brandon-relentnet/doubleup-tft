import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export const Route = createFileRoute('/account/verify')({
  component: VerifyAccountPage,
  validateSearch: (search) => ({
    email: typeof search.email === 'string' ? search.email : undefined,
  }),
})

export default function VerifyAccountPage() {
  const { email } = Route.useSearch()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const supabaseClient = supabase

  const handleResend = async () => {
    if (!email) {
      setStatus('error')
      setMessage('Enter your email on the account page to resend the confirmation.')
      return
    }

    if (!supabaseClient) {
      setStatus('error')
      setMessage('Supabase is not configured for this environment.')
      return
    }

    setStatus('submitting')
    try {
      const { error } = await supabaseClient.auth.resend({ type: 'signup', email })
      if (error) throw error
      setStatus('success')
      setMessage('Confirmation email sent. Check your inbox.')
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : 'Unable to resend confirmation email.'
      setStatus('error')
      setMessage(errorText)
    }
  }

  return (
    <main className="container flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 rounded-3xl border border-border bg-surface px-8 py-10 shadow-lg shadow-black/10">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-subtext-0">Check your inbox</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Verify your coop account</h1>
          <p className="text-sm text-muted">
            We sent a confirmation email to {email ?? 'your address'}. Click the link inside to activate your account and
            start sharing fresh TFT notes.
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

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={status === 'submitting'}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-subtle transition hover:-translate-y-0.5 duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Resending…' : 'Resend email'}
          </button>
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-text transition hover:-translate-y-0.5 duration-200"
          >
            Return to account
          </Link>
        </div>

        <p className="text-xs text-center text-muted">
          Didn’t get it? Check spam or promotions, or verify that your mail provider allows messages from our domain.
        </p>
      </div>
    </main>
  )
}
