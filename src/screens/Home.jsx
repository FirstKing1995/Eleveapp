import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ClipboardCheck, Layers, Rocket, ShieldCheck, Check } from 'lucide-react'
import { ElevMark } from '../components/brand/Logo.jsx'
import { SERVICES } from '../config/services.js'
import { COMPANY } from '../config/app.js'

function Step({ n, icon: Icon, title, text }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-elev-gradient-soft text-elev-sky">
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-display text-sm font-bold text-elev-faint">Passo {n}</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-elev-text">{title}</h3>
      <p className="mt-1 text-sm text-elev-muted">{text}</p>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-8 pt-16 md:grid-cols-2 md:pt-24">
          <div>
            <span className="chip">
              <Sparkles className="h-3.5 w-3.5 text-elev-sky" />
              Diagnóstico inteligente do seu negócio
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-elev-text sm:text-5xl">
              Descubra <span className="gradient-text">exatamente</span> o que o seu negócio precisa para crescer.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-elev-muted">{COMPANY.subtitle}</p>

            <div className="mt-8">
              <button onClick={() => navigate('/diagnostico')} className="btn btn-lg btn-primary">
                <Sparkles className="h-5 w-5" />
                Fazer meu diagnóstico
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-elev-muted">
              <ShieldCheck className="h-4 w-4 text-elev-sky" />
              Quem faz o diagnóstico <b className="text-elev-text">paga menos</b> — até 50% menos.
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-elev-gradient opacity-20 blur-3xl" />
            <ElevMark className="animate-floaty" style={{ height: 220, width: 'auto' }} />
          </div>
        </div>
      </section>

      {/* SOLUCOES (sem precos) */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title text-2xl sm:text-3xl">Nossas soluções</h2>
            <p className="mt-1 text-elev-muted">Marca, marketing e sistemas para elevar o seu negócio.</p>
          </div>
          <Link to="/servicos" className="text-sm font-medium text-elev-sky hover:underline">
            Ver serviços e valores →
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.id} to={`/servico/${s.id}`} className="card card-hover flex flex-col p-6">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl2 bg-elev-gradient-soft"
                  style={{ color: s.accent }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-elev-text">{s.name}</h3>
                <p className="mt-1 text-sm text-elev-muted">{s.tagline}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.includes.slice(0, 3).map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs text-elev-muted">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-elev-sky" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-4 text-sm font-medium text-elev-sky">Saiba mais →</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="section-title text-2xl sm:text-3xl">Como funciona</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Step n={1} icon={ClipboardCheck} title="Você faz o diagnóstico" text="Um quiz rápido identifica os pontos fracos do seu negócio — marca, marketing ou operação." />
          <Step n={2} icon={Layers} title="Montamos o combo ideal" text="Com base nas respostas e no seu momento, agrupamos só os serviços que resolvem os seus problemas." />
          <Step n={3} icon={Rocket} title="Colocamos em prática" text="Você contrata em poucos cliques e a gente executa. Simples, profissional e sob medida." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="relative overflow-hidden rounded-2xl2 border border-elev-border bg-elev-gradient-soft p-8 sm:p-12">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold text-elev-text sm:text-3xl">
                Pronto para elevar o seu negócio?
              </h2>
              <p className="mt-2 max-w-xl text-elev-muted">
                Leva menos de 3 minutos. No final, você recebe o diagnóstico completo e a solução exata para o
                seu momento.
              </p>
            </div>
            <button onClick={() => navigate('/diagnostico')} className="btn btn-lg btn-primary shrink-0">
              <Sparkles className="h-5 w-5" />
              Começar agora
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
