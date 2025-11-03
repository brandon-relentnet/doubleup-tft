import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../components/AuthProvider'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <SpeedInsights />
      <Analytics />
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  ),
})
