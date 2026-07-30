import { useMemo, useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Download,
  AlertTriangle,
  Check,
  Gift,
  Lock,
  TrendingDown,
} from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { getService } from '../config/services.js'
import { LOSS_BY_SERVICE } from '../config/diagnostic.js'
import { computeCart } from '../lib/pricing.js'
import { formatBRL, formatBRLShort } from '../lib/format.js'

const ORDER = ['logo', 'identidade', 'social', 'sistema']

export default function Resultado() {
  const navigate = useNavigate()
  const { diagnostic, lead, hasDiagnostic, setCartItems, toast } = useStore()
  const [phase, setPhase] = useState('diagnosis')

  const comboIds = diagnostic?.comboItemIds || []
  const gatedIds = diagnostic?.gatedOutIds || []
  const avulsoIds = diagnostic?.avulsoSuggest || []

  const narrativeIds = useMemo(() => {
    const set = [...new Set([...comboIds, ...gatedIds])]
    const filtered = set.includes('identidade') ? set.filter((x) => x !== 'logo') : set
    return ORDER.filter((x) => filtered.includes(x))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnostic])

  const pricing = useMemo(
    () => computeCart(comboIds.map((id) => ({ id, qty: 1 })), true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [diagnostic],
  )

  if (!hasDiagnostic || !diagnostic) return <Navigate to="/diagnostico" replace />

  const firstName = lead?.name?.split(' ')[0] || 'você'
  const fullPrice = pricing.total ? pricing.total * 2 : 0

  const contractCombo = () => {
    setCartItems(comboIds)
    navigate('/checkout')
  }

  const download = () => {
    toast('Use "Salvar como PDF" na janela de impressão.', 'primary')
    setTimeout(() => window.print(), 350)
  }

  // ---------------- FASE 1: DIAGNÓSTICO ----------------
  if (phase === 'diagnosis') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center">
          <span className="chip mx-auto">
            <Sparkles className="h-3.5 w-3.5 text-elev-sky" /> Diagnóstico de {lead?.business || 'seu negócio'}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-elev-text sm:text-4xl">
            {firstName}, aqui está o raio-x do seu negócio
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-elev-muted">
            Analisamos suas respostas. Estes são os pontos que estão travando o seu crescimento — e o que
            eles custam para você.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {narrativeIds.length === 0 && (
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-elev-gradient-soft text-elev-sky">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-elev-text">
                    Falta constância na sua produção de conteúdo e materiais.
                  </h3>
                  <p className="mt-2 text-sm text-elev-muted">
                    Seu maior ganho agora é manter conteúdo e materiais saindo com regularidade e qualidade
                    profissional — sem depender de improviso.
                  </p>
                </div>
              </div>
            </div>
          )}
          {narrativeIds.map((id) => {
            const svc = getService(id)
            const loss = LOSS_BY_SERVICE[id]
            if (!loss) return null
            const gated = gatedIds.includes(id)
            return (
              <div key={id} className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-400/10 text-rose-300">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-elev-text">{loss.problem}</h3>
                    <div className="mt-2 flex items-start gap-2 text-sm text-elev-muted">
                      <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                      <p>{loss.loss}</p>
                    </div>
                    {gated && (
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-elev-border bg-white/5 px-3 py-1.5 text-xs text-elev-faint">
                        <Lock className="h-3.5 w-3.5" /> Solução recomendada a partir de{' '}
                        {formatBRLShort(svc?.minRevenue)} de faturamento
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card mt-6 overflow-hidden p-0">
          <div className="bg-elev-gradient-soft p-7 text-center">
            <h2 className="font-display text-xl font-bold text-elev-text sm:text-2xl">
              A boa notícia: temos a solução exata para isso.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-elev-muted">
              Montamos um plano sob medida para o momento do {lead?.business || 'seu negócio'}. Você quer
              conhecer agora?
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => setPhase('solution')} className="btn btn-lg btn-primary">
                <Sparkles className="h-5 w-5" /> Conhecer a solução ideal
              </button>
              <button onClick={download} className="btn btn-lg btn-outline">
                <Download className="h-5 w-5" /> Baixar o resultado
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------- FASE 2: SOLUÇÃO ----------------
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center">
        <span className="chip mx-auto">
          <Sparkles className="h-3.5 w-3.5 text-elev-sky" /> Solução ideal
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-elev-text sm:text-4xl">
          {firstName}, este é o plano ideal para o {lead?.business || 'seu negócio'}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-elev-muted">
          Só o que resolve os seus problemas agora — pelo valor do seu diagnóstico.
        </p>
      </div>

      {comboIds.length === 0 ? (
        avulsoIds.length > 0 ? (
          <div className="card mt-8 p-8 text-center">
            <h2 className="font-display text-xl font-bold text-elev-text">Comece pelos serviços sob demanda</h2>
            <p className="mx-auto mt-2 max-w-md text-elev-muted">
              Pelo que você marcou, o ideal é manter conteúdo e materiais em dia. Escolha o que precisar:
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {avulsoIds.map((id) => {
                const s = getService(id)
                if (!s) return null
                return (
                  <Link key={id} to={`/servico/${id}`} className="btn btn-md btn-outline">
                    {s.name}
                  </Link>
                )
              })}
            </div>
            <button onClick={() => navigate('/servicos')} className="btn btn-lg btn-primary mx-auto mt-6">
              Ver todos os serviços <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="card mt-8 p-8 text-center">
            <h2 className="font-display text-xl font-bold text-elev-text">
              Seu foco agora é crescer o faturamento.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-elev-muted">
              Identificamos necessidades, mas o ideal é resolvê-las conforme o negócio cresce. Enquanto isso,
              veja nossos serviços que cabem em qualquer momento.
            </p>
            <button onClick={() => navigate('/servicos')} className="btn btn-lg btn-primary mx-auto mt-6">
              Ver serviços <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )
      ) : (
        <>
          <div className="mt-8 space-y-3">
            {pricing.items.map((item) => {
              const svc = item.service
              const Icon = svc.icon
              return (
                <div key={item.id} className="card flex items-center gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-elev-gradient-soft" style={{ color: svc.accent }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-elev-text">{svc.name}</h3>
                      {item.free && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-elev-gradient px-2.5 py-0.5 text-[11px] font-bold text-white">
                          <Gift className="h-3 w-3" /> Cortesia
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-elev-muted">{svc.tagline}</p>
                  </div>
                  <div className="text-right">
                    {item.free ? (
                      <div>
                        <div className="text-sm text-elev-faint line-through">{formatBRL(svc.price)}</div>
                        <div className="font-display font-bold text-emerald-300">Grátis</div>
                      </div>
                    ) : (
                      <div className="font-display font-bold text-elev-text">
                        {formatBRL(item.lineTotal)}
                        {svc.period && <span className="text-xs text-elev-muted"> {svc.period}</span>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {pricing.freeApplied && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
              <Gift className="h-4 w-4" /> Como você fechou um combo, a <b>Identidade Visual entra de cortesia</b>.
            </div>
          )}

          <div className="card mt-6 overflow-hidden p-0">
            <div className="bg-elev-gradient-soft p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-elev-muted">Investimento do plano ideal</div>
                  <div className="mt-1 flex items-end gap-3">
                    <span className="font-display text-3xl font-bold text-elev-text">{formatBRL(pricing.total)}</span>
                    <span className="pb-1 text-sm text-elev-faint line-through">{formatBRL(fullPrice)}</span>
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-300">
                    <Check className="h-4 w-4" /> Você economiza {formatBRL(fullPrice - pricing.total)} por ter feito o diagnóstico
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

      {comboIds.length > 0 && avulsoIds.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-elev-faint">
            Também pode te ajudar
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {avulsoIds.map((id) => {
              const s = getService(id)
              if (!s) return null
              return (
                <Link key={id} to={`/servico/${id}`} className="chip hover:border-elev-primary/50">
                  {s.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button onClick={download} className="btn btn-sm btn-ghost">
          <Download className="h-4 w-4" /> Baixar o resultado
        </button>
      </div>
    </div>
  )
}
