import { DIAGNOSTIC_TRAILS, RECOMMEND_THRESHOLD } from '../config/diagnostic.js'
import { SERVICES, getService } from '../config/services.js'

// Recebe { qid: 0..10 } e devolve a analise completa + o combo recomendado.
export function computeDiagnostic(answers = {}) {
  const trails = DIAGNOSTIC_TRAILS.map((t) => {
    const vals = t.questions
      .map((q) => answers[q.id])
      .filter((v) => v !== undefined && v !== null)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    const need = avg === null ? 0 : Math.round((10 - avg) * 10) // 0..100
    const recommended = avg !== null && avg <= RECOMMEND_THRESHOLD
    return { id: t.id, serviceId: t.serviceId, name: t.name, avg, need, recommended }
  })

  // trilhas com problema, ordenadas pela maior necessidade
  let flagged = trails.filter((t) => t.recommended).sort((a, b) => b.need - a.need)

  // garante ao menos 1 recomendacao (a de maior necessidade, se houver alguma)
  if (flagged.length === 0) {
    const top = [...trails].sort((a, b) => b.need - a.need)[0]
    if (top && top.need > 0) flagged = [top]
  }

  const ids = new Set(flagged.map((f) => f.serviceId))

  // Identidade completa ja inclui a logo -> nao cobrar as duas
  if (ids.has('identidade')) ids.delete('logo')

  // mantem a ordem por tier (logo -> identidade -> social -> sistema)
  const items = SERVICES.filter((s) => ids.has(s.id))
  const total = items.reduce((sum, s) => sum + s.price, 0)

  const overallNeed = Math.round(trails.reduce((a, t) => a + t.need, 0) / trails.length)

  return {
    trails,
    recommendedTrailIds: flagged.map((f) => f.id),
    items,
    itemIds: items.map((i) => i.id),
    total,
    overallNeed,
  }
}

// Monta o rotulo curto do combo, ex.: "Identidade Visual + Gestão de Redes"
export function comboLabel(itemIds = []) {
  return itemIds
    .map((id) => getService(id)?.name)
    .filter(Boolean)
    .join(' + ')
}
