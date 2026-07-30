export const COMPANY = {
  name: 'elev',
  fullName: 'elev Agency',
  tagline: 'Eleve o seu negócio.',
  subtitle: 'Marca, marketing e sistemas sob medida — com um diagnóstico que mostra exatamente o que o seu negócio precisa.',
  email: 'contato@elevagency.com',
  whatsapp: import.meta.env.VITE_COMPANY_WHATSAPP || '',
}

export const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export const PUBLIC_URL =
  import.meta.env.VITE_PUBLIC_URL ||
  (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '')

// Sem backend configurado => MODO DEMO (dados no navegador via localStorage).
export const DEMO_MODE = !APPS_SCRIPT_URL

// Credenciais usadas SOMENTE no modo demo (no modo real, a auth e no Apps Script).
export const DEMO_ADMIN = { email: 'admin@elev', password: 'elev123' }
export const DEMO_SELLER = { email: 'vendedor@elev', password: '123', code: 'DEMO1' }
