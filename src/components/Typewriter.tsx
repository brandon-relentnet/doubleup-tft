import { Typewriter } from 'motion-plus/react'
import * as motion from 'motion/react-client'
import { useState } from 'react'
import { delay, wrap } from 'motion'

export default function TypewriterChangeContentExample({
  text = ['Best in Slot', 'Economy', 'Luck', 'Meta', 'Elo Hell'],
}: {
  text?: Array<string>
}) {
  const [index, setIndex] = useState(0)

  return (
    <motion.h2
      initial={{ opacity: 0, scale: 0.7, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="flex flex-col items-center lg:items-start gap-1 w-full leading-none"
    >
      <Typewriter
        as="div"
        cursorStyle={{
          background: 'var(--color-secondary)',
          width: 3,
          height: '1.1em',
          marginLeft: 2,
        }}
        onComplete={() => {
          delay(() => setIndex(wrap(0, text.length, index + 1)), 2)
        }}
        className="gradient-text text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none"
      >
        {text[index]}
      </Typewriter>

      <motion.span
        initial={{ opacity: 0, scale: 0.7, y: -10, height: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0, height: '55px' }}
        transition={{ delay: 1.3 }}
        className="text-md sm:text-xl lg:text-2xl font-semibold text-muted"
      >
        is{' '}
        <span className="italic text-2xl sm:text-3xl font-bold lg:text-4xl text-text">
          Fake.
        </span>
      </motion.span>
    </motion.h2>
  )
}
