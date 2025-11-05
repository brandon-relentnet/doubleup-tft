import { fetchJson, parseContentRange } from './supaRest'

const POST_FIELDS = 'id,title,body,created_at,author_display_name'
const COMMENT_FIELDS =
  'id,post_id,author_id,author_display_name,body,created_at,parent_id'

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


export async function fetchForumPosts() {
  const { data } = await fetchJson<Array<ForumPostRow>>(
    `/rest/v1/forum_posts?select=${POST_FIELDS}&order=created_at.desc`,
  )
  return data
}

export async function fetchForumPost(postId: string) {
  const encoded = encodeURIComponent(postId)
  const { data } = await fetchJson<Array<ForumPostRow>>(
    `/rest/v1/forum_posts?id=eq.${encoded}&select=${POST_FIELDS}&limit=1`,
  )
  const row = data.at(0)
  return row ?? null
}

export async function fetchForumPostsByAuthor(authorId: string) {
  const { data } = await fetchJson<Array<ForumPostSummary>>(
    `/rest/v1/forum_posts?author_id=eq.${authorId}&select=id,title,created_at&order=created_at.desc`,
  )
  return data
}

export async function fetchForumCommentsByAuthor(authorId: string) {
  const { data } = await fetchJson<Array<ForumCommentSummary>>(
    `/rest/v1/forum_comments?author_id=eq.${authorId}&select=id,post_id,created_at,body&order=created_at.desc`,
  )
  return data
}

export async function findAuthorIdByDisplayName(name: string) {
  const encoded = encodeURIComponent(name)
  const { data: fromPosts } = await fetchJson<Array<{ author_id: string }>>(
    `/rest/v1/forum_posts?author_display_name=eq.${encoded}&select=author_id&order=created_at.desc&limit=1`,
  )
  const postMatch = fromPosts[0]?.author_id
  if (postMatch) return postMatch

  const { data: fromComments } = await fetchJson<Array<{ author_id: string }>>(
    `/rest/v1/forum_comments?author_display_name=eq.${encoded}&select=author_id&order=created_at.desc&limit=1`,
  )
  return fromComments[0]?.author_id ?? null
}

export async function fetchForumCommentsPage(
  postId: string,
  options: { limit: number; offset: number; order?: 'asc' | 'desc' } = {
    limit: 10,
    offset: 0,
  },
) {
  const order = options.order ?? 'asc'
  const { data, response } = await fetchJson<Array<ForumCommentRow>>(
    `/rest/v1/forum_comments?post_id=eq.${postId}&select=${COMMENT_FIELDS}&order=created_at.${order}&limit=${options.limit}&offset=${options.offset}`,
    { prefer: 'count=exact' },
  )
  const total = parseContentRange(response)
  return { rows: data, total: total === null ? data.length : total }
}

export async function fetchForumComment(commentId: string) {
  const encoded = encodeURIComponent(commentId)
  const { data } = await fetchJson<Array<ForumCommentRow>>(
    `/rest/v1/forum_comments?id=eq.${encoded}&select=${COMMENT_FIELDS}&limit=1`,
  )
  const row = data.at(0)
  return row ?? null
}

export async function fetchForumCommentMeta(commentId: string) {
  const encoded = encodeURIComponent(commentId)
  const { data } = await fetchJson<
    Array<{ created_at: string; author_display_name: string | null }>
  >(
    `/rest/v1/forum_comments?id=eq.${encoded}&select=created_at,author_display_name&limit=1`,
  )
  const row = data.at(0)
  return row ?? null
}

export async function fetchForumCommentIndex(postId: string, createdAt: string) {
  const encodedPost = encodeURIComponent(postId)
  const encodedDate = encodeURIComponent(createdAt)
  const { response } = await fetchJson(
    `/rest/v1/forum_comments?post_id=eq.${encodedPost}&created_at=lte.${encodedDate}&select=id&limit=1`,
    { prefer: 'count=exact' },
  )
  const count = parseContentRange(response)
  return count === null ? 0 : count
}

export async function countForumComments(postId: string) {
  const encoded = encodeURIComponent(postId)
  const { response } = await fetchJson(
    `/rest/v1/forum_comments?post_id=eq.${encoded}&select=id&limit=1`,
    { prefer: 'count=exact' },
  )
  const count = parseContentRange(response)
  return count === null ? 0 : count
}
