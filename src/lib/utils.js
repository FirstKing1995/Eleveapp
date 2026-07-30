// Junta classes condicionalmente (mini alternativa ao clsx).
export function cn(...args) {
  return args
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim()
}

// ID curto e legivel (para pedidos, refs de demo etc.)
export function shortId(prefix = '') {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase()
  return prefix ? `${prefix}-${s}` : s
}

// Debounce simples
export function debounce(fn, ms = 250) {
  let t
  return (...a) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...a), ms)
  }
}

export function slugify(str = '') {
  return str
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
