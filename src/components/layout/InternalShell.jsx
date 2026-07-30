import { Link } from 'react-router-dom'
import { LogOut, ArrowUpRight } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Toaster from './Toaster.jsx'

export default function InternalShell({ area, user, onLogout, children }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-elev-border/70 bg-elev-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Início">
              <Logo size={24} agency={false} />
            </Link>
            <span className="hidden rounded-full border border-elev-border bg-white/5 px-3 py-1 text-xs font-semibold text-elev-muted sm:inline">
              {area}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden items-center gap-1 text-sm text-elev-muted hover:text-elev-text sm:inline-flex"
            >
              Ver site <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            {user && <span className="hidden text-sm text-elev-muted md:inline">{user}</span>}
            {onLogout && (
              <button onClick={onLogout} className="btn btn-sm btn-outline">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <Toaster />
    </div>
  )
}

export function LoginCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      <div className="mb-6 text-center">
        <Logo size={34} className="mx-auto" />
      </div>
      <div className="card p-7">
        <h1 className="font-display text-xl font-bold text-elev-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-elev-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
