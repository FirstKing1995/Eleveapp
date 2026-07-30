import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import { COMPANY } from '../../config/app.js'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-elev-border/70">
      <div className="mx-auto grid gap-8 px-4 py-12 max-w-6xl sm:grid-cols-2">
        <div>
          <Logo size={30} />
          <p className="mt-4 max-w-sm text-sm text-elev-muted">{COMPANY.subtitle}</p>
        </div>

        <div className="sm:justify-self-end">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-elev-faint">
            Navegue
          </h4>
          <ul className="space-y-2 text-sm text-elev-muted">
            <li>
              <Link to="/diagnostico" className="hover:text-elev-text">
                Fazer diagnóstico
              </Link>
            </li>
            <li>
              <Link to="/servicos" className="hover:text-elev-text">
                Ver serviços
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-elev-text">
                Meu carrinho
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-elev-border/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-elev-faint sm:flex-row">
          <span>
            © {new Date().getFullYear()} {COMPANY.fullName}. Todos os direitos reservados.
          </span>
          <span>{COMPANY.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
