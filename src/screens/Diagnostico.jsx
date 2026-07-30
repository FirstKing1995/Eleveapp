import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles, Loader2, HeartHandshake, ArrowRight } from 'lucide-react'
import { DIAGNOSTIC_TRAILS, BUSINESS_SEGMENTS } from '../config/diagnostic.js'
import { computeDiagnostic } from '../lib/diagnostic.js'
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

  const sequence = useMemo(
    () => ['intro', 'perfil', ...DIAGNOSTIC_TRAILS.map((t) => `trail:${t.id}`), 'intencao'],
    [],
  )
  const [stepIdx, setStepIdx] = useState(0)
  const step = sequence[stepIdx]

  const [profile, setProfile] = useState({ name: '', whatsapp: '', email: '', business: '', segment: '' })
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const progress = Math.round((stepIdx / (sequence.length - 1)) * 100)

  const setAnswer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }))

  const currentTrail =
    step && step.startsWith('trail:') ? DIAGNOSTIC_TRAILS.find((t) => t.id === step.split(':')[1]) : null

  const canAdvance = () => {
    if (step === 'perfil') {
      return (
        profile.name.trim().length > 2 &&
        onlyDigits(profile.whatsapp).length >= 10 &&
        profile.email.includes('@') &&
        profile.business.trim().length > 1 &&
        profile.segment !== ''
      )
    }
    if (currentTrail) return currentTrail.questions.every((q) => answers[q.id] !== undefined)
    return true
  }

  const goNext = () => setStepIdx((i) => Math.min(i + 1, sequence.length - 1))
  const goBack = () => setStepIdx((i) => Math.max(i - 1, 0))

  const finish = async (wantsSolution) => {
    const result = computeDiagnostic(answers)
    const leadProfile = {
      name: profile.name.trim(),
      whatsapp: onlyDigits(profile.whatsapp),
      email: profile.email.trim(),
      business: profile.business.trim(),
      segment: profile.segment,
      answers,
      recommendedItemIds: result.itemIds,
      comboTotal: result.total,
      need: result.overallNeed,
      sellerCode: sellerRef || '',
      wantsSolution,
    }
    setSubmitting(true)
    try {
      await saveLead(leadProfile)
    } catch (e) {
      // segue mesmo se o backend falhar
    }
    completeDiagnostic(result, leadProfile)
    setSubmitting(false)
    if (wantsSolution) {
      navigate('/resultado')
    } else {
      toast('Perfil salvo! Quando quiser, é só voltar e ver sua solução.', 'primary')
      navigate('/')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Progresso */}
      {step !== 'intro' && (
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

      {step === 'intro' && (
        <div className="text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-elev-gradient-soft text-elev-sky">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-elev-text sm:text-4xl">
            Vamos diagnosticar o seu negócio
          </h1>
          <p className="mx-auto mt-4 max-w-md text-elev-muted">
            Responda com sinceridade. Em poucos minutos, mostramos exatamente onde estão as
            oportunidades — e o combo ideal para resolver, pelo melhor preço.
          </p>
          <button onClick={goNext} className="btn btn-lg btn-primary mx-auto mt-8">
            Começar diagnóstico
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('/servicos')}
            className="mx-auto mt-4 block text-sm text-elev-faint hover:text-elev-muted"
          >
            Prefiro ver os serviços direto (valores sem desconto)
          </button>
        </div>
      )}

      {step === 'perfil' && (
        <div>
          <h2 className="font-display text-2xl font-bold text-elev-text">Sobre você e seu negócio</h2>
          <p className="mt-1 text-sm text-elev-muted">Para personalizar seu diagnóstico e sua proposta.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="field-label">Seu nome</label>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="Como podemos te chamar?"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">WhatsApp (com DDD)</label>
                <input
                  className="input"
                  inputMode="numeric"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile((p) => ({ ...p, whatsapp: formatPhone(e.target.value) }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="field-label">E-mail</label>
                <input
                  className="input"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="voce@email.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Nome do negócio</label>
                <input
                  className="input"
                  value={profile.business}
                  onChange={(e) => setProfile((p) => ({ ...p, business: e.target.value }))}
                  placeholder="Ex: Padaria Bela"
                />
              </div>
              <div>
                <label className="field-label">Segmento</label>
                <select
                  className="input"
                  value={profile.segment}
                  onChange={(e) => setProfile((p) => ({ ...p, segment: e.target.value }))}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {BUSINESS_SEGMENTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={goNext}
            disabled={!canAdvance()}
            className="btn btn-lg btn-primary mt-8 w-full"
          >
            Continuar <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {currentTrail && (
        <div>
          <span className="chip">{currentTrail.name}</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-elev-text">{currentTrail.intro}</h2>
          <p className="mt-1 text-sm text-elev-muted">Dê uma nota de 0 a 10 para cada ponto.</p>

          <div className="mt-8 space-y-10">
            {currentTrail.questions.map((q) => (
              <div key={q.id}>
                <p className="mb-4 text-center font-medium text-elev-text">{q.text}</p>
                <RatingScale
                  value={answers[q.id]}
                  onChange={(v) => setAnswer(q.id, v)}
                  low={q.low}
                  high={q.high}
                />
              </div>
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={!canAdvance()}
            className="btn btn-lg btn-primary mt-10 w-full"
          >
            Continuar <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {step === 'intencao' && (
        <div className="text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-elev-gradient-soft text-elev-sky">
            <HeartHandshake className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-elev-text sm:text-3xl">
            Diagnóstico concluído, {profile.name.split(' ')[0]}!
          </h2>
          <p className="mx-auto mt-4 max-w-md text-elev-muted">
            Já sabemos quais soluções fazem mais sentido para o {profile.business}. Você quer conhecer o
            combo ideal para o seu negócio agora?
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => finish(true)}
              disabled={submitting}
              className="btn btn-lg btn-primary"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Sim, quero ver minha solução
            </button>
            <button
              onClick={() => finish(false)}
              disabled={submitting}
              className="btn btn-lg btn-outline"
            >
              Agora não
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
