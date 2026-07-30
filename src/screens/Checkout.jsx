import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Lock, Sparkles, UserRound, ShieldCheck } from 'lucide-react'
import { useStore } from '../store/StoreContext.jsx'
import { createOrder, createPreference, markOrderPaid } from '../services/api.js'
import { formatBRL, onlyDigits, formatPhone } from '../lib/format.js'
import { EmptyState, Button } from '../components/ui/index.jsx'

export default function Checkout() {
  const navigate = useNavigate()
  const {
    cartServices,
    cart,
    priceOf,
    removeFromCart,
    clearCart,
    hasDiagnostic,
    sellerRef,
    lead,
    toast,
  } = useStore()

  const [customer, setCustomer] = useState({
    name: lead?.name || '',
    whatsapp: lead?.whatsapp ? formatPhone(lead.whatsapp) : '',
    email: lead?.email || '',
  })
  const [status, setStatus] = useState('idle')

  const items = cartServices.map((s) => {
    const paid = priceOf(s)
    return {
      id: s.id,
      name: s.name,
      price: paid,
      period: s.period,
      commissionPct: s.commission,
      commissionValue: Math.round(paid * s.commission),
    }
  })
  const total = items.reduce((a, i) => a + i.price, 0)

  const valid =
    customer.name.trim().length > 2 &&
    onlyDigits(customer.whatsapp).length >= 10 &&
    customer.email.includes('@')

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          subtitle="Faça o diagnóstico para receber o combo ideal, ou explore nossos serviços."
          action={
            <div className="flex gap-3">
              <button onClick={() => navigate('/diagnostico')} className="btn btn-md btn-primary">
                <Sparkles className="h-4 w-4" /> Fazer diagnóstico
              </button>
              <button onClick={() => navigate('/servicos')} className="btn btn-md btn-outline">
                Ver serviços
              </button>
            </div>
          }
        />
      </div>
    )
  }

  const pay = async () => {
    if (!valid) {
      toast('Preencha seus dados para continuar.', 'warning')
      return
    }
    setStatus('processing')
    const orderObj = {
      leadName: customer.name.trim(),
      whatsapp: onlyDigits(customer.whatsapp),
      email: customer.email.trim(),
      items,
      total,
      commissionTotal: items.reduce((a, i) => a + i.commissionValue, 0),
      sellerCode: sellerRef || '',
      hasDiagnostic,
    }
    try {
      const { order } = await createOrder(orderObj)
      const pref = await createPreference(order)
      if (pref && pref.init_point) {
        // Backend real: redireciona para o Mercado Pago
        window.location.href = pref.init_point
        return
      }
      // Modo demo: simula o pagamento aprovado (no real, quem faz isso e o webhook)
      await markOrderPaid(order.id)
      clearCart()
      navigate('/obrigado', { state: { order } })
    } catch (e) {
      setStatus('idle')
      toast('Não foi possível iniciar o pagamento. Tente novamente.', 'danger')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-elev-text">Carrinho</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Itens + dados */}
        <div className="space-y-6">
          <div className="card p-0">
            {items.map((i, idx) => (
              <div
                key={i.id}
                className={`flex items-center justify-between gap-4 p-5 ${idx > 0 ? 'border-t border-elev-border/70' : ''}`}
              >
                <div>
                  <div className="font-semibold text-elev-text">{i.name}</div>
                  <div className="text-sm text-elev-muted">
                    {formatBRL(i.price)}
                    {i.period && <span className="text-elev-faint"> {i.period}</span>}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(i.id)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-elev-faint transition-colors hover:bg-white/5 hover:text-rose-300"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-elev-sky" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-elev-faint">
                Seus dados
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="field-label">Nome completo</label>
                <input
                  className="input"
                  value={customer.name}
                  onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                  placeholder="Seu nome"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">WhatsApp</label>
                  <input
                    className="input"
                    inputMode="numeric"
                    value={customer.whatsapp}
                    onChange={(e) => setCustomer((c) => ({ ...c, whatsapp: formatPhone(e.target.value) }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="field-label">E-mail</label>
                  <input
                    className="input"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
                    placeholder="voce@email.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-elev-text">Resumo</h2>

            {sellerRef && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-elev-border bg-white/5 px-3 py-2 text-xs text-elev-muted">
                <UserRound className="h-3.5 w-3.5" /> Indicação: <b className="text-elev-text">{sellerRef}</b>
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-elev-muted">
                  <span>{i.name}</span>
                  <span>{formatBRL(i.price)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-elev-border/70 pt-4">
              <span className="text-elev-muted">Total</span>
              <span className="font-display text-2xl font-bold text-elev-text">{formatBRL(total)}</span>
            </div>

            {!hasDiagnostic && (
              <p className="mt-3 rounded-lg border border-elev-primary/40 bg-elev-gradient-soft px-3 py-2 text-xs text-elev-text">
                Você está pagando o valor cheio. Faça o diagnóstico e economize até 50%.
              </p>
            )}

            <Button onClick={pay} size="lg" loading={status === 'processing'} className="mt-5 w-full">
              <Lock className="h-4 w-4" />
              {status === 'processing' ? 'Processando...' : 'Pagar com Mercado Pago'}
            </Button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-elev-faint">
              <ShieldCheck className="h-3.5 w-3.5" /> Pagamento seguro via Mercado Pago
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
