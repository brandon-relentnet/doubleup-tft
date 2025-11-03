import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Comment, ForumAPI, ForumState, Post, User } from './types'
import { initialState } from './mockData'

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

const DemoUser: User = { id: 'u_demo', displayName: 'DemoUser' }

const ForumContext = createContext<ForumAPI | null>(null)

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ForumState>(initialState)
  const [currentUser] = useState<User>(DemoUser)

  const addPost = useCallback((input: { title: string; body: string }): Post => {
    const post: Post = {
      id: uid('p'),
      title: input.title.trim(),
      body: input.body.trim(),
      authorId: currentUser.id,
      createdAt: Date.now(),
    }
    setState((prev) => ({ ...prev, posts: [post, ...prev.posts] }))
    return post
  }, [currentUser.id])

  const addComment = useCallback((input: { postId: string; body: string; parentId?: string | null }): Comment => {
    const comment: Comment = {
      id: uid('c'),
      postId: input.postId,
      body: input.body.trim(),
      authorId: currentUser.id,
      createdAt: Date.now(),
      parentId: input.parentId ?? null,
    }
    setState((prev) => ({ ...prev, comments: [...prev.comments, comment] }))
    return comment
  }, [currentUser.id])

  const getReplyCount = useCallback((postId: string) => {
    return state.comments.filter((c) => c.postId === postId).length
  }, [state.comments])

  const value: ForumAPI = useMemo(() => ({
    state,
    currentUser,
    addPost,
    addComment,
    getReplyCount,
  }), [state, currentUser, addPost, addComment, getReplyCount])

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
}

export function useForum() {
  const ctx = useContext(ForumContext)
  if (!ctx) throw new Error('useForum must be used within a ForumProvider')
  return ctx
}

