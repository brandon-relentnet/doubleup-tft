import { Link } from '@tanstack/react-router'
import { useState, type ComponentType } from 'react'
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
  icon: ComponentType<{ size?: number }>
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

  const renderNavLink = (item: NavItem, variant: 'desktop' | 'mobile') => {
    const Icon = item.icon
    const baseClass =
      variant === 'desktop'
        ? 'flex items-center gap-2 hover:bg-crust p-2 rounded-lg text-sm transition-colors duration-200'
        : 'flex items-center gap-3 hover:bg-crust mb-2 p-3 rounded-lg transition-colors duration-200'
    const activeClass =
      'flex items-center gap-2 p-2 rounded-lg bg-linear-to-r from-primary to-secondary text-base'
    const iconSize = variant === 'desktop' ? 18 : 20
    const handleClick =
      variant === 'mobile' ? () => setIsOpen(false) : undefined

    return (
      <Link
        key={item.to}
        to={item.to}
        search={item.search}
        className={baseClass}
        activeProps={{ className: activeClass }}
        onClick={handleClick}
      >
        <Icon size={iconSize} />
        <span className="font-medium">{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      <div className="w-full h-20" />
      <header className="top-0 left-0 z-100 fixed flex justify-between items-center bg-base/30 backdrop-blur-3xl p-4 px-6 w-full h-20">
        <h1 className="font-semibold text-xl">
          <Link to="/">
            <img src="/blt_solo.png" alt="TanStack Logo" className="h-10" />
          </Link>
        </h1>

        {/* Inline navbar for lg+ */}
        <nav className="hidden lg:flex items-center gap-3">
          {NAV_ITEMS.map((item) => renderNavLink(item, 'desktop'))}
        </nav>

        {/* Menu button for small screens */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden hover:bg-crust ml-4 p-2 rounded-lg transition-colors cursor-pointer"
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
        <div className="flex justify-between items-center p-4">
          <h2 className="font-bold text-xl">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-crust p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => renderNavLink(item, 'mobile'))}
        </nav>
      </aside>
    </>
  )
}
