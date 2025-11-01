import TypewriterChangeContentExample from '@/components/Typewriter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="hero-gradient">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex justify-center">
            <img
              src="/bltft_pengu.png"
              alt="Pengu eating a BLT for BLTFT"
              className="w-full max-w-sm lg:max-w-md h-auto frame"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2 lg:col-span-7 max-w-2xl lg:max-w-none">
            <div className="mb-6">
              <TypewriterChangeContentExample />
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
              Welcome to <span className="hl-accent">Free-Range TFT</span>
            </h1>

            <div className="mt-6 prose-hero">
              <p>
                Out here, we play <strong>Free-Range TFT</strong>, raised with
                care on open pastures of heartbreak and redemption. At{' '}
                <strong>BLTFT</strong>, we do not feed our comps from the same
                trough as everyone else. We raise them proper. No spreadsheet
                feed, no mass-produced meta builds. Just pure, grass-fed
                intuition and a little bit of stubborn all-American grit.
              </p>
              <p>
                Every roll is done by hand. Every loss adds flavor. Every win
                tastes like sweet victory pulled straight from the fields. You
                cannot factory-farm greatness. You have to raise it slow, with
                patience, pride, and maybe a tear or two when you miss your
                three-star carry again.
              </p>
              <p>
                So pull up a chair, grab a sandwich, and let Pengu take a big
                bite of that BLT. Because here at <strong>BLTFT</strong>, we do
                not play for fame or fortune. We play for the flavor.
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
          </div>
        </div>
      </section>
    </main>
  )
}
