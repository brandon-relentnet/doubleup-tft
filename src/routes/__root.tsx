import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../components/AuthProvider'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <SpeedInsights />
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
  ),
})
