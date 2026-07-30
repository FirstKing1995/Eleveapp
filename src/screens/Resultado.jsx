import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkles, ShoppingBag, ArrowRight, TrendingUp, Check } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { getService } from '../config/services.js'
import { formatBRL } from '../lib/format.js'
import { cn } from '../lib/utils.js'
import ServiceCard from '../components/ServiceCard.jsx'

function NeedBar({ trail }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-elev-muted">{trail.name}</span>
        <span className={cn('font-semibold', trail.recommended ? 'text-elev-pink' : 'text-elev-faint')}>
          {trail.recommended ? 'Ponto de atenção' : 'Ok'}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
        <div
          className={cn('h-full rounded-full', trail.recommended ? 'bg-elev-gradient' : 'bg-white/20')}
          style={{ width: `${Math.max(6, trail.need)}%` }}
        />
      </div>
    </div>
  )
}

export default function Resultado() {
  const navigate = useNavigate()
  const { diagnostic, lead, hasDiagnostic, setCartItems, addToCart } = useStore()

  if (!hasDiagnostic || !diagnostic) return <Navigate to="/diagnostico" replace />

  const items = diagnostic.itemIds.map(getService).filter(Boolean)
  const total = diagnostic.total
  const fullPrice = total * 2 // valor que veria sem diagnostico
  const firstName = lead?.name?.split(' ')[0] || 'você'

  const contractCombo = () => {
    setCartItems(diagnostic.itemIds)
    navigate('/checkout')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-center">
        <span className="chip mx-auto">
          <Sparkles className="h-3.5 w-3.5 text-elev-sky" /> Diagnóstico de {lead?.business || 'seu negócio'}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-elev-text sm:text-4xl">
          {firstName}, esta é a <span className="gradient-text">solução ideal</span> para você
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-elev-muted">
          Montamos um combo com exatamente o que o seu negócio precisa agora — nada a mais, nada a menos.
        </p>
      </div>

      {/* Mapa de necessidades */}
      <div className="card mt-8 p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-elev-sky" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-elev-faint">
            O que identificamos
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {diagnostic.trails.map((t) => (
            <NeedBar key={t.id} trail={t} />
          ))}
        </div>
      </div>

      {/* Combo */}
      {items.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-elev-text">
            Seu negócio está muito bem estruturado!
          </h2>
          <p className="mx-auto mt-2 max-w-md text-elev-muted">
            Não identificamos um ponto crítico agora. Mesmo assim, dá uma olhada nos nossos serviços — sempre dá para elevar mais.
          </p>
          <button onClick={() => navigate('/servicos')} className="btn btn-lg btn-primary mx-auto mt-6">
            Ver serviços <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <>
          <div className="mt-10 flex items-end justify-between">
            <h2 className="section-title text-xl sm:text-2xl">Seu combo recomendado</h2>
            <span className="text-sm text-elev-muted">{items.length} serviço(s)</span>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {items.map((s, i) => (
              <ServiceCard
                key={s.id}
                service={s}
                price={s.price}
                oldPrice={s.price * 2}
                highlighted={i === 0}
                badge={i === 0 ? 'Prioridade' : undefined}
                action={
                  <button onClick={() => addToCart(s.id)} className="btn btn-md btn-outline w-full">
                    <ShoppingBag className="h-4 w-4" /> Adicionar avulso
                  </button>
                }
              />
            ))}
          </div>

          {/* Resumo do combo */}
          <div className="card mt-8 overflow-hidden p-0">
            <div className="bg-elev-gradient-soft p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-elev-muted">Valor do combo no plano ideal</div>
                  <div className="mt-1 flex items-end gap-3">
                    <span className="font-display text-3xl font-bold text-elev-text">
                      {formatBRL(total)}
                    </span>
                    <span className="pb-1 text-sm text-elev-faint line-through">{formatBRL(fullPrice)}</span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-300">
                    <Check className="h-4 w-4" /> Você economiza {formatBRL(fullPrice - total)} por ter feito o diagnóstico
                  </div>
                </div>
                <button onClick={contractCombo} className="btn btn-lg btn-primary shrink-0">
                  <ShoppingBag className="h-5 w-5" /> Contratar combo
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
