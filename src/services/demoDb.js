// "Banco de dados" de demonstracao (localStorage). Espelha Apps Script + Sheets.

import { getService } from '../config/services.js'
import { TRAILS } from '../config/diagnostic.js'
import { computeDiagnostic, problemsToDomains, trailsForDomains } from '../lib/diagnostic.js'
import { computeCart } from '../lib/pricing.js'
import { shortId } from '../lib/utils.js'

const KEY = 'elev_demo_db_v2'

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(9 + (n % 8), (n * 7) % 60, 0, 0)
  return d.toISOString()
}

function mkLead({ name, whatsapp, email, business, segment, revenueValue, problems, sellerCode, when }) {
  const domains = problemsToDomains(problems)
  const asked = trailsForDomains(domains, revenueValue)
  const answers = {}
  asked.forEach((tid) =>
    TRAILS[tid].questions.forEach((q) => {
      if (!q.type) answers[q.id] = 2
    }),
  )
  const diag = computeDiagnostic({ revenueValue, problems, answers })
  return {
    id: shortId('LEAD'),
    createdAt: when,
    name,
    whatsapp,
    email,
    business,
    segment,
    revenueValue,
    problems,
    answers,
    recommendedItemIds: diag.comboItemIds,
    comboTotal: diag.total,
    need: diag.overallNeed,
    sellerCode: sellerCode || '',
    status: 'novo',
  }
}

function buildOrder({ id, leadName, whatsapp, email, lines, sellerCode, hasDiagnostic, when, status }) {
  const pricing = computeCart(lines, hasDiagnostic)
  const items = pricing.items.map((i) => ({
    id: i.id,
    name: i.service.name,
    qty: i.qty,
    price: i.lineTotal,
    free: i.free,
    commissionPct: i.service.commission,
    commissionValue: i.free ? 0 : Math.round(i.lineTotal * (i.service.commission || 0)),
  }))
  return {
    id,
    createdAt: when,
    leadName,
    whatsapp,
    email,
    items,
    total: pricing.total,
    commissionTotal: pricing.commissionTotal,
    sellerCode: sellerCode || '',
    hasDiagnostic: !!hasDiagnostic,
    status: status || 'PAGO',
    paymentId: 'demo-' + id,
  }
}

function seed() {
  const sellers = [
    { id: 'S1', name: 'Ana (Comercial)', email: 'vendedor@elev', password: '123', code: 'DEMO1', active: true, createdAt: daysAgo(60) },
    { id: 'S2', name: 'Bruno (Comercial)', email: 'bruno@elev', password: '123', code: 'BRUNO', active: true, createdAt: daysAgo(45) },
  ]

  const leads = [
    mkLead({ name: 'Mariana Costa', whatsapp: '11988887777', email: 'mariana@padariabela.com', business: 'Padaria Bela', segment: 'Alimentação (bar, restaurante, etc.)', revenueValue: 20000, problems: ['marca', 'material'], sellerCode: 'DEMO1', when: daysAgo(28) }),
    mkLead({ name: 'Rafael Lima', whatsapp: '21977776666', email: 'rafael@studiorl.com', business: 'Studio RL', segment: 'Serviços (salão, clínica, oficina, etc.)', revenueValue: 80000, problems: ['clientes', 'redes', 'anuncios'], sellerCode: 'DEMO1', when: daysAgo(22) }),
    mkLead({ name: 'Carla Nogueira', whatsapp: '31966665555', email: 'carla@moveiscn.com', business: 'Móveis CN', segment: 'Comércio / Loja', revenueValue: 150000, problems: ['clientes', 'tempo', 'appproprio'], sellerCode: 'BRUNO', when: daysAgo(16) }),
    mkLead({ name: 'Diego Alves', whatsapp: '11955554444', email: 'diego@fitpro.com', business: 'FitPro Assessoria', segment: 'Prestador autônomo / Profissional liberal', revenueValue: 8000, problems: ['marca'], sellerCode: '', when: daysAgo(12) }),
    mkLead({ name: 'Patrícia Souza', whatsapp: '41944443333', email: 'patricia@docebella.com', business: 'Doce Bella', segment: 'Alimentação (bar, restaurante, etc.)', revenueValue: 45000, problems: ['marca', 'clientes'], sellerCode: 'DEMO1', when: daysAgo(7) }),
    mkLead({ name: 'Eduardo Pinto', whatsapp: '51933332222', email: 'edu@techeasy.com', business: 'TechEasy', segment: 'Infoproduto / Negócio digital', revenueValue: 150000, problems: ['appproprio', 'tempo'], sellerCode: 'BRUNO', when: daysAgo(4) }),
    mkLead({ name: 'Juliana Reis', whatsapp: '11922221111', email: 'ju@espacoluz.com', business: 'Espaço Luz', segment: 'Serviços (salão, clínica, oficina, etc.)', revenueValue: 45000, problems: ['material', 'redes'], sellerCode: 'DEMO1', when: daysAgo(2) }),
    mkLead({ name: 'Marcos Vinícius', whatsapp: '11911110000', email: 'marcos@hortabox.com', business: 'HortaBox', segment: 'Comércio / Loja', revenueValue: 20000, problems: ['marca', 'clientes', 'tempo'], sellerCode: '', when: daysAgo(1) }),
  ]

  const orders = [
    buildOrder({ id: 'PED-1001', leadName: 'Mariana Costa', whatsapp: '11988887777', email: 'mariana@padariabela.com', lines: [{ id: 'logo', qty: 1 }], sellerCode: 'DEMO1', hasDiagnostic: true, when: daysAgo(27) }),
    buildOrder({ id: 'PED-1002', leadName: 'Rafael Lima', whatsapp: '21977776666', email: 'rafael@studiorl.com', lines: [{ id: 'social', qty: 1 }], sellerCode: 'DEMO1', hasDiagnostic: true, when: daysAgo(21) }),
    buildOrder({ id: 'PED-1003', leadName: 'Carla Nogueira', whatsapp: '31966665555', email: 'carla@moveiscn.com', lines: [{ id: 'social', qty: 1 }, { id: 'sistema', qty: 1 }], sellerCode: 'BRUNO', hasDiagnostic: true, when: daysAgo(15) }),
    buildOrder({ id: 'PED-1004', leadName: 'Patrícia Souza', whatsapp: '41944443333', email: 'patricia@docebella.com', lines: [{ id: 'identidade', qty: 1 }], sellerCode: 'DEMO1', hasDiagnostic: true, when: daysAgo(6) }),
    buildOrder({ id: 'PED-1005', leadName: 'Eduardo Pinto', whatsapp: '51933332222', email: 'edu@techeasy.com', lines: [{ id: 'sistema', qty: 1 }], sellerCode: 'BRUNO', hasDiagnostic: true, when: daysAgo(3) }),
    buildOrder({ id: 'PED-1006', leadName: 'João Menezes', whatsapp: '11900001111', email: 'joao@exemplo.com', lines: [{ id: 'post', qty: 4 }, { id: 'video', qty: 2 }], sellerCode: '', hasDiagnostic: false, when: daysAgo(1) }),
  ]

  return { sellers, leads, orders, seededAt: new Date().toISOString() }
}

export function getDB() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore
  }
  const fresh = seed()
  saveDB(fresh)
  return fresh
}

export function saveDB(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch (e) {
    // ignore
  }
}

export function resetDB() {
  const fresh = seed()
  saveDB(fresh)
  return fresh
}
