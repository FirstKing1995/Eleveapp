import { useEffect, useMemo, useState } from 'react'
import { Copy, Link2, TrendingUp, Wallet, Users, ShoppingBag, Check } from 'lucide-react'
import InternalShell, { LoginCard } from '../components/layout/InternalShell.jsx'
import { useStore } from '../store/StoreContext.jsx'
import { loginSeller, getSellerData } from '../services/api.js'
import { SERVICES } from '../config/services.js'
import { PUBLIC_URL, DEMO_MODE, DEMO_SELLER } from '../config/app.js'
import { paidOrders } from '../lib/analytics.js'
import { formatBRL, formatDate } from '../lib/format.js'
import { Button, Stat, EmptyState } from '../components/ui/index.jsx'

function CopyLink({ label, url }) {
  const { toast } = useStore()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast('Link copiado!', 'primary')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast('Copie manualmente: ' + url, 'warning')
    }
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-elev-border bg-elev-bg2/40 p-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-elev-text">{label}</div>
        <div className="truncate text-xs text-elev-faint">{url}</div>
      </div>
      <button onClick={copy} className="btn btn-sm btn-outline shrink-0">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        Copiar
      </button>
    </div>
  )
}

function Login() {
  const { loginSellerSession, toast } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await loginSeller(email, password)
    setLoading(false)
    if (res.ok) {
      loginSellerSession(res.seller)
      toast(`Bem-vindo(a), ${res.seller.name}!`, 'primary')
    } else {
      toast(res.error || 'Falha no login.', 'danger')
    }
  }

  return (
    <LoginCard title="Área comercial" subtitle="Acesse seus links e comissões.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">E-mail</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@elev" />
        </div>
        <div>
          <label className="field-label">Senha</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </div>
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Entrar
        </Button>
        {DEMO_MODE && (
          <p className="text-center text-xs text-elev-faint">
            Demo: {DEMO_SELLER.email} / senha {DEMO_SELLER.password}
          </p>
        )}
      </form>
    </LoginCard>
  )
}

function Dashboard() {
  const { seller, logoutSeller } = useStore()
  const [data, setData] = useState({ orders: [], leads: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    getSellerData(seller.code).then((res) => {
      if (alive && res.ok) setData({ orders: res.orders, leads: res.leads })
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [seller.code])

  const base = (PUBLIC_URL || '').replace(/#.*$/, '')
  const link = (path) => `${base}#${path}?ref=${seller.code}`

  const stats = useMemo(() => {
    const paid = paidOrders(data.orders)
    const revenue = paid.reduce((a, o) => a + o.total, 0)
    const commission = paid.reduce((a, o) => a + (o.commissionTotal || 0), 0)
    return { count: paid.length, revenue, commission, leads: data.leads.length }
  }, [data])

  return (
    <InternalShell area="Comercial" user={seller.name} onLogout={logoutSeller}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-elev-text">Olá, {seller.name.split(' ')[0]}</h1>
          <p className="text-sm text-elev-muted">
            Seu código de indicação: <b className="text-elev-text">{seller.code}</b>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Vendas" value={stats.count} icon={ShoppingBag} />
        <Stat label="Faturamento gerado" value={formatBRL(stats.revenue)} icon={TrendingUp} />
        <Stat label="Comissão acumulada" value={formatBRL(stats.commission)} icon={Wallet} tone="up" hint="a receber" />
        <Stat label="Leads indicados" value={stats.leads} icon={Users} />
      </div>

      {/* Links rastreaveis */}
      <div className="card mt-6 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-elev-sky" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-elev-faint">
            Seus links de venda
          </h2>
        </div>
        <p className="mb-4 text-sm text-elev-muted">
          Toda venda feita por estes links é atribuída a você automaticamente.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <CopyLink label="Diagnóstico (recomendado)" url={link('/diagnostico')} />
          <CopyLink label="Vitrine de serviços" url={link('/servicos')} />
          {SERVICES.map((s) => (
            <CopyLink key={s.id} label={s.name} url={link(`/servico/${s.id}`)} />
          ))}
        </div>
      </div>

      {/* Vendas */}
      <div className="card mt-6 p-0">
        <div className="border-b border-elev-border/70 p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-elev-faint">
            Minhas vendas
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-elev-muted">Carregando...</div>
        ) : data.orders.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Nenhuma venda ainda" subtitle="Compartilhe seus links para começar." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-elev-faint">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Serviços</th>
                  <th className="p-4 text-right font-semibold">Valor</th>
                  <th className="p-4 text-right font-semibold">Comissão</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o) => (
                  <tr key={o.id} className="border-t border-elev-border/60">
                    <td className="p-4 text-elev-muted">{formatDate(o.createdAt)}</td>
                    <td className="p-4 text-elev-text">{o.leadName}</td>
                    <td className="p-4 text-elev-muted">{o.items.map((i) => i.name).join(', ')}</td>
                    <td className="p-4 text-right text-elev-text">{formatBRL(o.total)}</td>
                    <td className="p-4 text-right font-semibold text-emerald-300">
                      {formatBRL(o.commissionTotal || 0)}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-300">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </InternalShell>
  )
}

export default function Comercial() {
  const { seller } = useStore()
  return seller ? <Dashboard /> : <InternalShellLogin />
}

function InternalShellLogin() {
  return (
    <div className="min-h-screen">
      <Login />
    </div>
  )
}
