import { TRAILS, PROBLEMS, RECOMMEND_THRESHOLD } from '../config/diagnostic.js'
import { SERVICES, getService, HIGHER_VALUE_SERVICES } from '../config/services.js'
import { computeCart } from './pricing.js'

const ORDER = ['logo', 'identidade', 'social', 'sistema']

// Serviços de trilha liberados pelo faturamento (porteiro)
export function eligibleServices(revenueValue) {
  const rev = Number(revenueValue) || 0
  return SERVICES.filter((s) => rev >= (s.minRevenue || 0)).map((s) => s.id)
}

// Domínio "marca" vira Logo (pequeno) ou Identidade (30k+)
export function brandingService(revenueValue) {
  return (Number(revenueValue) || 0) >= 30000 ? 'identidade' : 'logo'
}

export function problemsToDomains(problemIds = []) {
  if (problemIds.includes('tudo')) return ['all']
  const map = {}
  PROBLEMS.forEach((p) => {
    map[p.id] = p.domain
  })
  const domains = new Set()
  problemIds.forEach((pid) => map[pid] && domains.add(map[pid]))
  return [...domains]
}

// Trilhas de PERGUNTAS a fazer (ouvimos o lead; o porteiro entra só na recomendação)
export function trailsForDomains(domains, revenueValue) {
  const set = new Set()
  const wantAll = domains.includes('all')
  const has = (d) => wantAll || domains.includes(d)
  if (has('marca')) set.add(brandingService(revenueValue))
  if (has('marketing')) set.add('social')
  if (has('sistema')) set.add('sistema')
  return ORDER.filter((id) => set.has(id))
}

export function computeDiagnostic({ revenueValue, problems = [], answers = {} }) {
  const domains = problemsToDomains(problems)
  const askedTrails = trailsForDomains(domains, revenueValue)
  const eligible = new Set(eligibleServices(revenueValue))

  const trailStats = askedTrails.map((id) => {
    const t = TRAILS[id]
    const scaleQuestions = t.questions.filter((q) => !q.type)
    const vals = scaleQuestions.map((q) => answers[q.id]).filter((v) => v !== undefined && v !== null)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    const need = avg === null ? 50 : Math.round((10 - avg) * 10)
    const confirmed = avg === null ? true : avg <= RECOMMEND_THRESHOLD
    return { id, name: t.name, avg, need, confirmed }
  })

  const recommended = []
  const gatedOut = []
  trailStats.forEach((ts) => {
    if (!ts.confirmed) return
    if (eligible.has(ts.id)) recommended.push(ts.id)
    else gatedOut.push(ts.id)
  })

  let ids = recommended.slice()
  if (ids.includes('identidade')) ids = ids.filter((x) => x !== 'logo')
  ids = ORDER.filter((x) => ids.includes(x))

  // Combo com >1 serviço + serviço de maior valor => garante Identidade grátis (absorve a logo)
  const higher = ids.some((x) => HIGHER_VALUE_SERVICES.includes(x))
  if (ids.length > 1 && higher) {
    if (!ids.includes('identidade')) ids.push('identidade')
    ids = ORDER.filter((x) => ids.includes(x) && x !== 'logo')
  }

  const avulsoSuggest = new Set()
  const wantAll = domains.includes('all')
  if (wantAll || domains.includes('conteudo')) {
    avulsoSuggest.add('video')
    avulsoSuggest.add('post')
  }
  if (wantAll || domains.includes('impressos')) avulsoSuggest.add('impresso')

  const lines = ids.map((id) => ({ id, qty: 1 }))
  const pricing = computeCart(lines, true)

  const overallNeed = trailStats.length
    ? Math.round(trailStats.reduce((a, t) => a + t.need, 0) / trailStats.length)
    : 0

  return {
    domains,
    askedTrails,
    trailStats,
    recommendedItemIds: pricing.items.map((i) => i.id),
    comboItemIds: ids,
    gatedOutIds: gatedOut,
    avulsoSuggest: [...avulsoSuggest],
    pricing,
    total: pricing.total,
    overallNeed,
  }
}

export function comboLabel(itemIds = []) {
  return itemIds
    .map((id) => getService(id)?.name)
    .filter(Boolean)
    .join(' + ')
}
