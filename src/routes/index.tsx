import TypewriterChangeContentExample from '@/components/Typewriter'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

const quickLinks = [
  { to: '/discussions', label: 'Discussions' },
  { to: '/items', label: 'Items' },
  { to: '/strategies', label: 'Strategies' },
  { to: '/units', label: 'Units' },
]

function App() {
  return (
    <main className="hero-gradient">
      <section className="container">
        <div className="flex items-center justify-center flex-col lg:flex-row gap-12">
          {/* Image */}
          <div>
            <img
              src="/bltft_pengu.png"
              alt="Pengu eating a BLT for BLTFT"
              className="w-full max-w-sm lg:max-w-md h-auto frame"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="w-100">
            <TypewriterChangeContentExample />
            <div className="grid grid-cols-2 gap-6 mt-6 w-full">
              {quickLinks.map((link) => (
                <div className="text-text flex flex-col" key={link.to}>
                  <h3 className="font-semibold mb-2 gradient-text">
                    {link.label}
                  </h3>
                  <Link
                    to={link.to}
                    className="bg-surface-0 rounded p-2 flex-1"
                  >
                    This will be where the {link.label.toLowerCase()} quick link
                    will go.
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
          Welcome to <span className="hl-accent">Free-Range TFT</span>
        </h1>

        <div className="mt-6 space-y-4 text-lg text-foreground/90 max-w-3xl">
          <p>
            Out here, we play <strong>Free-Range TFT</strong>, raised with care
            on open pastures of heartbreak and redemption. At{' '}
            <strong>BLTFT</strong>, we do not feed our comps from the same
            trough as everyone else. We raise them proper. No spreadsheet feed,
            no mass-produced meta builds. Just pure, grass-fed intuition and a
            little bit of stubborn all-American grit.
          </p>
          <p>
            Every roll is done by hand. Every loss adds flavor. Every win tastes
            like sweet victory pulled straight from the fields. You cannot
            factory-farm greatness. You have to raise it slow, with patience,
            pride, and maybe a tear or two when you miss your three-star carry
            again.
          </p>
          <p>
            So pull up a chair, grab a sandwich, and let Pengu take a big bite
            of that BLT. Because here at <strong>BLTFT</strong>, we do not play
            for fame or fortune. We play for the flavor.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/guides" className="btn btn-primary">
            Read Guides
          </a>
          <a href="/about" className="btn btn-secondary">
            Our Philosophy
          </a>
        </div>
      </section>
    </main>
  )
}
