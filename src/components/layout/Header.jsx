import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Sparkles, UserRound } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import { useStore } from '../../store/StoreContext.jsx'
import { cn } from '../../lib/utils.js'

export default function Header() {
  const { cartCount, sellerRef } = useStore()
  const navigate = useNavigate()

  const navItem = ({ isActive }) =>
    cn(
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      isActive ? 'text-elev-text bg-white/5' : 'text-elev-muted hover:text-elev-text',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-elev-border/70 bg-elev-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center" aria-label="elev Agency — início">
          <Logo size={26} />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/servicos" className={navItem}>
            Serviços
          </NavLink>
          <NavLink to="/diagnostico" className={navItem}>
            Diagnóstico
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {sellerRef && (
            <span className="hidden items-center gap-1.5 rounded-full border border-elev-border bg-white/5 px-3 py-1 text-xs text-elev-muted md:inline-flex">
              <UserRound className="h-3.5 w-3.5" />
              Indicado por <b className="text-elev-text">{sellerRef}</b>
            </span>
          )}
          <button
            onClick={() => navigate('/diagnostico')}
            className="btn btn-sm btn-outline hidden sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Fazer diagnóstico
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="relative btn btn-sm btn-primary"
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-elev-pink px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
