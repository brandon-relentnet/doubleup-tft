import { delay, wrap } from 'motion'
import { Typewriter } from 'motion-plus/react'
import { useState } from 'react'

export default function TypewriterChangeContentExample({
  text = ['Best in Slot', 'Economy', 'Luck', 'Elo Hell'],
}: {
  text?: string[]
}) {
  const [index, setIndex] = useState(0)

  return (
    <h2 className="flex flex-col items-center gap-0 w-100 leading-none text-(--accent)">
      <Typewriter
        as="div"
        cursorStyle={{ background: '#ff0088', width: 3 }}
        onComplete={() => {
          delay(() => setIndex(wrap(0, text.length, index + 1)), 2)
        }}
        className="text-7xl font-bold leading-none"
      >
        {text[index]}
      </Typewriter>
      <span className="text-3xl">is Fake.</span>
    </h2>
  )
}
