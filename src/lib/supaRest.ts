export type FetchOptions = {
  timeoutMs?: number
  signal?: AbortSignal
  prefer?: string
}

function getEnv() {
  const url = (import.meta as any).env.VITE_SUPABASE_URL as string | undefined
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!url || !key) {
    throw new Error('Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
  return { url, key }
}

export async function fetchJson<T = any>(path: string, opts: FetchOptions = {}): Promise<{ data: T; response: Response }>
{
  const { url, key } = getEnv()
  const headers: HeadersInit = {
    apikey: key,
    authorization: `Bearer ${key}`,
  }
  if (opts.prefer) headers['Prefer'] = opts.prefer

  const controller = new AbortController()
  const signal = opts.signal ?? controller.signal
  const timeout = window.setTimeout(() => controller.abort(), opts.timeoutMs ?? 12000)
  try {
    const res = await fetch(`${url}${path}`, { headers, signal })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Request failed (${res.status}). ${text}`)
    }
    const data = (await res.json()) as T
    return { data, response: res }
  } finally {
    window.clearTimeout(timeout)
  }
}

export function parseContentRange(res: Response): number | null {
  const cr = res.headers.get('content-range') || res.headers.get('Content-Range')
  if (!cr) return null
  const m = cr.match(/\/(\d+)$/)
  return m ? parseInt(m[1], 10) : null
}

