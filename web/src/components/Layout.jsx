import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { apiPost, getApiBase } from '../config/api'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    const base = getApiBase()
    if (base.includes('localhost') || base.includes('127.0.0.1')) return
    apiPost('/api/track', {
      page: location.pathname,
      referrer: document.referrer || '',
    }).catch(() => {})
  }, [location.pathname])

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
