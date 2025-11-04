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

    const rehydrate = async (_reason: string) => {
      try {
        const { data } = await supabase!.auth.getSession()
        console.log('[Auth] rehydrate', _reason, data)
        if (!isMounted) return
        setSession(data.session)
        setUser(data.session?.user ?? null)
        setLoading(false)
        setIsPasswordRecovery(false)
        if (data.session?.user) {
          await ensureProfile(data.session.user)
        }
      } catch {
        if (isMounted) {
          setLoading(false)
          setIsPasswordRecovery(false)
        }
      }
    }

    // Initial rehydrate
    void rehydrate('initial')

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      console.log('[Auth] onAuthStateChange', event, nextSession)
      if (!isMounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
      setIsPasswordRecovery(event === 'PASSWORD_RECOVERY')
      if (nextSession?.user) {
        await ensureProfile(nextSession.user)
      }
    })

    // Fallback rehydrate shortly after mount in case storage is slow
    const fallbackTimer = window.setTimeout(() => {
      if (isMounted && !user && !session) void rehydrate('fallback')
    }, 400)

    const onFocus = () => void rehydrate('focus')
    const onVisible = () => {
      if (document.visibilityState === 'visible') void rehydrate('visible')
    }
    const onStorage = () => void rehydrate('storage')
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('storage', onStorage)

    return () => {
      isMounted = false
      subscription.unsubscribe()
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('storage', onStorage)
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
