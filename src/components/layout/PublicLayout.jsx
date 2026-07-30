import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Toaster from './Toaster.jsx'
import { COMPANY } from '../../config/app.js'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {COMPANY.whatsapp && (
        <a
          href={`https://wa.me/${COMPANY.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 left-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-elev-gradient shadow-elev-glow transition-transform hover:scale-105"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="h-5 w-5 text-white" />
        </a>
      )}
    </div>
  )
}
