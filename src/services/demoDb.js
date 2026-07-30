// "Banco de dados" de demonstracao, persistido no localStorage do navegador.
// Espelha o que o Apps Script + Google Sheets fazem no modo real, para que o app
// funcione 100% antes de conectar a planilha.

import { SERVICES, getService, commissionFor } from '../config/services.js'
import { computeDiagnostic } from '../lib/diagnostic.js'
import { shortId } from '../lib/utils.js'

const KEY = 'elev_demo_db_v1'

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(9 + (n % 8), (n * 7) % 60, 0, 0)
  return d.toISOString()
}

function buildOrder({ id, leadName, whatsapp, email, itemIds, sellerCode, hasDiagnostic, when, status }) {
  const items = itemIds.map((sid) => {
    const s = getService(sid)
    const paid = hasDiagnostic ? s.price : s.price * 2
    return {
      id: s.id,
      name: s.name,
      price: paid,
      commissionPct: s.commission,
      commissionValue: commissionFor(s.id, paid),
    }
  })
  const total = items.reduce((a, i) => a + i.price, 0)
  const commissionTotal = items.reduce((a, i) => a + i.commissionValue, 0)
  return {
    id,
    createdAt: when,
    leadName,
    whatsapp,
    email,
    items,
    total,
    commissionTotal,
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
    mkLead('Mariana Costa', '11988887777', 'mariana@padariabela.com', 'Padaria Bela', 'Alimentação (bar, restaurante, etc.)', { logo_tem: 2, logo_qualidade: 3, logo_arquivos: 1, id_padrao: 2, id_materiais: 1, id_consistencia: 3, soc_fluxo: 8, soc_trafego: 7, soc_redes: 8, sis_manual: 8, sis_app: 9, sis_dados: 8 }, 'DEMO1', daysAgo(28)),
    mkLead('Rafael Lima', '21977776666', 'rafael@studiorl.com', 'Studio RL', 'Serviços (salão, clínica, oficina, etc.)', { logo_tem: 7, logo_qualidade: 6, logo_arquivos: 7, id_padrao: 5, id_materiais: 4, id_consistencia: 5, soc_fluxo: 2, soc_trafego: 1, soc_redes: 3, sis_manual: 7, sis_app: 8, sis_dados: 6 }, 'DEMO1', daysAgo(22)),
    mkLead('Carla Nogueira', '31966665555', 'carla@moveiscn.com', 'Móveis CN', 'Comércio / Loja', { logo_tem: 6, logo_qualidade: 5, logo_arquivos: 6, id_padrao: 6, id_materiais: 6, id_consistencia: 7, soc_fluxo: 3, soc_trafego: 2, soc_redes: 4, sis_manual: 2, sis_app: 1, sis_dados: 2 }, 'BRUNO', daysAgo(16)),
    mkLead('Diego Alves', '11955554444', 'diego@fitpro.com', 'FitPro Assessoria', 'Prestador autônomo / Profissional liberal', { logo_tem: 1, logo_qualidade: 2, logo_arquivos: 1, id_padrao: 8, id_materiais: 7, id_consistencia: 8, soc_fluxo: 7, soc_trafego: 8, soc_redes: 7, sis_manual: 8, sis_app: 8, sis_dados: 9 }, '', daysAgo(12)),
    mkLead('Patrícia Souza', '41944443333', 'patricia@docebella.com', 'Doce Bella', 'Alimentação (bar, restaurante, etc.)', { logo_tem: 4, logo_qualidade: 3, logo_arquivos: 4, id_padrao: 3, id_materiais: 2, id_consistencia: 3, soc_fluxo: 3, soc_trafego: 2, soc_redes: 3, sis_manual: 7, sis_app: 8, sis_dados: 7 }, 'DEMO1', daysAgo(7)),
    mkLead('Eduardo Pinto', '51933332222', 'edu@techeasy.com', 'TechEasy', 'Infoproduto / Negócio digital', { logo_tem: 8, logo_qualidade: 8, logo_arquivos: 8, id_padrao: 7, id_materiais: 7, id_consistencia: 8, soc_fluxo: 5, soc_trafego: 4, soc_redes: 6, sis_manual: 2, sis_app: 1, sis_dados: 2 }, 'BRUNO', daysAgo(4)),
    mkLead('Juliana Reis', '11922221111', 'ju@espacoluz.com', 'Espaço Luz', 'Serviços (salão, clínica, oficina, etc.)', { logo_tem: 5, logo_qualidade: 4, logo_arquivos: 5, id_padrao: 4, id_materiais: 3, id_consistencia: 4, soc_fluxo: 6, soc_trafego: 6, soc_redes: 5, sis_manual: 7, sis_app: 7, sis_dados: 8 }, 'DEMO1', daysAgo(2)),
    mkLead('Marcos Vinícius', '11911110000', 'marcos@hortabox.com', 'HortaBox', 'Comércio / Loja', { logo_tem: 3, logo_qualidade: 2, logo_arquivos: 3, id_padrao: 2, id_materiais: 2, id_consistencia: 3, soc_fluxo: 2, soc_trafego: 1, soc_redes: 2, sis_manual: 3, sis_app: 2, sis_dados: 3 }, '', daysAgo(1)),
  ]

  const orders = [
    buildOrder({ id: 'PED-1001', leadName: 'Mariana Costa', whatsapp: '11988887777', email: 'mariana@padariabela.com', itemIds: ['identidade'], sellerCode: 'DEMO1', hasDiagnostic: true, when: daysAgo(27), status: 'PAGO' }),
    buildOrder({ id: 'PED-1002', leadName: 'Rafael Lima', whatsapp: '21977776666', email: 'rafael@studiorl.com', itemIds: ['social'], sellerCode: 'DEMO1', hasDiagnostic: true, when: daysAgo(21), status: 'PAGO' }),
    buildOrder({ id: 'PED-1003', leadName: 'Carla Nogueira', whatsapp: '31966665555', email: 'carla@moveiscn.com', itemIds: ['social', 'sistema'], sellerCode: 'BRUNO', hasDiagnostic: true, when: daysAgo(15), status: 'PAGO' }),
    buildOrder({ id: 'PED-1004', leadName: 'Patrícia Souza', whatsapp: '41944443333', email: 'patricia@docebella.com', itemIds: ['identidade', 'social'], sellerCode: 'DEMO1', hasDiagnostic: true, when: daysAgo(6), status: 'PAGO' }),
    buildOrder({ id: 'PED-1005', leadName: 'Eduardo Pinto', whatsapp: '51933332222', email: 'edu@techeasy.com', itemIds: ['sistema'], sellerCode: 'BRUNO', hasDiagnostic: true, when: daysAgo(3), status: 'PAGO' }),
    buildOrder({ id: 'PED-1006', leadName: 'Visitante Vitrine', whatsapp: '11900001111', email: 'visitante@exemplo.com', itemIds: ['logo'], sellerCode: '', hasDiagnostic: false, when: daysAgo(1), status: 'PAGO' }),
  ]

  return { sellers, leads, orders, seededAt: new Date().toISOString() }
}

function mkLead(name, whatsapp, email, business, segment, answers, sellerCode, when) {
  const diag = computeDiagnostic(answers)
  return {
    id: shortId('LEAD'),
    createdAt: when,
    name,
    whatsapp,
    email,
    business,
    segment,
    answers,
    recommendedItemIds: diag.itemIds,
    comboTotal: diag.total,
    need: diag.overallNeed,
    sellerCode: sellerCode || '',
    status: 'novo',
  }
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
