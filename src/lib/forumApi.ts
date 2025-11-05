import { fetchJson } from './supaRest'

export type ForumPostRow = {
  id: string
  title: string
  body: string
  created_at: string
  author_display_name: string | null
}

export type ForumPostSummary = Pick<ForumPostRow, 'id' | 'title' | 'created_at'>

export type ForumCommentRow = {
  id: string
  post_id: string
  author_id: string
  author_display_name: string | null
  body: string
  created_at: string
  parent_id: string | null
}

export type ForumCommentSummary = Pick<
  ForumCommentRow,
  'id' | 'post_id' | 'created_at' | 'body'
>

const POST_FIELDS = 'id,title,body,created_at,author_display_name'

export async function fetchForumPosts() {
  const { data } = await fetchJson<ForumPostRow[]>(
    `/rest/v1/forum_posts?select=${POST_FIELDS}&order=created_at.desc`,
  )
  return data ?? []
}

export async function fetchForumPost(postId: string) {
  const encoded = encodeURIComponent(postId)
  const { data } = await fetchJson<ForumPostRow[]>(
    `/rest/v1/forum_posts?id=eq.${encoded}&select=${POST_FIELDS}&limit=1`,
  )
  return data?.[0] ?? null
}
