import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

export type Profile = {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string | null
}

export async function ensureProfile(user: User) {
  if (!supabase) return
  try {
    const display = typeof user.user_metadata?.display_name === 'string' ? user.user_metadata.display_name : null
    const avatar = typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null
    const bio = typeof user.user_metadata?.bio === 'string' ? user.user_metadata.bio : null
    const createdAt = user.created_at

    // Upsert by id; prefer not to overwrite non-null values
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          display_name: display,
          avatar_url: avatar,
          bio,
          created_at: createdAt,
        },
        { onConflict: 'id', ignoreDuplicates: false },
      )
    if (error) {
      // Table may not exist; ignore silently
      return
    }
  } catch (_) {
    // ignore
  }
}

export async function getProfileByName(name: string): Promise<Profile | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, bio, avatar_url, created_at')
      .eq('display_name', name)
      .maybeSingle()
    if (error) return null
    return (data as Profile | null) ?? null
  } catch {
    return null
  }
}

export async function getProfileById(id: string): Promise<Profile | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, bio, avatar_url, created_at')
      .eq('id', id)
      .maybeSingle()
    if (error) return null
    return (data as Profile | null) ?? null
  } catch {
    return null
  }
}

