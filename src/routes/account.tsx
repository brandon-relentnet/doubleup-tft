import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'

export const Route = createFileRoute('/account')({
  component: AccountPage,
})

type Mode = 'signIn' | 'signUp'
type AsyncStatus = 'idle' | 'submitting' | 'success'

export default function AccountPage() {
  const navigate = Route.useNavigate()
  const { user, loading, isPasswordRecovery, resolvePasswordRecovery } =
    useAuth()
  const supabaseClient = supabase

  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<AsyncStatus>('idle')
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  const [resetStatus, setResetStatus] = useState<AsyncStatus>('idle')
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<AsyncStatus>('idle')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  if (!supabaseClient) {
    return (
      <main className="container flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-surface px-8 py-10 text-center shadow-lg shadow-black/10">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Supabase not configured
          </h1>
          <p className="text-sm text-muted">
            Set <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> to enable account management.
          </p>
        </div>
      </main>
    )
  }

  const handleSignInOrUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError(null)
    setAuthMessage(null)

    if (!email || !password) {
      setAuthError('Please provide both email and password.')
      return
    }

    setAuthStatus('submitting')
    try {
      if (mode === 'signIn') {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setAuthMessage('Signed in successfully.')
        setPassword('')
      } else {
        const targetEmail = email
        const { error } = await supabaseClient.auth.signUp({ email, password })
        if (error) throw error
        setEmail('')
        setPassword('')
        setAuthMessage('Check your inbox to confirm your account.')
        navigate({ to: '/account/confirmation', search: { email: targetEmail } })
        return
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to process request. Please try again.'
      setAuthError(message)
    } finally {
      setAuthStatus('idle')
    }
  }

  const handlePasswordReset = async () => {
    setResetError(null)
    setResetMessage(null)
    if (!email) {
      setResetError('Enter the email associated with your account first.')
      return
    }

    setResetStatus('submitting')
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      })
      if (error) throw error
      setResetMessage(
        'Password reset email sent. Check your inbox for further instructions.',
      )
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to send reset email. Please try again.'
      setResetError(message)
    } finally {
      setResetStatus('idle')
    }
  }

  const handlePasswordUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError(null)
    setPasswordMessage(null)

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordStatus('submitting')
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      setPasswordMessage('Password updated successfully.')
      setNewPassword('')
      setConfirmNewPassword('')
      resolvePasswordRecovery()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to update password. Please try again.'
      setPasswordError(message)
    } finally {
      setPasswordStatus('idle')
    }
  }

  if (!loading && user) {
    return (
      <main className="container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="space-y-8 rounded-3xl border border-border bg-surface px-8 py-10 shadow-lg shadow-black/10">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-subtext-0">
                Account
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Your coop profile
              </h1>
              <p className="text-sm text-muted">
                Keep your credentials fresh and manage upcoming posting
                permissions. Stay tuned for author roles and scheduling tools.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/70 bg-base/80 px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtext-0">
                  Email
                </p>
                <p className="mt-1 text-lg font-semibold text-text">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtext-0">
                  Last sign-in
                </p>
                <p className="mt-1 text-sm text-muted">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : 'Active session'}
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePasswordUpdate}
              className="space-y-4 rounded-2xl border border-border/70 bg-base/80 px-6 py-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">
                  Update password
                </p>
                {isPasswordRecovery ? (
                  <span className="text-xs uppercase tracking-[0.2em] text-primary">
                    Recovery mode
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-text"
                >
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-base px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-text"
                >
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-base px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  placeholder="Repeat new password"
                />
              </div>

              {passwordError ? (
                <p className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-200">
                  {passwordError}
                </p>
              ) : null}
              {passwordMessage ? (
                <p className="rounded-xl bg-primary/10 px-4 py-2 text-sm text-primary">
                  {passwordMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={passwordStatus === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-text transition hover:-translate-y-0.5 duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordStatus === 'submitting'
                  ? 'Updating…'
                  : 'Update password'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => supabaseClient.auth.signOut()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-subtle transition hover:-translate-y-0.5 duration-200"
            >
              Sign out
            </button>
          </section>

          <aside className="space-y-4 rounded-3xl border border-border/60 bg-base/70 px-6 py-6 shadow-lg shadow-black/10">
            <h2 className="text-lg font-semibold text-text">Coming soon</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>Invite writers and assign roles.</li>
              <li>Draft, edit, and schedule farm-fresh posts.</li>
              <li>Monitor coop analytics and pair performance.</li>
            </ul>
          </aside>
        </div>
      </main>
    )
  }

  const illustration =
    mode === 'signIn' ? '/blt_pengu_key.png' : '/blt_pengu_egg.png'
  const illustrationAlt =
    mode === 'signIn'
      ? 'Pengu guarding the key to the coop'
      : 'Pengu hatching from an egg, ready to join the coop'

  return (
    <main className="container flex-col flex min-h-[60vh] lg:flex-row-reverse items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-fit max-w-3xl rounded bg-surface px-10 py-12">
        <div className="order-2 space-y-8 lg:order-1">
          <div className="space-y-3 text-center lg:text-left">
            <p className="mx-auto w-fit text-xs font-bold uppercase tracking-[0.35em] gradient-text lg:mx-0">
              BLT Employment
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {mode === 'signIn' ? 'The Classic BLT' : 'Craft a new BLT'}
            </h1>
            <p className="text-sm text-muted">
              {mode === 'signIn'
                ? 'Log in to publish farm-fresh guides, manage drafts, and share harvest reports.'
                : 'Set up an account so you can publish posts and keep your notes organized.'}
            </p>
          </div>

          <form onSubmit={handleSignInOrUp} className="space-y-4">
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@domain.com"
                className="peer w-full bg-base placeholder:text-base focus:placeholder:text-muted text-text text-sm border border-highlight-high rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
              <label className="absolute cursor-text bg-base rounded pointer-events-none px-1 left-2.5 text-subtle text-sm transition-all transform origin-left -top-2 scale-90 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-sm peer-focus:scale-90">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="peer w-full bg-base placeholder:text-base focus:placeholder:text-muted text-text text-sm border border-highlight-high rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              />
              <label className="absolute cursor-text bg-base rounded pointer-events-none px-1 left-2.5 text-subtle text-sm transition-all transform origin-left -top-2 scale-90 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-sm peer-focus:scale-90">
                Password
              </label>
            </div>

            {authError ? (
              <p className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {authError}
              </p>
            ) : null}
            {authMessage ? (
              <p className="rounded-xl bg-primary/10 px-4 py-2 text-sm text-primary">
                {authMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={authStatus === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-3 font-semibold text-base transition hover:-translate-y-0.5 duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authStatus === 'submitting'
                ? mode === 'signIn'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'signIn'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          <div className="flex flex-col gap-2 text-center text-sm">
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ x: 10 }}
              type="button"
              className="mx-auto w-fit cursor-pointer font-semibold gradient-text"
              onClick={() => {
                setMode(mode === 'signIn' ? 'signUp' : 'signIn')
                setAuthError(null)
                setAuthMessage(null)
              }}
            >
              {mode === 'signIn'
                ? 'Need an account? Create one.'
                : 'Already have an account? Sign in instead.'}
            </motion.button>

            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ x: 10 }}
              type="button"
              className="cursor-pointer text-xs font-semibold text-subtext-0 underline-offset-4 hover:underline"
              onClick={handlePasswordReset}
              disabled={resetStatus === 'submitting'}
            >
              {resetStatus === 'submitting'
                ? 'Sending reset email…'
                : 'Forgot password? Send reset link.'}
            </motion.button>
            {resetError ? (
              <p className="text-xs text-red-300">{resetError}</p>
            ) : null}
            {resetMessage ? (
              <p className="text-xs text-primary">{resetMessage}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <motion.img
          key={illustration}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          src={illustration}
          alt={illustrationAlt}
          className="w-full max-w-xs drop-shadow-2xl"
          loading="lazy"
        />
      </div>
    </main>
  )
}
