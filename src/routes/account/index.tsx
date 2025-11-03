import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/AuthProvider'
import { usePageMeta } from '@/lib/usePageMeta'

type Mode = 'signIn' | 'signUp'
type AsyncStatus = 'idle' | 'submitting' | 'success'

const PASSWORD_HELP_TEXT =
  'Use at least 8 characters with uppercase, lowercase, number, and symbol.'

function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password needs at least one lowercase letter.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password needs at least one uppercase letter.'
  }
  if (!/\d/.test(password)) {
    return 'Password needs at least one number.'
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password needs at least one symbol.'
  }
  return null
}

export const Route = createFileRoute('/account/')({
  component: AccountPage,
})

export default function AccountPage() {
  const navigate = Route.useNavigate()
  const { user, loading, isPasswordRecovery, resolvePasswordRecovery } =
    useAuth()
  const supabaseClient = supabase

  const [mode, setMode] = useState<Mode>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<AsyncStatus>('idle')
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  const [resetStatus, setResetStatus] = useState<AsyncStatus>('idle')
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<AsyncStatus>('idle')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [profileDisplayName, setProfileDisplayName] = useState('')

  const displayNameMeta =
    typeof user?.user_metadata?.display_name === 'string'
      ? user.user_metadata.display_name.trim()
      : ''

  usePageMeta({
    title: displayNameMeta
      ? `${displayNameMeta}'s Coop Profile | DoubleUp TFT`
      : 'Your Coop Profile | DoubleUp TFT',
    description:
      'Access Free-Range TFT account tools, update secure passwords, and review upcoming duo publishing features.',
  })

  useEffect(() => {
    if (!user) {
      setProfileDisplayName('')
      return
    }

    const metadataDisplayName =
      typeof user.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name.trim()
        : ''

    setProfileDisplayName(metadataDisplayName)

    if (!supabaseClient) {
      return
    }

    const client = supabaseClient as NonNullable<typeof supabaseClient>
    const currentUser = user

    let isCancelled = false

    const displayNameKey = metadataDisplayName.toLocaleLowerCase()

    async function ensureProfileRecord() {
      const { data, error } = await client
        .from('profiles')
        .select('display_name')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (error) {
        console.warn('[profiles] lookup failed', error)
        return
      }

      const profileName = data?.display_name?.trim() ?? ''

      if (!profileName && metadataDisplayName) {
        const { error: upsertError } = await client
          .from('profiles')
          .upsert({
            user_id: currentUser.id,
            display_name: metadataDisplayName,
            display_name_key: displayNameKey,
          })
        if (upsertError) {
          console.warn('[profiles] ensure failed', upsertError)
        }
        return
      }

      if (!isCancelled) {
        setProfileDisplayName(profileName)
      }

      if (profileName && profileName !== metadataDisplayName) {
        await client.auth.updateUser({
          data: {
            display_name: profileName,
            display_name_key: profileName.toLocaleLowerCase(),
          },
        })
      }
      if (!profileName && !metadataDisplayName && !isCancelled) {
        setProfileDisplayName('')
      }
    }

    void ensureProfileRecord()

    return () => {
      isCancelled = true
    }
  }, [supabaseClient, user])

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

    if (mode === 'signUp' && !displayName.trim()) {
      setAuthError('Please provide a display name.')
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
        const trimmedDisplayName = displayName.trim()
        if (trimmedDisplayName.length < 4 || trimmedDisplayName.length > 16) {
          setAuthError('Display name must be between 4 and 16 characters long.')
          return
        }

        const passwordStrengthError = validatePasswordStrength(password)
        if (passwordStrengthError) {
          setAuthError(passwordStrengthError)
          return
        }

        const displayNameKey = trimmedDisplayName.toLocaleLowerCase()

        const { count: nameCount, error: nameCheckError } = await supabaseClient
          .from('profiles')
          .select('user_id', { head: true, count: 'exact' })
          .eq('display_name_key', displayNameKey)

        if (nameCheckError) {
          setAuthError('Unable to reserve that display name right now. Please try again.')
          return
        }

        if ((nameCount ?? 0) > 0) {
          setAuthError('Display name is already taken. Pick another one.')
          return
        }

        const { data: signUpData, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: trimmedDisplayName,
              display_name_key: displayNameKey,
            },
          },
        })
        if (error) throw error

        const userId = signUpData.user?.id
        if (userId) {
          const { error: profileError } = await supabaseClient
            .from('profiles')
            .upsert({
              user_id: userId,
              display_name: trimmedDisplayName,
              display_name_key: displayNameKey,
            })
          if (profileError) {
            console.warn('[profiles] upsert after sign-up failed', profileError)
          }
        }

        setEmail('')
        setPassword('')
        setDisplayName('')
        navigate({
          to: '/account/confirmation',
          search: { email: targetEmail },
        })
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

    if (!currentPassword || currentPassword.length < 6) {
      setPasswordError('Enter your current password to continue.')
      return
    }

    const newPasswordStrengthError = validatePasswordStrength(newPassword)
    if (newPasswordStrengthError) {
      setPasswordError(newPasswordStrengthError)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    if (!user?.email) {
      setPasswordError('Unable to verify account email. Please sign out and back in.')
      return
    }

    setPasswordStatus('submitting')
    try {
      const { error: verifyError } = await supabaseClient.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (verifyError) {
        setPasswordError('Current password is incorrect.')
        setPasswordStatus('idle')
        return
      }

      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      setPasswordMessage('Password updated successfully.')
      setCurrentPassword('')
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
          <section className="space-y-8 rounded bg-surface px-8 py-10">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] gradient-text w-fit font-bold">
                Your Coop
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {profileDisplayName ? `${profileDisplayName}'s BLT` : 'Your BLT'}
              </h1>
              <p className="text-sm text-muted">
                Keep your credentials fresh and manage upcoming posting
                permissions. Stay tuned for author roles and scheduling tools.
              </p>
            </div>

            <div className="space-y-4 rounded bg-overlay px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtle">
                  Display name
                </p>
                <p className="mt-1 text-lg font-semibold text-text">
                  {profileDisplayName || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtle">
                  Email
                </p>
                <p className="mt-1 text-lg font-semibold text-text">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-subtle">
                  Last sign-in
                </p>
                <p className="mt-1 text-sm text-muted">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : 'Active session'}
                </p>
              </div>
              <p className="text-xs text-muted">
                Need a new display name? Ping the coop lead and we will update it for you.
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
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
              <div className="relative">
                <input
                  id="current-password"
                  type="password"
                  required
                  minLength={6}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.placeholder = 'Enter current password')
                  }
                  onBlur={(e) => {
                    if (!e.currentTarget.value) e.currentTarget.placeholder = ''
                  }}
                  className="peer w-full bg-base placeholder:text-subtle text-text text-sm border border-highlight-med rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-accent hover:border-highlight-high shadow-sm focus:shadow"
                  placeholder=""
                />
                <label
                  htmlFor="current-password"
                  className="absolute cursor-text bg-base px-1 left-2.5 -top-2 scale-90 text-subtle text-sm transition-all transform origin-left peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90"
                >
                  Current
                </label>
              </div>

              <div className="relative">
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.placeholder = 'Minimum 8 characters')
                  }
                  onBlur={(e) => {
                    if (!e.currentTarget.value) e.currentTarget.placeholder = ''
                  }}
                  className="peer w-full bg-base placeholder:text-subtle text-text text-sm border border-highlight-med rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-accent hover:border-highlight-high shadow-sm focus:shadow"
                  placeholder=""
                />
                <label
                  htmlFor="new-password"
                  className="absolute cursor-text bg-base px-1 left-2.5 -top-2 scale-90 text-subtle text-sm transition-all transform origin-left peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90"
                >
                  New
                </label>
              </div>

              <div className="relative">
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  value={confirmNewPassword}
                  onChange={(event) =>
                    setConfirmNewPassword(event.target.value)
                  }
                  onFocus={(e) =>
                    (e.currentTarget.placeholder = 'Minimum 8 characters')
                  }
                  onBlur={(e) => {
                    if (!e.currentTarget.value) e.currentTarget.placeholder = ''
                  }}
                  className="peer w-full bg-base placeholder:text-subtle text-text text-sm border border-highlight-med rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-accent hover:border-highlight-high shadow-sm focus:shadow"
                  placeholder=""
                />
                <label
                  htmlFor="confirm-password"
                  className="absolute cursor-text bg-base px-1 left-2.5 -top-2 scale-90 text-subtle text-sm transition-all transform origin-left peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90"
                >
                  Confirm
                </label>
              </div>

              <p className="text-xs text-left text-muted">{PASSWORD_HELP_TEXT}</p>

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

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={passwordStatus === 'submitting'}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-linear-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-base disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordStatus === 'submitting'
                  ? 'Updating…'
                  : 'Update password'}
              </motion.button>
            </form>

            <motion.button
              initial={{
                backgroundColor: 'var(--color-base)',
                color: 'var(--color-text)',
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: 'var(--color-love)',
                color: 'var(--color-base)',
              }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => supabaseClient.auth.signOut()}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold text-text"
            >
              Sign out
            </motion.button>
          </section>

          <aside className="space-y-4 rounded bg-surface px-6 py-6">
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
    <main className="container flex min-h-[60vh] items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-4xl gap-10 rounded bg-surface px-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
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
                : 'Set up an account so you can publish posts and interact with other farmers.'}
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
                onFocus={(e) =>
                  (e.currentTarget.placeholder = 'you@domain.com')
                }
                onBlur={(e) => {
                  if (!e.currentTarget.value) e.currentTarget.placeholder = ''
                }}
                className="peer w-full bg-base placeholder:text-subtle text-text text-sm border border-highlight-med rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-accent hover:border-highlight-high shadow-sm focus:shadow"
                placeholder=""
              />
              <label
                htmlFor="email"
                className="absolute cursor-text bg-base px-1 left-2.5 -top-2 scale-90 text-subtle text-sm transition-all transform origin-left peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90"
              >
                Email
              </label>
            </div>

            {mode === 'signUp' ? (
              <>
              <div className="relative">
                <input
                  id="display-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  onFocus={(e) => {
                    if (!e.currentTarget.placeholder) {
                      e.currentTarget.placeholder = 'Farm fresh tactician'
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value)
                      e.currentTarget.placeholder = ''
                  }}
                  className="peer w-full bg-base placeholder:text-subtle text-text text-sm border border-highlight-med rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-accent hover:border-highlight-high shadow-sm focus:shadow"
                  placeholder=""
                />
                <label
                  htmlFor="display-name"
                  className="absolute cursor-text bg-base px-1 left-2.5 -top-2 scale-90 text-subtle text-sm transition-all transform origin-left peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90"
                >
                  Display name
                </label>
              </div>
              <p className="text-xs text-left text-muted">
                4-16 characters. Names keep their casing, but each spelling is unique no matter the capital letters.
              </p>

              </>
            ) : null}

            <div className="relative">
              <input
                id="password"
                type="password"
                required
                minLength={mode === 'signUp' ? 8 : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={(e) =>
                  (e.currentTarget.placeholder =
                    mode === 'signUp'
                      ? 'Minimum 8 characters'
                      : 'Enter password')
                }
                onBlur={(e) => {
                  if (!e.currentTarget.value) e.currentTarget.placeholder = ''
                }}
                className="peer w-full bg-base placeholder:text-subtle text-text text-sm border border-highlight-med rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-accent hover:border-highlight-high shadow-sm focus:shadow"
                placeholder=""
              />
              <label
                htmlFor="password"
                className="absolute cursor-text bg-base px-1 left-2.5 -top-2 scale-90 text-subtle text-sm transition-all transform origin-left peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90"
              >
                Password
              </label>
            </div>
            {mode === 'signUp' ? (
              <p className="text-xs text-left text-muted">{PASSWORD_HELP_TEXT}</p>
            ) : null}

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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={authStatus === 'submitting'}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-linear-to-r from-primary to-secondary px-5 py-3 font-semibold text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authStatus === 'submitting'
                ? mode === 'signIn'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'signIn'
                  ? 'Sign In'
                  : 'Create Account'}
            </motion.button>
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
                setDisplayName('')
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

        <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
          <motion.img
            key={illustration}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            src={illustration}
            alt={illustrationAlt}
            className="h-auto w-full max-w-xs drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  )
}
