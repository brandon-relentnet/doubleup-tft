export type User = {
  id: string
  displayName: string
}

export type Post = {
  id: string
  title: string
  body: string
  authorId: string
  createdAt: number
}

export type Comment = {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: number
  parentId?: string | null
}

export type SortOption = 'oldest' | 'newest' | 'mostActive'

export type ForumState = {
  users: User[]
  posts: Post[]
  comments: Comment[]
}

export type ForumAPI = {
  state: ForumState
  currentUser: User
  addPost: (input: { title: string; body: string }) => Post
  addComment: (input: {
    postId: string
    body: string
    parentId?: string | null
  }) => Comment
  getReplyCount: (postId: string) => number
}

