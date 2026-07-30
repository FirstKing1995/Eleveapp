import { APPS_SCRIPT_URL, DEMO_MODE, DEMO_ADMIN } from '../config/app.js'
import { getDB, saveDB, resetDB } from './demoDb.js'
import { shortId } from '../lib/utils.js'

// ---------- Backend real (Apps Script) ----------
// Enviamos como text/plain para evitar o preflight de CORS do Apps Script.
async function callBackend(action, payload = {}) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...payload }),
    redirect: 'follow',
  })
  if (!res.ok) throw new Error('Falha na comunicação com o servidor (' + res.status + ')')
  return res.json()
}

const wait = (ms = 320) => new Promise((r) => setTimeout(r, ms))

// ============================================================
// LEADS
// ============================================================
export async function saveLead(lead) {
  if (!DEMO_MODE) return callBackend('saveLead', { lead })
  await wait()
  const db = getDB()
  const record = { ...lead, id: lead.id || shortId('LEAD'), createdAt: new Date().toISOString(), status: 'novo' }
  db.leads.unshift(record)
  saveDB(db)
  return { ok: true, id: record.id }
}

// ============================================================
// PEDIDOS / CHECKOUT
// ============================================================
export async function createOrder(order) {
  const record = {
    ...order,
    id: order.id || 'PED-' + Date.now().toString().slice(-7),
    createdAt: new Date().toISOString(),
    status: 'PENDENTE',
  }
  if (!DEMO_MODE) return callBackend('createOrder', { order: record })
  await wait()
  const db = getDB()
  db.orders.unshift(record)
  saveDB(db)
  return { ok: true, order: record }
}

// Cria a preferencia de pagamento no Mercado Pago (retorna init_point no modo real).
export async function createPreference(order) {
  if (!DEMO_MODE) return callBackend('createPreference', { order })
  await wait()
  return { ok: true, demo: true }
}

// Simula (no modo real quem faz isso e o webhook do Mercado Pago).
export async function markOrderPaid(orderId) {
  if (!DEMO_MODE) return callBackend('markOrderPaid', { orderId })
  await wait()
  const db = getDB()
  const o = db.orders.find((x) => x.id === orderId)
  if (o) {
    o.status = 'PAGO'
    // marca o lead como cliente
    const lead = db.leads.find((l) => l.email && o.email && l.email === o.email)
    if (lead) lead.status = 'cliente'
    saveDB(db)
  }
  return { ok: true, order: o }
}

// ============================================================
// AUTENTICACAO
// ============================================================
export async function loginSeller(email, password) {
  if (!DEMO_MODE) return callBackend('loginSeller', { email, password })
  await wait()
  const db = getDB()
  const s = db.sellers.find(
    (x) => x.email.toLowerCase() === String(email).toLowerCase() && x.password === password && x.active,
  )
  if (!s) return { ok: false, error: 'E-mail ou senha inválidos.' }
  const { password: _p, ...safe } = s
  return { ok: true, seller: safe }
}

export async function loginAdmin(email, password) {
  if (!DEMO_MODE) return callBackend('loginAdmin', { email, password })
  await wait()
  if (email.toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    return { ok: true, admin: { email, name: 'Administrador' } }
  }
  return { ok: false, error: 'E-mail ou senha inválidos.' }
}

// ============================================================
// DADOS (comercial e admin)
// ============================================================
export async function getSellerData(sellerCode) {
  if (!DEMO_MODE) return callBackend('sellerData', { sellerCode })
  await wait()
  const db = getDB()
  const orders = db.orders.filter((o) => o.sellerCode === sellerCode)
  const leads = db.leads.filter((l) => l.sellerCode === sellerCode)
  return { ok: true, orders, leads }
}

export async function getAdminData() {
  if (!DEMO_MODE) return callBackend('adminData', {})
  await wait()
  const db = getDB()
  return { ok: true, leads: db.leads, orders: db.orders, sellers: db.sellers.map(({ password, ...s }) => s) }
}

export async function listSellers() {
  if (!DEMO_MODE) return callBackend('listSellers', {})
  await wait(150)
  const db = getDB()
  return { ok: true, sellers: db.sellers.map(({ password, ...s }) => s) }
}

export async function createSeller(seller) {
  if (!DEMO_MODE) return callBackend('createSeller', { seller })
  await wait()
  const db = getDB()
  const record = { ...seller, id: shortId('S'), active: true, createdAt: new Date().toISOString() }
  db.sellers.push(record)
  saveDB(db)
  const { password, ...safe } = record
  return { ok: true, seller: safe }
}

export function resetDemoData() {
  if (DEMO_MODE) resetDB()
}
