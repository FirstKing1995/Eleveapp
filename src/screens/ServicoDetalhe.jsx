import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { Check, ShoppingBag, ChevronLeft, Sparkles, Package, Clock, Users } from 'lucide-react'
import { getService } from '../config/services.js'
import { useStore } from '../store/StoreContext.jsx'
import { formatBRL } from '../lib/format.js'

export default function ServicoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const service = getService(id)
  const { hasDiagnostic, priceOf, addToCart, cart } = useStore()

  if (!service) return <Navigate to="/servicos" replace />
  const Icon = service.icon
  const price = priceOf(service)
  const inCart = cart.includes(service.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/servicos" className="inline-flex items-center gap-1 text-sm text-elev-muted hover:text-elev-text">
        <ChevronLeft className="h-4 w-4" /> Todos os serviços
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div
            className="grid h-14 w-14 place-items-center rounded-xl2 bg-elev-gradient-soft"
            style={{ color: service.accent }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-elev-text">{service.name}</h1>
          <p className="mt-2 text-lg text-elev-muted">{service.tagline}</p>

          <div className="mt-6 rounded-2xl border border-elev-border bg-elev-bg2/40 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-elev-faint">
              Para quem é
            </h3>
            <p className="mt-2 text-sm text-elev-muted">{service.forWho}</p>
          </div>

          <h3 className="mt-8 font-display text-lg font-bold text-elev-text">O que está incluso</h3>
          <ul className="mt-4 space-y-3">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-elev-muted">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-elev-gradient-soft text-elev-sky">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-elev-border bg-elev-bg2/40 p-4">
              <Package className="h-4 w-4 text-elev-sky" />
              <div className="mt-2 text-xs text-elev-faint">Entregáveis</div>
              <div className="mt-1 text-sm text-elev-text">{service.deliverables.join(', ')}</div>
            </div>
            <div className="rounded-xl border border-elev-border bg-elev-bg2/40 p-4">
              <Clock className="h-4 w-4 text-elev-sky" />
              <div className="mt-2 text-xs text-elev-faint">Prazo</div>
              <div className="mt-1 text-sm text-elev-text">{service.delivery}</div>
            </div>
            <div className="rounded-xl border border-elev-border bg-elev-bg2/40 p-4">
              <Users className="h-4 w-4 text-elev-sky" />
              <div className="mt-2 text-xs text-elev-faint">Trilha</div>
              <div className="mt-1 text-sm text-elev-text">Trilha {service.trilha}</div>
            </div>
          </div>
        </div>

        {/* Coluna de compra */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="card p-6">
            {!hasDiagnostic && (
              <div className="mb-4 rounded-xl border border-elev-primary/40 bg-elev-gradient-soft p-3 text-xs text-elev-text">
                Valor cheio. Faça o diagnóstico e pague o valor ideal.
              </div>
            )}
            <div className="text-sm text-elev-muted">Investimento</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-3xl font-bold text-elev-text">{formatBRL(price)}</span>
              {service.period && <span className="pb-1 text-sm text-elev-muted">{service.period}</span>}
            </div>
            {!hasDiagnostic && (
              <div className="mt-1 text-xs text-elev-faint">
                Com diagnóstico: <b className="text-elev-sky">{formatBRL(service.price)}</b>
              </div>
            )}

            <button
              onClick={() => addToCart(service.id)}
              disabled={inCart}
              className="btn btn-lg btn-primary mt-5 w-full"
            >
              <ShoppingBag className="h-5 w-5" />
              {inCart ? 'Já está no carrinho' : 'Adicionar ao carrinho'}
            </button>
            <button onClick={() => navigate('/checkout')} className="btn btn-md btn-outline mt-2 w-full">
              Ir para o carrinho
            </button>
            {!hasDiagnostic && (
              <button
                onClick={() => navigate('/diagnostico')}
                className="btn btn-sm btn-ghost mt-2 w-full"
              >
                <Sparkles className="h-4 w-4" /> Fazer diagnóstico primeiro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
