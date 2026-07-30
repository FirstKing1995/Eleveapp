import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ShoppingBag, Check, Info, Minus, Plus } from 'lucide-react'
import { SERVICES, AVULSOS } from '../config/services.js'
import { avulsoLine } from '../lib/pricing.js'
import { useStore } from '../store/StoreContext.jsx'
import { formatBRL } from '../lib/format.js'
import ServiceCard from '../components/ServiceCard.jsx'

function AvulsoCard({ service }) {
  const { addToCart } = useStore()
  const [qty, setQty] = useState(1)
  const line = avulsoLine(service, qty)
  const Icon = service.icon

  return (
    <div className="card card-hover flex flex-col p-6">
      <div className="grid h-12 w-12 place-items-center rounded-xl2 bg-elev-gradient-soft" style={{ color: service.accent }}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-elev-text">{service.name}</h3>
      <p className="mt-1 text-sm text-elev-muted">{service.tagline}</p>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-display text-2xl font-bold text-elev-text">{formatBRL(service.price)}</span>
        <span className="pb-1 text-xs text-elev-muted">/ {service.unitLabel}</span>
      </div>
      <p className="mt-1 text-xs text-elev-faint">
        −20% a partir do 2º (até {formatBRL(service.discountCap)} de desconto por {service.unitLabel})
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-elev-border">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-9 w-9 place-items-center text-elev-muted hover:text-elev-text" aria-label="Menos">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-elev-text">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="grid h-9 w-9 place-items-center text-elev-muted hover:text-elev-text" aria-label="Mais">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm">
          {qty > 1 && line.discountPerUnit > 0 && (
            <span className="mr-2 text-elev-faint line-through">{formatBRL(service.price * qty)}</span>
          )}
          <span className="font-semibold text-elev-text">{formatBRL(line.lineTotal)}</span>
        </div>
      </div>

      <button onClick={() => addToCart(service.id, qty)} className="btn btn-md btn-primary mt-5 w-full">
        <ShoppingBag className="h-4 w-4" /> Adicionar {qty > 1 ? `${qty} ${service.unitLabel}s` : ''}
      </button>
    </div>
  )
}

export default function Servicos() {
  const navigate = useNavigate()
  const { hasDiagnostic, priceOf, addToCart, cart, diagnostic } = useStore()
  const recommended = new Set(diagnostic?.comboItemIds || [])
  const inCart = (id) => cart.some((l) => l.id === id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-elev-text sm:text-4xl">Nossos serviços</h1>
        <p className="mx-auto mt-3 max-w-xl text-elev-muted">
          Soluções de marca, marketing e sistemas para elevar o seu negócio.
        </p>
      </div>

      {hasDiagnostic ? (
        <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4">
          <Check className="h-5 w-5 shrink-0 text-emerald-300" />
          <p className="text-sm text-elev-text">
            Você fez o diagnóstico — está vendo os <b>valores do seu plano ideal</b>.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 rounded-2xl border border-elev-primary/40 bg-elev-gradient-soft px-5 py-4 sm:flex-row">
          <Info className="h-5 w-5 shrink-0 text-elev-sky" />
          <p className="flex-1 text-sm text-elev-text">
            Estes são os <b>valores cheios</b>. Faça o diagnóstico e pague menos — pode ficar até{' '}
            <b>50% menor</b>.
          </p>
          <button onClick={() => navigate('/diagnostico')} className="btn btn-sm btn-primary shrink-0">
            <Sparkles className="h-4 w-4" /> Fazer diagnóstico
          </button>
        </div>
      )}

      {/* Servicos de trilha */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            price={priceOf(s)}
            badge={recommended.has(s.id) ? 'Recomendado' : undefined}
            highlighted={recommended.has(s.id)}
            maxIncludes={3}
            action={
              <div className="space-y-2">
                <button onClick={() => addToCart(s.id)} disabled={inCart(s.id)} className="btn btn-md btn-primary w-full">
                  <ShoppingBag className="h-4 w-4" />
                  {inCart(s.id) ? 'No carrinho' : 'Adicionar'}
                </button>
                <Link to={`/servico/${s.id}`} className="btn btn-sm btn-ghost w-full">
                  Ver detalhes
                </Link>
              </div>
            }
          />
        ))}
      </div>

      {/* Servicos avulsos */}
      <div className="mt-14">
        <h2 className="section-title text-2xl">Serviços avulsos</h2>
        <p className="mt-1 text-elev-muted">Peça por unidade — quanto mais, maior o desconto.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AVULSOS.map((s) => (
            <AvulsoCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
