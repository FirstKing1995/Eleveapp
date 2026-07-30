import { PenTool, Palette, TrendingUp, LayoutDashboard, Clapperboard, Image, Printer } from 'lucide-react'

// Quem entra na vitrine SEM fazer o diagnostico ve o valor dobrado (so servicos de trilha).
export const MULTIPLIER_NO_DIAGNOSTIC = 2

// Regras de combo
export const HIGHER_VALUE_SERVICES = ['social', 'sistema'] // "servicos de maior valor"
export const FREE_COMBO_SERVICE = 'identidade' // Identidade Visual entra de graca no combo

// ============================================================
// SERVICOS DE TRILHA (recomendados pelo diagnostico)
// minRevenue = faturamento mensal minimo para o servico ser OFERECIDO (porteiro)
// ============================================================
export const SERVICES = [
  {
    id: 'logo',
    trilha: 1,
    name: 'Logo Simples',
    tagline: 'Uma marca profissional para começar do jeito certo.',
    price: 150,
    commission: 0.5,
    minRevenue: 0,
    icon: PenTool,
    accent: '#6BA5FF',
    forWho: 'Quem ainda não tem logo, ou tem uma logo amadora que não reflete profissionalismo.',
    includes: [
      'Criação de 1 logotipo profissional',
      'Versões principal, secundária e ícone',
      'Paleta de cores e tipografia da marca',
      'Arquivos em PNG (fundo transparente) e alta resolução',
    ],
    deliverables: ['PNG', 'JPG', 'PDF'],
    delivery: '3 a 5 dias úteis',
  },
  {
    id: 'identidade',
    trilha: 2,
    name: 'Identidade Visual Completa',
    tagline: 'Toda a sua marca padronizada e pronta para usar.',
    price: 500,
    commission: 0.2,
    minRevenue: 30000,
    icon: Palette,
    accent: '#A855F7',
    supersedes: ['logo'],
    forWho: 'Quem quer uma marca completa, coerente e pronta para todos os pontos de contato.',
    includes: [
      'Criação de logotipo completo (principal, secundária e ícone)',
      'Manual de marca (mini brandbook)',
      'Cartão de visita, papel timbrado e artes para impressão',
      'Modelo de artes editável no Canva',
      'Logo entregue em PDF, PNG e CDR (vetor)',
    ],
    deliverables: ['PDF', 'PNG', 'CDR', 'Canva'],
    delivery: '7 a 12 dias úteis',
  },
  {
    id: 'social',
    trilha: 3,
    name: 'Gestão de Redes + Tráfego',
    tagline: 'Um fluxo contínuo e previsível de novos clientes.',
    price: 6000,
    period: '/mês',
    commission: 0.2,
    minRevenue: 60000,
    icon: TrendingUp,
    accent: '#E24BF0',
    forWho: 'Negócios que precisam de mais clientes de forma constante e previsível.',
    includes: [
      'Gestão estratégica das redes sociais',
      'Planejamento e criação de conteúdo',
      'Gestão de tráfego pago (criação e otimização de anúncios)',
      'Relatórios mensais de resultado',
    ],
    deliverables: ['Conteúdo', 'Anúncios', 'Relatórios'],
    delivery: 'Serviço mensal recorrente',
  },
  {
    id: 'sistema',
    trilha: 4,
    name: 'Sistema sob Medida',
    tagline: 'Um mini-app ou painel que resolve um problema real do seu negócio.',
    price: 15000,
    commission: 0.2,
    minRevenue: 100000,
    icon: LayoutDashboard,
    accent: '#8B5CF6',
    forWho: 'Quem precisa organizar, automatizar ou atender clientes com um sistema próprio.',
    includes: [
      'Mini-sistema ou app sob medida para o seu negócio',
      'Painel (dashboard) com as informações que importam',
      'Automação de tarefas manuais e repetitivas',
      'Levantamento completo do que você precisa e quer',
    ],
    deliverables: ['Web App', 'Dashboard'],
    delivery: 'Sob escopo (a combinar)',
  },
]

// ============================================================
// SERVICOS AVULSOS (venda por quantidade, com desconto escalonado)
// desconto por unidade = min(discountCap, base * discountStep * (qty - 1))
// ============================================================
export const AVULSOS = [
  {
    id: 'video',
    name: 'Edição de Vídeo',
    unitLabel: 'vídeo',
    tagline: 'Vídeos editados, prontos para postar.',
    price: 150,
    discountStep: 0.2,
    discountCap: 40,
    commission: 0.2,
    avulso: true,
    icon: Clapperboard,
    accent: '#6BA5FF',
    forWho: 'Quem precisa de vídeos com constância para redes e anúncios.',
    includes: ['Edição profissional', 'Cortes, legendas e trilha', 'Formato para Reels/TikTok/YouTube'],
    deliverables: ['MP4'],
    delivery: '2 a 4 dias úteis por vídeo',
  },
  {
    id: 'post',
    name: 'Criação de Posts',
    unitLabel: 'post',
    tagline: 'Artes de post que valorizam a sua marca.',
    price: 50,
    discountStep: 0.2,
    discountCap: 15,
    commission: 0.2,
    avulso: true,
    icon: Image,
    accent: '#A855F7',
    forWho: 'Quem precisa alimentar as redes com posts bem feitos.',
    includes: ['Arte de post profissional', 'Adaptação feed/story', 'Dentro da sua identidade visual'],
    deliverables: ['PNG', 'JPG'],
    delivery: '1 a 3 dias úteis por post',
  },
  {
    id: 'impresso',
    name: 'Artes para Impressão',
    unitLabel: 'arte',
    tagline: 'Cartão de visita, panfleto, placa e mais.',
    price: 100,
    discountStep: 0.2,
    discountCap: 50,
    commission: 0.2,
    avulso: true,
    icon: Printer,
    accent: '#E24BF0',
    forWho: 'Quem precisa de materiais impressos com padrão profissional.',
    includes: ['Arte pronta para gráfica', 'Cartão, panfleto, placa, banner...', 'Formato de alta resolução (PDF)'],
    deliverables: ['PDF', 'PNG'],
    delivery: '2 a 4 dias úteis por arte',
  },
]

export const CATALOG = [...SERVICES, ...AVULSOS]

export function getService(id) {
  return CATALOG.find((s) => s.id === id)
}

export function isAvulso(id) {
  const s = getService(id)
  return !!(s && s.avulso)
}

// Preco exibido conforme a pessoa fez ou nao o diagnostico (so servicos de trilha).
export function displayPrice(service, hasDiagnostic) {
  if (service.avulso) return service.price // avulsos tem mecanica propria de desconto
  return hasDiagnostic ? service.price : service.price * MULTIPLIER_NO_DIAGNOSTIC
}

export function commissionFor(serviceId, amountPaid) {
  const s = getService(serviceId)
  if (!s) return 0
  return Math.round(amountPaid * (s.commission || 0))
}
