'use client'

import { motion } from 'motion/react'
import { useState } from 'react'

interface Skill {
  name: string
  subtitle?: string
  description?: string
  image?: string
}

const skills: Skill[] = [
  {
    name: 'BLT Theory',
    subtitle: 'Why this site exists',
    image: '/blt_solo.png',
    description:
      'We teach fundamentals. Board strength, economy, health, and mental. You have one sandwich worth of focus. Balance the ingredients and learn to cook your own wins.',
  },
  {
    name: 'Bread',
    subtitle: 'Board Strength',
    image: '/blt_bread.png',
    description:
      'Build the strongest board you can with what you have. Stabilize early fights, protect health, and buy time for your economy. A solid base keeps the sandwich together.',
  },
  {
    name: 'Lettuce',
    subtitle: 'Health',
    image: '/blt_lettuce.png',
    description:
      'Health is time. Spend it to push power when needed and save it when you can. Learn when to bleed and when to defend so your run does not wilt before it peaks.',
  },
  {
    name: 'Tomato',
    subtitle: 'Economy',
    image: '/blt_tomato.png',
    description:
      'Gold is flavor. Save for interest, roll with purpose, and commit at the right stages. Too dry and you never spike. Too juicy and the whole thing slips.',
  },
  {
    name: 'Bacon',
    subtitle: 'Mental',
    image: '/blt_bacon.png',
    description:
      'Bacon brings the flavor, but it burns fast if you stop paying attention. Your mental works the same way. Stay calm when the pan gets hot. Confidence adds heat to your play, but frustration scorches everything around it. Keep your focus steady so the rest of your sandwich can cook evenly.',
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
  onHighlight: (index: number) => void
}) {
  return (
    <motion.li
      className="py-16 flex items-center gap-8"
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
      <div>
        <span className="leading-[0.9] text-[clamp(2rem,8vw,6rem)] font-extrabold uppercase whitespace-nowrap gradient-text">
          {skill.name}
        </span>
        {skill.subtitle ? (
          <div className="mt-3 text-subtext-0 italic text-2xl font-semibold">
            {skill.subtitle}
          </div>
        ) : null}

        {skill.description ? (
          <div className="mt-2 text-xl leading-relaxed max-w-3xl text-text">
            {skill.description}
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
            onHighlight={() => setActiveSkill(index)}
          />
        ))}
      </ul>
    </div>
  )
}
