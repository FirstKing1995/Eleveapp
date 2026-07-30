import {
  getService,
  displayPrice,
  commissionFor,
  HIGHER_VALUE_SERVICES,
  FREE_COMBO_SERVICE,
} from '../config/services.js'

// Desconto por unidade dos avulsos: acumula discountStep por unidade extra, limitado ao teto.
export function avulsoDiscountPerUnit(service, qty) {
  if (!service || qty <= 1) return 0
  const raw = service.price * (service.discountStep || 0) * (qty - 1)
  return Math.min(service.discountCap || 0, Math.round(raw))
}

export function avulsoUnit(service, qty) {
  return service.price - avulsoDiscountPerUnit(service, qty)
}

export function avulsoLine(service, qty) {
  const discountPerUnit = avulsoDiscountPerUnit(service, qty)
  const unit = service.price - discountPerUnit
  return {
    base: service.price,
    unit,
    qty,
    discountPerUnit,
    lineTotal: unit * qty,
    savings: discountPerUnit * qty,
  }
}

// lines = [{ id, qty }]  ->  precificacao completa do carrinho/combo
export function computeCart(lines = [], hasDiagnostic = false) {
  const norm = lines
    .map((l) => ({ id: l.id, qty: Math.max(1, l.qty || 1), service: getService(l.id) }))
    .filter((l) => l.service)

  const items = norm.map((l) => {
    if (l.service.avulso) {
      const al = avulsoLine(l.service, l.qty)
      return {
        id: l.id,
        service: l.service,
        avulso: true,
        qty: l.qty,
        base: al.base,
        unit: al.unit,
        discountPerUnit: al.discountPerUnit,
        lineTotal: al.lineTotal,
        savings: al.savings,
        free: false,
      }
    }
    const unit = displayPrice(l.service, hasDiagnostic)
    return {
      id: l.id,
      service: l.service,
      avulso: false,
      qty: 1,
      base: unit,
      unit,
      discountPerUnit: 0,
      lineTotal: unit,
      savings: 0,
      free: false,
    }
  })

  // Regra do combo: >1 servico de trilha + um servico de maior valor => Identidade Visual gratis.
  const trilhaItems = items.filter((i) => !i.avulso)
  const hasHigherValue = trilhaItems.some((i) => HIGHER_VALUE_SERVICES.includes(i.id))
  const freeApplied = trilhaItems.length > 1 && hasHigherValue

  if (freeApplied) {
    const existing = items.find((i) => i.id === FREE_COMBO_SERVICE)
    if (existing) {
      existing.savings = existing.lineTotal
      existing.lineTotal = 0
      existing.unit = 0
      existing.free = true
    } else {
      // brinde: inclui a Identidade Visual de cortesia
      const svc = getService(FREE_COMBO_SERVICE)
      if (svc) {
        items.push({
          id: svc.id,
          service: svc,
          avulso: false,
          qty: 1,
          base: svc.price,
          unit: 0,
          discountPerUnit: 0,
          lineTotal: 0,
          savings: svc.price,
          free: true,
          bonus: true,
        })
      }
    }
    // Identidade Visual inclui a logo -> remove a logo paga quando a ID entra
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].id === 'logo') items.splice(i, 1)
    }
  }

  const subtotal = items.reduce((a, i) => a + (i.free ? i.base * i.qty : i.lineTotal), 0)
  const total = items.reduce((a, i) => a + i.lineTotal, 0)
  const savings = items.reduce((a, i) => a + (i.savings || 0), 0)
  const commissionTotal = items.reduce(
    (a, i) => a + (i.free ? 0 : commissionFor(i.id, i.lineTotal)),
    0,
  )

  return { items, subtotal, total, savings, commissionTotal, freeApplied }
}
