import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles, Loader2, ArrowRight, Check } from 'lucide-react'
import { REVENUE_RANGES, PROBLEMS, RAIOX, BUSINESS_SEGMENTS, TRAILS } from '../config/diagnostic.js'
import { computeDiagnostic, trailsForDomains, problemsToDomains } from '../lib/diagnostic.js'
import { saveLead } from '../services/api.js'
import { useStore } from '../store/StoreContext.jsx'
import { onlyDigits, formatPhone } from '../lib/format.js'
import { cn } from '../lib/utils.js'
import { ProgressBar } from '../components/ui/index.jsx'

function RatingScale({ value, onChange, low, high }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: 11 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              'h-9 w-9 rounded-lg text-sm font-bold transition-all sm:h-11 sm:w-11',
              value === i
                ? 'scale-110 bg-elev-gradient text-white shadow-elev-glow'
                : 'border border-elev-border bg-elev-bg2/60 text-elev-muted hover:border-elev-primary/50 hover:text-elev-text',
            )}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between gap-4 px-1 text-[11px] font-medium text-elev-faint">
        <span className="max-w-[45%] leading-tight">
          <span className="mb-0.5 block text-elev-pink">0</span>
          {low}
        </span>
        <span className="max-w-[45%] text-right leading-tight">
          <span className="mb-0.5 block text-elev-sky">10</span>
          {high}
        </span>
      </div>
    </div>
  )
}

export default function Diagnostico() {
  const navigate = useNavigate()
  const { sellerRef, completeDiagnostic, toast } = useStore()

  const [stage, setStage] = useState('intro') // intro | perfil | problemas | trilha
  const [trailIdx, setTrailIdx] = useState(0)
  const [profile, setProfile] = useState({ name: '', whatsapp: '', email: '', business: '', segment: '', revenueId: '' })
  const [problems, setProblems] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const revenueValue = useMemo(
    () => REVENUE_RANGES.find((r) => r.id === profile.revenueId)?.value || 0,
    [profile.revenueId],
  )
  const askedTrails = useMemo(
    () => trailsForDomains(problemsToDomains(problems), revenueValue),
    [problems, revenueValue],
  )
  const currentTrail = stage === 'trilha' ? TRAILS[askedTrails[trailIdx]] : null

  // Scroll ao topo a cada mudança de etapa
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [stage, trailIdx])

  const totalSteps = 2 + Math.max(1, askedTrails.length) // perfil + problemas + trilhas
  const stepNow =
    stage === 'perfil' ? 1 : stage === 'problemas' ? 2 : stage === 'trilha' ? 3 + trailIdx : 0
  const progress = stage === 'intro' ? 0 : Math.round((stepNow / (totalSteps + 1)) * 100)

  const setAnswer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }))

  const toggleProblem = (id) => {
    if (id === RAIOX.id) {
      setProblems((p) => (p.includes(RAIOX.id) ? [] : [RAIOX.id]))
      return
    }
    setProblems((p) => {
      const withoutRaiox = p.filter((x) => x !== RAIOX.id)
      return withoutRaiox.includes(id) ? withoutRaiox.filter((x) => x !== id) : [...withoutRaiox, id]
    })
  }

  const canAdvance = () => {
    if (stage === 'perfil') {
      return (
        profile.name.trim().length > 2 &&
        onlyDigits(profile.whatsapp).length >= 10 &&
        profile.email.includes('@') &&
        profile.business.trim().length > 1 &&
        profile.segment !== '' &&
        profile.revenueId !== ''
      )
    }
    if (stage === 'problemas') return problems.length > 0
    if (stage === 'trilha' && currentTrail) {
      return currentTrail.questions.filter((q) => !q.type).every((q) => answers[q.id] !== undefined)
    }
    return true
  }

  const goBack = () => {
    if (stage === 'perfil') setStage('intro')
    else if (stage === 'problemas') setStage('perfil')
    else if (stage === 'trilha') {
      if (trailIdx > 0) setTrailIdx((i) => i - 1)
      else setStage('problemas')
    }
  }

  const goNext = () => {
    if (stage === 'perfil') setStage('problemas')
    else if (stage === 'problemas') {
      if (askedTrails.length === 0) {
        finish() // só marcou avulsos (conteúdo/impressos): vai direto ao resultado
        return
      }
      setTrailIdx(0)
      setStage('trilha')
    } else if (stage === 'trilha') {
      if (trailIdx < askedTrails.length - 1) setTrailIdx((i) => i + 1)
      else finish()
    }
  }

  const finish = async () => {
    const result = computeDiagnostic({ revenueValue, problems, answers })
    const revenueLabel = REVENUE_RANGES.find((r) => r.id === profile.revenueId)?.label || ''
    const leadProfile = {
      name: profile.name.trim(),
      whatsapp: onlyDigits(profile.whatsapp),
      email: profile.email.trim(),
      business: profile.business.trim(),
      segment: profile.segment,
      revenueValue,
      revenueLabel,
      problems,
      answers,
      recommendedItemIds: result.comboItemIds,
      gatedOutIds: result.gatedOutIds,
      avulsoSuggest: result.avulsoSuggest,
      comboTotal: result.total,
      need: result.overallNeed,
      sellerCode: sellerRef || '',
    }
    setSubmitting(true)
    try {
      await saveLead(leadProfile)
    } catch (e) {
      // segue mesmo se o backend falhar
    }
    completeDiagnostic(result, leadProfile)
    setSubmitting(false)
    navigate('/resultado')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {stage !== 'intro' && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs text-elev-faint">
            <button onClick={goBack} className="inline-flex items-center gap-1 hover:text-elev-text">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </button>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {/* INTRO */}
      {stage === 'intro' && (
        <div className="text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-elev-gradient-soft text-elev-sky">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-elev-text sm:text-4xl">
            Vamos diagnosticar o seu negócio
          </h1>
          <p className="mx-auto mt-4 max-w-md text-elev-muted">
            Responda com sinceridade. Em poucos minutos, mostramos exatamente onde estão as oportunidades —
            e o que você está perdendo por não resolver.
          </p>
          <button onClick={() => setStage('perfil')} className="btn btn-lg btn-primary mx-auto mt-8">
            Começar diagnóstico
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* PERFIL */}
      {stage === 'perfil' && (
        <div>
          <h2 className="font-display text-2xl font-bold text-elev-text">Sobre você e seu negócio</h2>
          <p className="mt-1 text-sm text-elev-muted">Para personalizar seu diagnóstico e sua proposta.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="field-label">Seu nome</label>
              <input className="input" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Como podemos te chamar?" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">WhatsApp (com DDD)</label>
                <input className="input" inputMode="numeric" value={profile.whatsapp} onChange={(e) => setProfile((p) => ({ ...p, whatsapp: formatPhone(e.target.value) }))} placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="field-label">E-mail</label>
                <input className="input" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="voce@email.com" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Nome do negócio</label>
                <input className="input" value={profile.business} onChange={(e) => setProfile((p) => ({ ...p, business: e.target.value }))} placeholder="Ex: Padaria Bela" />
              </div>
              <div>
                <label className="field-label">Segmento</label>
                <select className="input" value={profile.segment} onChange={(e) => setProfile((p) => ({ ...p, segment: e.target.value }))}>
                  <option value="" disabled>Selecione...</option>
                  {BUSINESS_SEGMENTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label">Faturamento mensal aproximado</label>
              <select className="input" value={profile.revenueId} onChange={(e) => setProfile((p) => ({ ...p, revenueId: e.target.value }))}>
                <option value="" disabled>Selecione...</option>
                {REVENUE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={goNext} disabled={!canAdvance()} className="btn btn-lg btn-primary mt-8 w-full">
            Continuar <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* PROBLEMAS */}
      {stage === 'problemas' && (
        <div>
          <h2 className="font-display text-2xl font-bold text-elev-text">
            Quais são os maiores desafios do seu negócio hoje?
          </h2>
          <p className="mt-1 text-sm text-elev-muted">Marque todos que se aplicam — o diagnóstico se adapta às suas escolhas.</p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {PROBLEMS.map((p) => {
              const active = problems.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProblem(p.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all',
                    active
                      ? 'border-elev-primary/70 bg-elev-gradient-soft text-elev-text'
                      : 'border-elev-border bg-elev-bg2/40 text-elev-muted hover:border-elev-primary/40',
                  )}
                >
                  <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-md border', active ? 'border-transparent bg-elev-gradient' : 'border-elev-border')}>
                    {active && <Check className="h-3.5 w-3.5 text-white" />}
                  </span>
                  {p.label}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => toggleProblem(RAIOX.id)}
            className={cn(
              'mt-2.5 flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all',
              problems.includes(RAIOX.id)
                ? 'border-elev-primary/70 bg-elev-gradient-soft text-elev-text'
                : 'border-dashed border-elev-border bg-transparent text-elev-muted hover:border-elev-primary/40',
            )}
          >
            <Sparkles className="h-4 w-4 text-elev-sky" />
            {RAIOX.label}
          </button>
          <button onClick={goNext} disabled={!canAdvance()} className="btn btn-lg btn-primary mt-8 w-full">
            Continuar <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* TRILHA */}
      {stage === 'trilha' && currentTrail && (
        <div>
          <div className="flex items-center justify-between">
            <span className="chip">{currentTrail.name}</span>
            <span className="text-xs text-elev-faint">
              Trilha {trailIdx + 1} de {askedTrails.length}
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-elev-text">{currentTrail.intro}</h2>

          <div className="mt-8 space-y-9">
            {currentTrail.questions.map((q) =>
              q.type ? (
                <div key={q.id}>
                  <p className="mb-3 font-medium text-elev-text">{q.text}</p>
                  {q.type === 'textarea' ? (
                    <textarea
                      className="input min-h-[96px] resize-y py-3"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                    />
                  ) : (
                    <input
                      className="input"
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder}
                    />
                  )}
                </div>
              ) : (
                <div key={q.id}>
                  <p className="mb-4 text-center font-medium text-elev-text">{q.text}</p>
                  <RatingScale value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} low={q.low} high={q.high} />
                </div>
              ),
            )}
          </div>

          <button onClick={goNext} disabled={!canAdvance() || submitting} className="btn btn-lg btn-primary mt-10 w-full">
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Gerando resultado...
              </>
            ) : trailIdx < askedTrails.length - 1 ? (
              <>
                Continuar <ChevronRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Ver meu resultado <Sparkles className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
