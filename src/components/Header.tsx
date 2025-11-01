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

type NavItem = {
  to: string
  icon: React.ComponentType<{ size?: number }>
  label: string
  search?: Record<string, unknown> | undefined
}

const NAV_ITEMS: NavItem[] = [
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
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="h-20 w-full" />
      <header className="p-4 flex fixed top-0 left-0 items-center bg-base/30 z-100 backdrop-blur-3xl justify-between h-20 w-full px-6">
        <h1 className="text-xl font-semibold">
          <Link to="/">
            <img src="/blt_solo.png" alt="TanStack Logo" className="h-10" />
          </Link>
        </h1>

        {/* Inline navbar for lg+ */}
        <nav className="hidden lg:flex items-center gap-3">
          {NAV_ITEMS.map(({ to, icon: Icon, label, search }) => (
            <Link
              key={to}
              to={to}
              search={search}
              className="flex items-center gap-2 p-2 rounded-lg transition-colors text-sm hover:bg-crust duration-200"
              activeProps={{
                className:
                  'flex items-center gap-2 p-2 rounded-lg bg-linear-to-r from-primary to-secondary text-base',
              }}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Menu button for small screens */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 ml-4 hover:bg-crust rounded-lg transition-colors cursor-pointer lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Overlay only on small screens */}
      <div
        onClick={() => setIsOpen(false)}
        className={`bg-black/30 backdrop-blur-xs transition-opacity duration-250 fixed inset-0 h-full w-full z-25 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Aside drawer only for small screens */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-base/30 shadow-2xl backdrop-blur-3xl z-150 transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-crust rounded-lg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, search }) => (
            <Link
              key={to}
              to={to}
              search={search}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 hover:bg-crust duration-200"
              activeProps={{
                className:
                  'flex items-center gap-2 p-2 rounded-lg bg-linear-to-r from-primary to-secondary text-base',
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
