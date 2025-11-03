import { Link } from '@tanstack/react-router'
import { BookOpen, ChevronDown, Home, Menu, MessageSquare, Package, Target, UserRound, Users, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { useAuth } from './AuthProvider'

type NavItem = {
  to: string
  icon: ComponentType<{ size?: number }>
  label: string
  search?: Record<string, unknown> | undefined
}

type BaseItem = Omit<NavItem, 'label'> & { label?: string }

const BASE_ITEMS: Array<BaseItem> = [
  { to: '/', icon: Home, label: 'Home' },
  {
    to: '/discussions',
    icon: MessageSquare,
    label: 'Discussions',
    search: { tag: undefined },
  },
  { to: '/account', icon: UserRound },
]

const LEARN_ITEMS = [
  { to: '/items', icon: Package, label: 'Items' },
  { to: '/strategies', icon: Target, label: 'Strategies' },
  { to: '/units', icon: Users, label: 'Units' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const hoverTimeout = useRef<number | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        window.clearTimeout(hoverTimeout.current)
      }
    }
  }, [])

  const navItems = useMemo<Array<NavItem>>(() => {
    const displayName =
      typeof user?.user_metadata?.display_name === 'string'
        ? user.user_metadata.display_name.trim()
        : undefined
    return BASE_ITEMS.map((item) => {
      if (item.to === '/account') {
        return {
          ...item,
          label: displayName ? displayName : 'Account',
        } as NavItem
      }
      return {
        ...item,
        label: item.label ?? '',
      } as NavItem
    })
  }, [user])

  const renderLearnMenu = (variant: 'desktop' | 'mobile') => {
    const isDesktop = variant === 'desktop'
    const containerClass = isDesktop
      ? 'relative'
      : 'border-t border-border pt-4 mt-4'

    const buttonClass =
      isDesktop
        ? 'flex items-center gap-2 hover:bg-highlight-low p-2 rounded text-sm transition-colors duration-200 cursor-pointer'
        : 'flex items-center gap-3 hover:bg-highlight-low p-3 rounded transition-colors duration-200 cursor-pointer'

    const listClass =
      isDesktop
        ? `absolute right-0 mt-2 w-48 rounded border border-border bg-surface shadow-lg shadow-black/10 transition ${
            learnOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'
          }`
        : `mt-2 flex flex-col gap-1 ${learnOpen ? '' : 'hidden'}`

    const openDropdown = () => {
      if (hoverTimeout.current) {
        window.clearTimeout(hoverTimeout.current)
        hoverTimeout.current = null
      }
      setLearnOpen(true)
    }

    const closeDropdown = () => {
      if (hoverTimeout.current) {
        window.clearTimeout(hoverTimeout.current)
      }
      hoverTimeout.current = window.setTimeout(() => {
        setLearnOpen(false)
        hoverTimeout.current = null
      }, 120)
    }

    return (
      <div className={containerClass}>
        <button
          type="button"
          onMouseEnter={isDesktop ? openDropdown : undefined}
          onMouseLeave={isDesktop ? closeDropdown : undefined}
          onFocus={isDesktop ? openDropdown : undefined}
          onBlur={isDesktop ? closeDropdown : undefined}
          onClick={
            isDesktop ? undefined : () => setLearnOpen((prev) => !prev)
          }
          className={buttonClass}
        >
          <BookOpen size={isDesktop ? 16 : 18} />
          <span className="font-medium">Learn</span>
          <ChevronDown
            size={14}
            className={`transition ${learnOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className={listClass}
          onMouseEnter={isDesktop ? openDropdown : undefined}
          onMouseLeave={isDesktop ? closeDropdown : undefined}
        >
          {LEARN_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                isDesktop
                  ? 'flex items-center gap-2 px-3 py-2 text-sm hover:bg-highlight-low rounded transition'
                  : 'flex items-center gap-3 px-3 py-2 text-sm hover:bg-highlight-low rounded transition'
              }
              onClick={() => {
                setLearnOpen(false)
                if (!isDesktop) {
                  setIsOpen(false)
                }
              }}
            >
              <item.icon size={isDesktop ? 16 : 18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const renderNavLink = (item: NavItem, variant: 'desktop' | 'mobile') => {
    const Icon = item.icon
    const baseClass =
      variant === 'desktop'
        ? 'flex items-center gap-2 hover:bg-highlight-low p-2 rounded-lg text-sm transition-colors duration-200'
        : 'flex items-center gap-3 hover:bg-highlight-low mb-2 p-3 rounded-lg transition-colors duration-200'
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
          {navItems.map((item) => renderNavLink(item, 'desktop'))}
          {renderLearnMenu('desktop')}
        </nav>

        {/* Menu button for small screens */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden hover:bg-highlight-low ml-4 p-2 rounded-lg transition-colors cursor-pointer"
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
            className="hover:bg-highlight-low p-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => renderNavLink(item, 'mobile'))}
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-[0.35em] text-muted mb-2">
              Learn
            </p>
            {LEARN_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 hover:bg-highlight-low mb-2 p-3 rounded transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
