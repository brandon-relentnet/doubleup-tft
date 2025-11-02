import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'

export const Route = createFileRoute('/account')({
  component: AccountPage,
})

type Mode = 'signIn' | 'signUp'

function AccountPage() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const supabaseClient = supabase

  if (!supabaseClient) {
    return (
      <main className="container flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-lg shadow-black/10">
          <h1 className="text-2xl font-extrabold tracking-tight">Supabase not configured</h1>
          <p className="text-sm text-muted">
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment to enable
            account management.
          </p>
        </div>
      </main>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setStatus('submitting')

    try {
      if (mode === 'signIn') {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      } else {
        const { error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
      }

      setStatus('success')
      setEmail('')
      setPassword('')
    } catch (authError: unknown) {
      const message = authError instanceof Error ? authError.message : 'Unable to process request. Please try again.'
      setError(message)
      setStatus('idle')
    }
  }

  if (!loading && user) {
    const lastSignInAt = user.last_sign_in_at
    return (
      <main className="container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-6 rounded-3xl border border-border bg-surface px-8 py-10 shadow-lg shadow-black/10">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-subtext-0">Account</p>
              <h1 className="text-3xl font-extrabold tracking-tight">Your coop profile</h1>
              <p className="text-sm text-muted">
                Manage your credentials and monitor session activity. Posting access will unlock once roles and
                permissions are configured.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/70 bg-base/80 px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtext-0">Email</p>
                <p className="mt-1 text-lg font-semibold text-text">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtext-0">Session</p>
                <p className="mt-1 text-sm text-muted">
                  Last sign in: {lastSignInAt ? new Date(lastSignInAt).toLocaleString() : 'Active'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => supabaseClient.auth.signOut()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-subtle transition hover:-translate-y-0.5 duration-200"
              >
                Sign out
              </button>
            </div>
          </section>

          <aside className="rounded-3xl border border-border/60 bg-base/70 px-6 py-6 shadow-lg shadow-black/10">
            <h2 className="text-lg font-semibold text-text">Coming soon</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>Invite writers and assign roles.</li>
              <li>Draft and schedule farm-fresh posts.</li>
              <li>Track engagement from the coop dashboard.</li>
            </ul>
          </aside>
        </div>
      </main>
    )
  }

  return (
    <main className="container flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-surface px-8 py-10 shadow-lg shadow-black/10">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-subtext-0">Coop Access</p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {mode === 'signIn' ? 'Sign in to your coop account' : 'Create a coop account'}
          </h1>
          <p className="text-sm text-muted">
            {mode === 'signIn'
              ? 'Log in to publish farm-fresh guides, manage drafts, and share harvest reports.'
              : 'Set up an account so you can publish posts and keep your notes organized.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border bg-base px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder="you@freshtft.com"
            />
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="password" className="text-sm font-medium text-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-base px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder="Minimum 6 characters"
            />
          </div>

          {error ? <p className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</p> : null}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-3 font-semibold text-base text-text transition hover:-translate-y-0.5 duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting'
              ? mode === 'signIn'
                ? 'Signing in…'
                : 'Creating account…'
              : mode === 'signIn'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-sm text-muted">
          <button
            type="button"
            className="font-semibold text-text underline-offset-4 hover:underline"
            onClick={() => {
              setMode(mode === 'signIn' ? 'signUp' : 'signIn')
              setError(null)
            }}
          >
            {mode === 'signIn' ? 'Need an account? Create one.' : 'Already have an account? Sign in instead.'}
          </button>
        </div>
      </div>
    </main>
  )
}
