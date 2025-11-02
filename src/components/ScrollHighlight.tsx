import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

interface Skill {
  name: string
  subtitle?: string
  description?: string
  image?: string
  cta?: {
    slug: string
    label: string
  }
}

const skills: Array<Skill> = [
  {
    name: 'BLT Theory',
    subtitle: 'Why this site exists',
    image: '/blt_solo.png',
    description:
      'We teach fundamentals: board strength, economy, health, and mental. You have one sandwich worth of focus, so how you layer those ingredients decides your result. Learn to balance them and cook your own wins with purpose.',
  },
  {
    name: 'Bread',
    subtitle: 'Board Strength',
    image: '/blt_bread.png',
    description:
      'Build the strongest board you can with what you have. Stabilize early, protect health, and keep your gold alive long enough to grow. A firm foundation carries tempo and prevents the whole sandwich from falling apart.',
  },
  {
    name: 'Lettuce',
    subtitle: 'Health',
    image: '/blt_lettuce.png',
    description:
      'Health is time and space to learn. Spend it to push power when you must, and save it when you can. Know when to bleed and when to defend so your run does not wilt before it peaks.',
  },
  {
    name: 'Tomato',
    subtitle: 'Economy',
    image: '/blt_tomato.png',
    description:
      'Gold is flavor that develops over stages. Save for interest, roll with purpose, and commit when the window opens. Too dry and you never spike, too wet and the whole sandwich slides out of control.',
  },
  {
    name: 'Bacon',
    subtitle: 'Mental',
    image: '/blt_bacon.png',
    description:
      'Bacon brings the flavor, but it burns fast if you stop paying attention. Your mental works the same way. Stay calm when the pan gets hot. Confidence adds heat; frustration scorches everything around it. Keep the fire steady.',
  },
  {
    name: 'Seasoning',
    subtitle: 'Positioning and Adaptation',
    image: '/blt_seasoning.png',
    description:
      'Seasoning ties the plate together. Scout with intent, position for threats, and pivot when the game demands it. It is not a separate bucket. You sprinkle it across everything so each bite tastes right.',
  },
  {
    name: 'Conclusion',
    subtitle: 'Bringing It All Together',
    image: '/blt_pengu_blt.png',
    description:
      'Balance turns understanding into results. If one part takes everything, the others fail. Keep your board sturdy, your health fresh, your gold purposeful, and your focus steady. That is how consistency forms, and that is farm fresh TFT.',
    cta: {
      slug: 'blt-theory',
      label: 'BLT Theory',
    },
  },
]

function ScrollHighlightItem({
  skill,
  index,
  isHighlighted,
  onHighlight,
}: {
  skill: Skill
  index: number
  isHighlighted: boolean
  onHighlight: Dispatch<SetStateAction<number | null>>
}) {
  return (
    <motion.li
      className="py-16 lg:flex-row flex-col flex justify-center items-center gap-8"
      initial={false}
      animate={{
        opacity: isHighlighted ? 1 : 0.35,
        scale: isHighlighted ? 1.02 : 1,
      }}
      transition={{ duration: 0.12, ease: 'linear' }}
      onViewportEnter={() => onHighlight(index)}
      viewport={{ margin: '-28% 0px -50% 0px', amount: 'some' }}
    >
      {skill.image ? (
        <img src={skill.image} alt={skill.name} className="size-64" />
      ) : null}
      <div className="flex flex-col items-center lg:items-start">
        <span className="leading-[0.9] text-[clamp(2rem,8vw,6rem)] font-extrabold uppercase whitespace-nowrap gradient-text">
          {skill.name}
        </span>
        {skill.subtitle ? (
          <div className="mt-3 text-muted italic text-2xl font-semibold">
            {skill.subtitle}
          </div>
        ) : null}
        {skill.description ? (
          <div className="mt-2 text-xl leading-relaxed max-w-3xl text-text text-center lg:text-left">
            {skill.description}
          </div>
        ) : null}
        {skill.cta ? (
          <div className="mt-2 text-xl leading-relaxed max-w-3xl text-text text-center lg:text-left">
            Learn more here:{' '}
            <Link
              to="/discussions/$slug"
              params={{ slug: skill.cta.slug }}
              search={{ tag: undefined }}
              className="underline"
            >
              {skill.cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </motion.li>
  )
}

export default function ScrollHighlight() {
  const [activeSkill, setActiveSkill] = useState<number | null>(null)

  return (
    <div className="px-5 flex justify-center">
      <ul className="list-none flex flex-col gap-8 m-0 p-0">
        {skills.map((skill, index) => (
          <ScrollHighlightItem
            key={skill.name}
            skill={skill}
            index={index}
            isHighlighted={activeSkill === index}
            onHighlight={setActiveSkill}
          />
        ))}
      </ul>
    </div>
  )
}
