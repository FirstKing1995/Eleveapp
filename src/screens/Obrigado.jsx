import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react'
import { formatBRL } from '../lib/format.js'
import { COMPANY } from '../config/app.js'

export default function Obrigado() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-elev-text">Pedido confirmado!</h1>
      <p className="mx-auto mt-3 max-w-md text-elev-muted">
        Recebemos o seu pedido. Nossa equipe já foi notificada e vai entrar em contato para dar início ao
        trabalho.
      </p>

      {order && (
        <div className="card mx-auto mt-8 max-w-md p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-elev-muted">Pedido</span>
            <span className="font-mono text-sm text-elev-text">{order.id}</span>
          </div>
          <div className="mt-4 space-y-2">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-elev-muted">{i.name}</span>
                <span className="text-elev-text">{formatBRL(i.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-elev-border/70 pt-4">
            <span className="text-elev-muted">Total</span>
            <span className="font-display text-xl font-bold text-elev-text">{formatBRL(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {COMPANY.whatsapp && (
          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-lg btn-primary"
          >
            <MessageCircle className="h-5 w-5" /> Falar com a equipe
          </a>
        )}
        <button onClick={() => navigate('/')} className="btn btn-lg btn-outline">
          Voltar ao início <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-8 text-sm text-elev-faint">
        Quer elevar ainda mais?{' '}
        <Link to="/servicos" className="text-elev-sky hover:underline">
          Conheça os outros serviços
        </Link>
      </p>
    </div>
  )
}
