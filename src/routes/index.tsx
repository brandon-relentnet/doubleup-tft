import ScrollHighlight from '@/components/ScrollHighlight'
import TypewriterChangeContentExample from '@/components/Typewriter'
import { createFileRoute, Link } from '@tanstack/react-router'
import { User, Users, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

const quickLinks = [
  {
    to: '/discussions',
    label: 'Discussions',
    tidbit: 'Farm-Fresh Thoughts',
    description:
      'Get insights into our thoughts and feel free to participate in the conversation.',
    search: { tag: undefined },
  },
  {
    to: '/items',
    label: 'Items',
    tidbit: 'Gourmet Gear',
    description:
      'Learn about each items potential and how to utilize it to the best of your abilities.',
  },
  {
    to: '/strategies',
    label: 'Strategies',
    tidbit: 'Free-Range Tactics',
    description:
      'Explore the depth of TFT as we discuss various strategies you can employ in your own games.',
  },
  {
    to: '/units',
    label: 'Units',
    tidbit: 'Pasture-Raised Powerhouses',
    description:
      'Discover the strengths and synergies of different units to build powerful team compositions.',
  },
]

function App() {
  return (
    <main className="hero-gradient">
      <section className="container">
        <div className="flex items-center justify-center flex-col lg:flex-row gap-12">
          {/* Image */}
          <img
            src="/bltft_pengu.png"
            alt="Pengu eating a BLT for BLTFT"
            className="w-full max-w-sm lg:max-w-md h-auto"
            loading="eager"
            decoding="async"
          />

          <div className="flex-1">
            <TypewriterChangeContentExample />
            <div className="grid grid-cols-2 gap-6 mt-6 w-full">
              {quickLinks.map((link) => (
                <div
                  key={link.to}
                  className="bg-surface-0 rounded p-4 flex-1 transition-all duration-200 hover:-translate-y-1 relative group overflow-hidden"
                >
                  <span className="font-semibold gradient-text text-lg">
                    {link.label}
                    <ArrowRight className="ml-2 size-4 mb-1 inline-block text-text opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </span>
                  <div className="group-hover:blur-sm transition-all duration-200">
                    <span className="text-md italic block mb-4">
                      {link.tidbit}
                    </span>
                    <p>{link.description}</p>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-2 w-full items-center justify-evenly px-4">
                      <Link to={link.to} search={link.search} className="p-4">
                        <User className="size-10" />
                      </Link>
                      <Link to={`${link.to}`} search={link.search} className="p-4">
                        <Users className="size-10" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="flex items-center justify-center flex-col lg:flex-row gap-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
              Welcome to <span className="gradient-text">Free-Range TFT</span>
            </h1>

            <p className="mt-6 text-lg text-foreground/90 max-w-3xl">
              <span className="font-semibold gradient-text">
                Out here, we play Free-Range TFT.
              </span>{' '}
              Raised on the fundamentals and seasoned with heartbreak, we{' '}
              <span className="font-semibold">do not chase</span> what is
              trending or <span className="italic">blindly</span> follow someone
              else’s guide. We build the strongest board we can with what we
              have. We play tempo when we must, greed when we can, and we learn
              to feel the rhythm of the game instead of memorizing it.
              <br className="mb-2" />
              <span className="font-semibold gradient-text">
                We farm our own knowledge.
              </span>{' '}
              We position with intent. We understand when to pivot and when to
              trust the comp we grew ourselves. No spreadsheets. No borrowed
              blueprints. Just honest play and stubborn grit.
              <br className="mb-2" />
              <span className="font-semibold gradient-text">
                Every loss adds flavor.
              </span>{' '}
              Every win feels earned. You cannot mass-produce skill; you have to
              grow it one game at a time. That is what Free-Range TFT means to
              us. No shortcuts. No excuses. Just solid boards, steady hearts,
              and players who cook their own success. We play for the flavor.
            </p>

            <ul className="mt-4 space-y-3 text-foreground/90 max-w-3xl list-disc list-inside">
              <li>
                <strong>Craft, don't copy.</strong> Experiment with compositions
                rather than following the meta.
              </li>
              <li>
                <strong>Learn together.</strong> Strategy writeups and friendly
                discussion to level up faster.
              </li>
              <li>
                <strong>Keep it human.</strong> Wins, losses, and sandwich jokes
                encouraged.
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/discussions/$slug"
                params={{ slug: 'farm-fresh-tft' }}
                search={{ tag: undefined }}
                className="inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary text-base font-semibold px-4 py-2 rounded"
              >
                Learn More
              </Link>
              <Link
                to="/discussions"
                search={{ tag: undefined }}
                className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded"
              >
                See all discussions
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
      <section className="container pb-100!">
        <ScrollHighlight />
      </section>
    </main>
  )
}
