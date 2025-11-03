import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ensureProfile } from '@/lib/profiles'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  isPasswordRecovery: boolean
  resolvePasswordRecovery: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: !supabase,
  isPasswordRecovery: false,
  resolvePasswordRecovery: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(Boolean(supabase))
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      setIsPasswordRecovery(false)
      return
    }

    let isMounted = true

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!isMounted) return
        setSession(data.session)
        setUser(data.session?.user ?? null)
        setLoading(false)
        setIsPasswordRecovery(false)
        if (data.session?.user) {
          await ensureProfile(data.session.user)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false)
          setIsPasswordRecovery(false)
        }
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
      setIsPasswordRecovery(event === 'PASSWORD_RECOVERY')
      if (nextSession?.user) {
        await ensureProfile(nextSession.user)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const resolvePasswordRecovery = useCallback(() => setIsPasswordRecovery(false), [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isPasswordRecovery,
      resolvePasswordRecovery,
    }),
    [loading, session, user, isPasswordRecovery, resolvePasswordRecovery],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
