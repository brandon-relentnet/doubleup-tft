import * as motion from 'motion/react-client'
import { ArrowRight } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import ScrollHighlight from '@/components/ScrollHighlight'
import TypewriterChangeContentExample from '@/components/Typewriter'
import { usePageMeta } from '@/lib/usePageMeta'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  usePageMeta({
    title: 'Free-Range TFT Field Notes | DoubleUp TFT',
    description:
      'Grow confident Double Up instincts with farm-fresh TFT strategy notes, duo drills, and adaptable game plans rooted in Free-Range philosophy.',
  })

  return (
    <main className="hero-gradient">
      <section className="container">
        <div className="flex lg:flex-row flex-col justify-center items-center gap-12">
          {/* Image */}
          <img
            src="/bltft_pengu.png"
            alt="Pengu eating a BLT for BLTFT"
            className="w-full max-w-sm lg:max-w-md h-auto"
            loading="eager"
            decoding="async"
          />

          <div className=" w-fit">
            <TypewriterChangeContentExample />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/forum">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 rounded bg-linear-to-r from-primary to-secondary px-5 py-3 font-semibold text-base"
                >
                  Open Community Forum
                </motion.span>
              </Link>
              <Link
                to="/discussions"
                search={{ tag: undefined }}
                className="inline-flex items-center justify-center gap-2 rounded bg-highlight-low px-5 py-3 font-semibold text-text hover:bg-highlight-med transition"
              >
                Browse Discussions
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="flex lg:flex-row flex-col-reverse justify-center items-center gap-12 text-center lg:text-left">
          <div>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-balance tracking-tight">
              Welcome to <span className="gradient-text">Free-Range TFT</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg">
              <span className="text-xl font-bold">Free-Range TFT</span> means
              playing the game{' '}
              <span className="font-semibold gradient-text">
                the way it was meant to be played
              </span>
              : <span className="font-semibold">not</span>{' '}
              <span className="italic">chasing</span> trends or{' '}
              <span className="italic">copying</span> guides, but building the
              strongest board you can with what you’re given. It’s about feeling
              the rhythm of the game, not memorizing it. Every loss adds flavor,
              and every win feels earned.
              <br className="mb-2" />
              <span className="text-xl font-bold">This playstyle</span> thrives
              on flexibility{' '}
              <span className="font-semibold gradient-text">
                guaranteeing growth
              </span>{' '}
              in <span className="italic">any</span> set. Free-Range TFT is
              set-agnostic, teaching you to adapt, play strong, and find the
              flavor of every game.
              <br className="mb-2" />
              <span className="text-xl font-bold">At the</span> end of the day,
              players don’t mass-produce skill. They grow it, one game at a
              time.{' '}
              <span className="font-semibold gradient-text">
                No shortcuts. No excuses.
              </span>{' '}
              Just solid boards, steady hearts, and home-grown successes.
            </p>

            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
              <Link
                to="/discussions/$slug"
                params={{ slug: 'farm-fresh-tft' }}
                search={{ tag: undefined }}
                className="inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary px-4 py-2 rounded font-semibold text-base transition hover:-translate-y-0.5 duration-200"
              >
                Learn More
              </Link>
              <Link
                to="/discussions"
                search={{ tag: undefined }}
                className="group inline-flex items-center text-muted hover:text-accent transition duration-200"
              >
                See all discussions
                <ArrowRight className="opacity-0 group-hover:opacity-100 size-4 transition -translate-x-5 group-hover:translate-x-1 duration-200" />
              </Link>
            </div>
          </div>

          <img
            src="/blt_cow.png"
            alt="BLT TFT Cow Mascot"
            className="w-full max-w-sm lg:max-w-md h-auto"
          />
        </div>
      </section>
      <section className="container">
        <ScrollHighlight />
      </section>
      <section className="container">
        <div className="rounded bg-surface px-8 py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4 mx-auto lg:mx-0 text-center lg:text-left">
              <span className="text-xs font-semibold uppercase w-fit tracking-[0.35em] gradient-text">
                Fresh From The Coop
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                Get Free-Range TFT field notes and farm tips in your inbox.
              </h2>
              <p className="text-lg text-subtle">
                Subscribe for Sunday field notes packed with stage plans, duo
                drills, and mindset resets. No copy-paste meta, only honest
                produce you can apply the moment the carousel spins.
              </p>
            </div>

            <div className="w-full max-w-md mx-auto lg:mx-0">
              <form className="flex flex-col gap-3" noValidate>
                <label htmlFor="coop-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="coop-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-highlight-high bg-surface px-4 py-3 text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
                />
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-3 font-semibold text-base"
                  >
                    Join Newsletter
                  </motion.button>
                  <Link to="/discussions" search={{ tag: undefined }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ x: 10 }}
                      className="rounded-xl border border-border px-5 py-3 font-semibold text-muted"
                    >
                      Tour the latest dispatches
                    </motion.div>
                  </Link>
                </div>
                <p className="text-xs text-muted">
                  Coming soon: custom harvest logs, duo progress sync, and
                  shared scouting reports for the whole coop.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
