import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ShoppingBag, Check, Info } from 'lucide-react'
import { SERVICES } from '../config/services.js'
import { useStore } from '../store/StoreContext.jsx'
import ServiceCard from '../components/ServiceCard.jsx'

export default function Servicos() {
  const navigate = useNavigate()
  const { hasDiagnostic, priceOf, addToCart, cart, diagnostic } = useStore()
  const recommended = new Set(diagnostic?.itemIds || [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-elev-text sm:text-4xl">Nossos serviços</h1>
        <p className="mx-auto mt-3 max-w-xl text-elev-muted">
          Soluções de marca, marketing e sistemas para elevar o seu negócio.
        </p>
      </div>

      {/* Banner de incentivo / status do preco */}
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
            Estes são os <b>valores cheios</b>. Faça o diagnóstico e destrave o valor ideal — pode ficar
            até <b>50% menor</b>.
          </p>
          <button onClick={() => navigate('/diagnostico')} className="btn btn-sm btn-primary shrink-0">
            <Sparkles className="h-4 w-4" /> Fazer diagnóstico
          </button>
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => {
          const inCart = cart.includes(s.id)
          return (
            <ServiceCard
              key={s.id}
              service={s}
              price={priceOf(s)}
              badge={recommended.has(s.id) ? 'Recomendado' : undefined}
              highlighted={recommended.has(s.id)}
              maxIncludes={3}
              action={
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(s.id)}
                    disabled={inCart}
                    className="btn btn-md btn-primary w-full"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {inCart ? 'No carrinho' : 'Adicionar'}
                  </button>
                  <Link to={`/servico/${s.id}`} className="btn btn-sm btn-ghost w-full">
                    Ver detalhes
                  </Link>
                </div>
              }
            />
          )
        })}
      </div>
    </div>
  )
}
