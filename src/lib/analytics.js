export const PERIODS = [
  { id: 'today', label: 'Hoje' },
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: 'all', label: 'Tudo' },
]

export function inPeriod(dateStr, period) {
  if (period === 'all') return true
  const d = new Date(dateStr)
  const now = new Date()
  if (period === 'today') return d.toDateString() === now.toDateString()
  const days = period === '7d' ? 7 : 30
  const cutoff = new Date()
  cutoff.setDate(now.getDate() - days)
  cutoff.setHours(0, 0, 0, 0)
  return d >= cutoff
}

export function paidOrders(orders = []) {
  return orders.filter((o) => o.status === 'PAGO')
}

export function revenueByDay(orders = [], days = 14) {
  const map = {}
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const k = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    map[k] = 0
  }
  orders.forEach((o) => {
    const k = new Date(o.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    if (k in map) map[k] += o.total
  })
  return Object.entries(map).map(([dia, total]) => ({ dia, total }))
}

export function revenueByService(orders = []) {
  const map = {}
  orders.forEach((o) =>
    o.items.forEach((i) => {
      map[i.name] = (map[i.name] || 0) + i.price
    }),
  )
  return Object.entries(map)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
}

export function bySeller(orders = []) {
  const map = {}
  orders.forEach((o) => {
    const key = o.sellerCode || 'Direto'
    if (!map[key]) map[key] = { code: key, revenue: 0, commission: 0, count: 0, direct: !o.sellerCode }
    map[key].revenue += o.total
    map[key].commission += o.sellerCode ? o.commissionTotal || 0 : 0
    map[key].count += 1
  })
  return Object.values(map).sort((a, b) => b.revenue - a.revenue)
}

export function summarize(orders = [], leads = [], period = 'all') {
  const paid = paidOrders(orders).filter((o) => inPeriod(o.createdAt, period))
  const periodLeads = leads.filter((l) => inPeriod(l.createdAt, period))
  const revenue = paid.reduce((a, o) => a + o.total, 0)
  const commissionPayable = paid.reduce((a, o) => a + (o.sellerCode ? o.commissionTotal || 0 : 0), 0)
  const ticket = paid.length ? Math.round(revenue / paid.length) : 0
  return {
    revenue,
    orders: paid.length,
    leads: periodLeads.length,
    ticket,
    commissionPayable,
    paidOrders: paid,
    periodLeads,
  }
}
