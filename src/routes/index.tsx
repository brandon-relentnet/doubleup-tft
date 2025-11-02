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
    tidbit: 'USDA Certified',
    description:
      'Discover the strengths and synergies of different units to build powerful team compositions.',
  },
]

function App() {
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

          <div className="flex-1">
            <TypewriterChangeContentExample />
            <div className="gap-6 grid grid-cols-2 mt-6 w-full">
              {quickLinks.map((link) => (
                <div
                  key={link.to}
                  className="group relative flex-1 bg-surface-0 p-4 rounded overflow-hidden transition-all hover:-translate-y-1 duration-200"
                >
                  <span className="font-semibold text-lg gradient-text">
                    {link.label}
                    <ArrowRight className="inline-block opacity-0 group-hover:opacity-100 mb-1 ml-2 size-4 text-text transition-opacity duration-200" />
                  </span>
                  <div className="group-hover:blur-sm transition-all duration-200">
                    <span className="block mb-4 text-md italic">
                      {link.tidbit}
                    </span>
                    {/**<p>{link.description}</p>**/}
                  </div>

                  <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex justify-evenly items-center gap-2 px-4 w-full">
                      <Link to={link.to} search={link.search} className="p-4">
                        <User className="size-10" />
                      </Link>
                      <Link
                        to={`${link.to}`}
                        search={link.search}
                        className="p-4"
                      >
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
        <div className="flex lg:flex-row flex-col justify-center items-center gap-12">
          <div>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-balance tracking-tight">
              Welcome to <span className="gradient-text">Free-Range TFT</span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg">
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
                Every loss adds flavor.
              </span>{' '}
              Every win feels <span className="italic">earned.</span> You cannot
              mass-produce skill; you have to grow it one game at a time. That
              is what Free-Range TFT means to us. No shortcuts. No excuses. Just
              solid boards, steady hearts, and players who cook their own
              success. We play for the flavor.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
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
                className="group inline-flex items-center text-subtext-0 hover:text-accent transition duration-200"
              >
                See all discussions
                <ArrowRight className="opacity-0 group-hover:opacity-100 mb-1 ml-2 size-4 transition -translate-x-5 group-hover:translate-x-1 duration-200" />
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
      <section className="pb-100! container">
        <ScrollHighlight />
      </section>
      <section className="mb-20 container"></section>
    </main>
  )
}
