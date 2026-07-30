import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Wallet,
  Receipt,
  RefreshCcw,
  UserPlus,
  Trophy,
} from 'lucide-react'
import InternalShell, { LoginCard } from '../components/layout/InternalShell.jsx'
import { useStore } from '../store/StoreContext.jsx'
import { loginAdmin, getAdminData, createSeller, listSellers, resetDemoData } from '../services/api.js'
import { DEMO_MODE, DEMO_ADMIN, PUBLIC_URL } from '../config/app.js'
import {
  PERIODS,
  inPeriod,
  paidOrders,
  revenueByDay,
  revenueByService,
  bySeller,
  summarize,
} from '../lib/analytics.js'
import { formatBRL, formatDate } from '../lib/format.js'
import { Button, Stat, EmptyState } from '../components/ui/index.jsx'

function Login() {
  const { loginAdminSession, toast } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await loginAdmin(email, password)
    setLoading(false)
    if (res.ok) {
      loginAdminSession(res.admin)
      toast('Bem-vindo ao painel.', 'primary')
    } else toast(res.error || 'Falha no login.', 'danger')
  }
  return (
    <LoginCard title="Painel administrativo" subtitle="Acesso restrito.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">E-mail</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@elev" />
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
            Demo: {DEMO_ADMIN.email} / senha {DEMO_ADMIN.password}
          </p>
        )}
      </form>
    </LoginCard>
  )
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-elev-sky" />
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-elev-faint">{children}</h2>
    </div>
  )
}

function Dashboard() {
  const { admin, logoutAdmin, toast } = useStore()
  const [raw, setRaw] = useState({ leads: [], orders: [], sellers: [] })
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(true)
  const [newSeller, setNewSeller] = useState({ name: '', email: '', password: '', code: '' })

  const load = () => {
    setLoading(true)
    getAdminData().then((res) => {
      if (res.ok) setRaw({ leads: res.leads, orders: res.orders, sellers: res.sellers })
      setLoading(false)
    })
  }
  useEffect(load, [])

  const s = useMemo(() => summarize(raw.orders, raw.leads, period), [raw, period])
  const dailyData = useMemo(() => revenueByDay(paidOrders(raw.orders), 14), [raw])
  const serviceData = useMemo(() => revenueByService(s.paidOrders), [s])
  const sellerData = useMemo(() => bySeller(s.paidOrders), [s])
  const maxService = Math.max(1, ...serviceData.map((d) => d.total))

  const recentLeads = useMemo(
    () => [...raw.leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
    [raw],
  )
  const recentOrders = useMemo(
    () =>
      [...paidOrders(raw.orders)]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [raw],
  )

  const addSeller = async (e) => {
    e.preventDefault()
    if (newSeller.name.length < 2 || !newSeller.email.includes('@') || newSeller.password.length < 3 || !newSeller.code) {
      toast('Preencha todos os campos do vendedor.', 'warning')
      return
    }
    const res = await createSeller({ ...newSeller, code: newSeller.code.toUpperCase() })
    if (res.ok) {
      toast('Vendedor cadastrado!', 'primary')
      setNewSeller({ name: '', email: '', password: '', code: '' })
      const list = await listSellers()
      if (list.ok) setRaw((r) => ({ ...r, sellers: list.sellers }))
    } else toast(res.error || 'Erro ao cadastrar.', 'danger')
  }

  const doReset = () => {
    resetDemoData()
    load()
    toast('Dados de demonstração recriados.', 'primary')
  }

  return (
    <InternalShell area="Administração" user={admin.name || admin.email} onLogout={logoutAdmin}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-elev-text">Visão geral</h1>
          <p className="text-sm text-elev-muted">Faturamento, leads e vendas do seu negócio.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-elev-border bg-elev-bg2/40 p-1">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p.id ? 'bg-elev-gradient text-white' : 'text-elev-muted hover:text-elev-text'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={load} className="btn btn-sm btn-outline" aria-label="Atualizar">
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Faturamento" value={formatBRL(s.revenue)} icon={TrendingUp} />
        <Stat label="Pedidos pagos" value={s.orders} icon={ShoppingBag} />
        <Stat label="Leads" value={s.leads} icon={Users} />
        <Stat label="Ticket médio" value={formatBRL(s.ticket)} icon={Receipt} />
        <Stat label="Comissões a pagar" value={formatBRL(s.commissionPayable)} icon={Wallet} />
      </div>

      {/* Grafico faturamento por dia */}
      <div className="card mt-6 p-6">
        <SectionTitle icon={TrendingUp}>Faturamento — últimos 14 dias</SectionTitle>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2150" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: '#6E6690', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#6E6690', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <Tooltip
                cursor={{ fill: 'rgba(139,92,246,0.08)' }}
                contentStyle={{
                  background: '#191233',
                  border: '1px solid #2c2150',
                  borderRadius: 12,
                  color: '#F3F1FB',
                }}
                formatter={(v) => [formatBRL(v), 'Faturamento']}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Servico + Vendedor */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <SectionTitle icon={ShoppingBag}>Receita por serviço</SectionTitle>
          {serviceData.length === 0 ? (
            <p className="py-6 text-center text-sm text-elev-muted">Sem vendas no período.</p>
          ) : (
            <div className="space-y-4">
              {serviceData.map((d) => (
                <div key={d.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-elev-muted">{d.name}</span>
                    <span className="font-semibold text-elev-text">{formatBRL(d.total)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-elev-gradient"
                      style={{ width: `${(d.total / maxService) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <SectionTitle icon={Trophy}>Desempenho por vendedor</SectionTitle>
          {sellerData.length === 0 ? (
            <p className="py-6 text-center text-sm text-elev-muted">Sem vendas no período.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-elev-faint">
                    <th className="pb-3 font-semibold">Origem</th>
                    <th className="pb-3 text-right font-semibold">Vendas</th>
                    <th className="pb-3 text-right font-semibold">Faturamento</th>
                    <th className="pb-3 text-right font-semibold">Comissão</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerData.map((d) => (
                    <tr key={d.code} className="border-t border-elev-border/60">
                      <td className="py-3 text-elev-text">
                        {d.direct ? <span className="text-elev-faint">Direto (sem vendedor)</span> : d.code}
                      </td>
                      <td className="py-3 text-right text-elev-muted">{d.count}</td>
                      <td className="py-3 text-right text-elev-text">{formatBRL(d.revenue)}</td>
                      <td className="py-3 text-right text-emerald-300">{formatBRL(d.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Leads recentes */}
      <div className="card mt-6 p-0">
        <div className="border-b border-elev-border/70 p-5">
          <SectionTitle icon={Users}>Leads recentes</SectionTitle>
        </div>
        {recentLeads.length === 0 ? (
          <EmptyState icon={Users} title="Nenhum lead ainda" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-elev-faint">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Nome</th>
                  <th className="p-4 font-semibold">Negócio</th>
                  <th className="p-4 font-semibold">Combo sugerido</th>
                  <th className="p-4 text-right font-semibold">Potencial</th>
                  <th className="p-4 font-semibold">Origem</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id} className="border-t border-elev-border/60">
                    <td className="p-4 text-elev-muted">{formatDate(l.createdAt)}</td>
                    <td className="p-4 text-elev-text">
                      {l.name}
                      <div className="text-xs text-elev-faint">{l.whatsapp}</div>
                    </td>
                    <td className="p-4 text-elev-muted">{l.business}</td>
                    <td className="p-4 text-elev-muted">
                      {(l.recommendedItemIds || []).length ? l.recommendedItemIds.join(' + ') : '—'}
                    </td>
                    <td className="p-4 text-right text-elev-text">{formatBRL(l.comboTotal || 0)}</td>
                    <td className="p-4 text-elev-muted">{l.sellerCode || 'Direto'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pedidos recentes */}
      <div className="card mt-6 p-0">
        <div className="border-b border-elev-border/70 p-5">
          <SectionTitle icon={Receipt}>Pedidos recentes</SectionTitle>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState icon={Receipt} title="Nenhum pedido ainda" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-elev-faint">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Pedido</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Serviços</th>
                  <th className="p-4 text-right font-semibold">Valor</th>
                  <th className="p-4 font-semibold">Origem</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-elev-border/60">
                    <td className="p-4 text-elev-muted">{formatDate(o.createdAt)}</td>
                    <td className="p-4 font-mono text-xs text-elev-muted">{o.id}</td>
                    <td className="p-4 text-elev-text">{o.leadName}</td>
                    <td className="p-4 text-elev-muted">{o.items.map((i) => i.name).join(', ')}</td>
                    <td className="p-4 text-right text-elev-text">{formatBRL(o.total)}</td>
                    <td className="p-4 text-elev-muted">{o.sellerCode || 'Direto'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vendedores */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-0">
          <div className="border-b border-elev-border/70 p-5">
            <SectionTitle icon={Users}>Time comercial</SectionTitle>
          </div>
          <div className="divide-y divide-elev-border/60">
            {raw.sellers.map((v) => (
              <div key={v.id || v.code} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold text-elev-text">{v.name}</div>
                  <div className="text-xs text-elev-faint">
                    {v.email} · código <b className="text-elev-muted">{v.code}</b>
                  </div>
                </div>
                <span className="text-xs text-elev-muted">{v.active === false ? 'inativo' : 'ativo'}</span>
              </div>
            ))}
            {raw.sellers.length === 0 && (
              <div className="p-6 text-center text-sm text-elev-muted">Nenhum vendedor cadastrado.</div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <SectionTitle icon={UserPlus}>Novo vendedor</SectionTitle>
          <form onSubmit={addSeller} className="space-y-3">
            <input
              className="input"
              placeholder="Nome"
              value={newSeller.name}
              onChange={(e) => setNewSeller((n) => ({ ...n, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="E-mail"
              value={newSeller.email}
              onChange={(e) => setNewSeller((n) => ({ ...n, email: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Senha"
                value={newSeller.password}
                onChange={(e) => setNewSeller((n) => ({ ...n, password: e.target.value }))}
              />
              <input
                className="input uppercase"
                placeholder="CÓDIGO"
                value={newSeller.code}
                onChange={(e) => setNewSeller((n) => ({ ...n, code: e.target.value.toUpperCase() }))}
              />
            </div>
            <Button type="submit" className="w-full">
              <UserPlus className="h-4 w-4" /> Cadastrar vendedor
            </Button>
          </form>
        </div>
      </div>

      {DEMO_MODE && (
        <div className="mt-8 flex items-center justify-between rounded-xl border border-elev-border bg-elev-bg2/40 p-4">
          <p className="text-sm text-elev-muted">
            Modo demonstração — os dados ficam no seu navegador. Conecte o Google Sheets para dados reais.
          </p>
          <button onClick={doReset} className="btn btn-sm btn-outline">
            <RefreshCcw className="h-4 w-4" /> Recriar dados demo
          </button>
        </div>
      )}
    </InternalShell>
  )
}

export default function Admin() {
  const { admin } = useStore()
  return admin ? <Dashboard /> : <Login />
}
