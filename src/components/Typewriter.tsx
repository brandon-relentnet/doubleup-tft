import { delay, wrap } from 'motion'
import { Typewriter } from 'motion-plus/react'
import { useState } from 'react'

export default function TypewriterChangeContentExample({
  text = ['Best in Slot', 'Economy', 'Luck', 'Meta', 'Elo Hell'],
}: {
  text?: string[]
}) {
  const [index, setIndex] = useState(0)

  return (
    <h2 className="flex flex-col items-start gap-1 w-full leading-none">
      {/* Typed line with warm accent gradient */}
      <Typewriter
        as="div"
        cursorStyle={{
          background: 'var(--color-accent2)',
          width: 3,
          height: '1.1em',
          marginLeft: 2,
        }}
        onComplete={() => {
          delay(() => setIndex(wrap(0, text.length, index + 1)), 2)
        }}
        className="bg-linear-to-r from-accent1 to-accent2 bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
      >
        {text[index]}
      </Typewriter>

      {/* Tagline */}
      <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[--color-muted]">
        is Fake.
      </span>
    </h2>
  )
}
