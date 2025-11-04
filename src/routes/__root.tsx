import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../components/AuthProvider'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <div className="min-h-screen">
        <SpeedInsights />
        <Analytics />
        <Header />
        <Outlet />
      </div>
      <Footer />
    </AuthProvider>
  ),
})
