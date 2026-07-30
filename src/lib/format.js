export function formatBRL(value) {
  const n = Number(value) || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Versao curta: R$ 6 mil, R$ 15 mil, R$ 1,2 mil...
export function formatBRLShort(value) {
  const n = Number(value) || 0
  if (n >= 1000) {
    const k = n / 1000
    const str = Number.isInteger(k) ? String(k) : k.toFixed(1).replace('.', ',')
    return `R$ ${str} mil`
  }
  return formatBRL(n)
}

export function formatDate(input, withTime = false) {
  if (!input) return '—'
  const d = input instanceof Date ? input : new Date(input)
  if (isNaN(d.getTime())) return '—'
  const opts = withTime
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' }
  return d.toLocaleString('pt-BR', opts)
}

export function formatPhone(v = '') {
  const d = String(v).replace(/\D/g, '')
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

export function onlyDigits(v = '') {
  return String(v).replace(/\D/g, '')
}
