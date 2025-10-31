import type { ReactNode } from 'react'

import {
  Heading,
  Lead,
  List,
  ListItem,
  Paragraph,
} from '../components/typography'

export type BlogPost = {
  slug: string
  title: string
  summary: string
  date: string
  readTimeMinutes: number
  tags?: string[]
  Content: () => ReactNode
}

const posts: BlogPost[] = [
  {
    slug: 'welcome-to-doubleup',
    title: 'Welcome to DoubleUp TFT',
    summary:
      'An introduction to why this blog exists and what you can expect to find here.',
    date: '2025-02-02',
    readTimeMinutes: 4,
    tags: ['intro'],
    Content: () => (
      <>
        <Lead>
          Thanks for stopping by! DoubleUp TFT is my spot for sharing notes,
          comps, and general Teamfight Tactics learnings. Expect breakdowns of
          new sets, usable cheat sheets, and honest reflections on what works
          (and what definitely does not) on the ranked ladder.
        </Lead>
        <Paragraph>
          I am building this space to move faster than social media posts allow,
          and to give myself room to keep ideas updated as patches land. If you
          are looking for a quick refresher, skim the bullet list below. Want to
          dig in? Each article includes the exact board states, itemization
          choices, and positioning I am testing.
        </Paragraph>
        <List>
          <ListItem>Fresh set impressions within the first 48 hours</ListItem>
          <ListItem>In-depth comp guides with positioning snapshots</ListItem>
          <ListItem>
            Patch-to-patch adjustments for consistent ladder climbing
          </ListItem>
        </List>
        <Paragraph>
          Have questions or want to see a write-up on your favorite line? Ping
          me and I will fold it into the next update.
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'starting-strong-in-set-12',
    title: 'Starting Strong in Set 12',
    summary:
      'A fast-and-loose game plan for the opening week of the latest TFT set.',
    date: '2025-01-28',
    readTimeMinutes: 5,
    tags: ['set-12', 'strategy'],
    Content: () => (
      <>
        <Paragraph>
          Opening weeks are chaotic, but that chaos is where you can gain free
          LP. Here is the skeleton I am following to stabilize most queues:
        </Paragraph>
        <List ordered>
          <ListItem>
            Lean on tempo in Stage 2 by slamming every reasonable item. Edge out
            HP leads while the lobby experiments.
          </ListItem>
          <ListItem>
            Scout every carousel. So many players tunnel vision into their
            fantasy comp; you only need to grab the best-in-slot to cripple
            them.
          </ListItem>
          <ListItem>
            Don&apos;t be afraid of 4-cost carries, but make sure you can pivot
            into a 3-cost reroll fallback if shops stay dry.
          </ListItem>
        </List>
        <Paragraph>
          My go-to opener is a Bruiser frontline with angle into either a
          Tactician Reckoner board or a Sentinel flex line. Keep an eye on AP
          lobbies—Ion Spark is still a cheat code.
        </Paragraph>
        <Paragraph>
          I have packaged the scouting checklist and item priority chart in the
          resources section of the learn page so you can reference it mid-game.
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'doubleup-scouting-checklist',
    title: 'The Double Up Scouting Checklist',
    summary:
      'Six quick scans that keep both boards stable without burning all of your actions.',
    date: '2025-01-15',
    readTimeMinutes: 6,
    tags: ['double-up', 'fundamentals'],
    Content: () => (
      <>
        <Paragraph>
          Playing Double Up well means micromanaging two economies while keeping
          track of four enemy boards. It sounds impossible, but a lightweight
          checklist makes the chaos manageable. Run through these scans at the
          start of every stage and you will anchor your teams without feeling
          rushed.
        </Paragraph>

        <Heading level={2}>Stage 2: Stabilize</Heading>
        <List>
          <ListItem>
            {"Scout frontline sizes."} If one partner queues into a giga-tank
            board, move a spare belt or Bramble Vest their way before the next
            combat.
          </ListItem>
          <ListItem>
            Track overlapping carries early. Call it out so neither of you
            over-commits to a reroll angle that will grief the other.
          </ListItem>
        </List>

        <Heading level={2}>Stage 3: Power Spike</Heading>
        <List ordered>
          <ListItem>
            Lock in slam priorities. If you{' '}
            <em>must</em> hold a component, make sure your partner knows why.
          </ListItem>
          <ListItem>
            Spend down if either board drops below 50 HP. Preserving both nexus
            bars beats greed almost every time.
          </ListItem>
        </List>

        <Heading level={2}>Stage 4+: Close Out</Heading>
        <Paragraph>
          Late-game fights hinge on positioning. Alternate who takes lead on
          the scouting pass so one person can focus on execution. When you spot
          an angle that beats both opponents, call it and swap quickly—hesitation
          is how you lose to shifter comps.
        </Paragraph>

        <Paragraph>
          Screenshot this list or jot it on a sticky note near your monitor.
          The goal is consistency: when every stage has a purpose, you avoid
          panic rolls and keep both inventories clean. Combine it with your own
          role delegation and you will feel in control even during scramble
          lobbies.
        </Paragraph>
      </>
    ),
  },
]

const postsBySlug = new Map(posts.map((post) => [post.slug, post]))

export function listPosts() {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function findPostBySlug(slug: string) {
  return postsBySlug.get(slug)
}
