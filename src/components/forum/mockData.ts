import type { Comment, ForumState, Post, User } from './types'

const users: User[] = [
  { id: 'u1', displayName: 'DemoFox' },
  { id: 'u2', displayName: 'CloudHopper' },
  { id: 'u3', displayName: 'Tactician42' },
]

const now = Date.now()

const posts: Post[] = [
  {
    id: 'p1',
    title: 'Welcome to Free-Range TFT',
    body:
      'This is a simple, transparent forum prototype. No algorithms, no fluff — just people sharing ideas. What builds are you testing this patch?',
    authorId: 'u1',
    createdAt: now - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'p2',
    title: 'Itemization notes on frontline openers',
    body:
      'I have been experimenting with chain > belt > vest starts. Opening with early defensive items stabilizes against streaks. What do you think?',
    authorId: 'u2',
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'p3',
    title: 'Most consistent mid-game transitions?',
    body:
      'Curious what transitions you like for flexible play. I tend to pivot around level 7 depending on shop and HP. Share your approach.',
    authorId: 'u3',
    createdAt: now - 1000 * 60 * 60 * 20,
  },
  {
    id: 'p4',
    title: 'Unit targeting quirks I noticed',
    body:
      'Some ranged units have subtle targeting priorities. Noticing corner traps and diagonal baiting being more impactful than expected.',
    authorId: 'u1',
    createdAt: now - 1000 * 60 * 60 * 10,
  },
  {
    id: 'p5',
    title: 'Share your cleanest top-4 game plan',
    body:
      'Looking for principles that consistently convert to top-4 without highrolls. Curve, econ thresholds, and when you accept a healthy 3rd.',
    authorId: 'u2',
    createdAt: now - 1000 * 60 * 60 * 2,
  },
]

const comments: Comment[] = [
  // p1
  {
    id: 'c1',
    postId: 'p1',
    authorId: 'u2',
    body: 'Love the simplicity. I can finally just read and reply.',
    createdAt: now - 1000 * 60 * 60 * 23,
  },
  {
    id: 'c2',
    postId: 'p1',
    authorId: 'u1',
    body: 'Same! Let us keep it human-scaled and useful.',
    parentId: 'c1',
    createdAt: now - 1000 * 60 * 60 * 22,
  },
  {
    id: 'c3',
    postId: 'p1',
    authorId: 'u3',
    body: 'Agree. Threads > feeds. Looking forward to sharing notes.',
    parentId: 'c1',
    createdAt: now - 1000 * 60 * 60 * 21,
  },
  // p2
  {
    id: 'c4',
    postId: 'p2',
    authorId: 'u1',
    body: 'Chain first is underrated. Anti-snowball is real.',
    createdAt: now - 1000 * 60 * 60 * 30,
  },
  {
    id: 'c5',
    postId: 'p2',
    authorId: 'u2',
    body: 'I like it if the lobby is scrappy early. Depends on streaks.',
    parentId: 'c4',
    createdAt: now - 1000 * 60 * 60 * 29,
  },
  {
    id: 'c6',
    postId: 'p2',
    authorId: 'u3',
    body: 'Any data on top-4 rates with that start?',
    parentId: 'c4',
    createdAt: now - 1000 * 60 * 60 * 27,
  },
  // p3
  {
    id: 'c7',
    postId: 'p3',
    authorId: 'u1',
    body: 'I like 2-1 econ opener into 7 on 3-5 if HP allows.',
    createdAt: now - 1000 * 60 * 60 * 15,
  },
  {
    id: 'c8',
    postId: 'p3',
    authorId: 'u3',
    body: 'Same; adapt items to strongest board rather than forcing.',
    parentId: 'c7',
    createdAt: now - 1000 * 60 * 60 * 14,
  },
]

export const initialState: ForumState = {
  users,
  posts,
  comments,
}

