import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  Home,
  Menu,
  MessageSquare,
  Package,
  Target,
  Users,
  X,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="h-20 w-full"></div>
      <header className="p-4 flex fixed top-0 left-0 items-center justify-between h-20 w-full px-6">
        <h1 className="text-xl font-semibold">
          <Link to="/">
            <img src="/blt_solo.png" alt="TanStack Logo" className="h-10" />
          </Link>
        </h1>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 ml-4 hover:bg-bg-alt rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      <div
        className={`bg-black/30 transition-opacity duration-250 absolute inset-0 h-full w-full z-25 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-bg-alt shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-crust rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {[
            { to: '/', icon: Home, label: 'Home' },
            {
              to: '/discussions',
              icon: MessageSquare,
              label: 'Discussions',
              search: { tag: undefined },
            },
            { to: '/items', icon: Package, label: 'Items' },
            { to: '/strategies', icon: Target, label: 'Strategies' },
            { to: '/units', icon: Users, label: 'Units' },
          ].map(({ to, icon: Icon, label, search }) => (
            <Link
              key={to}
              to={to}
              search={search}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors mb-2"
              activeProps={{
                className:
                  'flex items-center text-base hover:text-text gap-3 p-3 rounded-lg bg-accent transition-colors mb-2',
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
