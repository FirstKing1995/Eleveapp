import { PenTool, Palette, TrendingUp, LayoutDashboard } from 'lucide-react'

// Quem entra na vitrine SEM fazer o diagnostico ve o valor multiplicado.
// Fazendo o diagnostico, ve o valor "ideal" (base).
export const MULTIPLIER_NO_DIAGNOSTIC = 2

// price   = valor IDEAL (mostrado dentro do diagnostico / plano ideal)
// commission = % que o vendedor recebe sobre a venda
export const SERVICES = [
  {
    id: 'logo',
    trilha: 1,
    name: 'Logo Simples',
    tagline: 'Uma marca profissional para começar do jeito certo.',
    price: 150,
    commission: 0.5,
    icon: PenTool,
    accent: '#6BA5FF',
    forWho: 'Quem ainda não tem logo, ou tem uma logo amadora que não reflete profissionalismo.',
    problem: 'Sua marca ainda não tem uma identidade que transmita confiança.',
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
    icon: Palette,
    accent: '#A855F7',
    // A identidade completa ja inclui a logo -> nunca cobramos as duas juntas.
    supersedes: ['logo'],
    forWho: 'Quem quer uma marca completa, coerente e pronta para todos os pontos de contato.',
    problem: 'Sua comunicação visual é inconsistente e falta material profissional pronto.',
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
    icon: TrendingUp,
    accent: '#E24BF0',
    forWho: 'Negócios que precisam de mais clientes de forma constante e previsível.',
    problem: 'Faltam clientes chegando e não existe uma máquina de captação rodando.',
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
    icon: LayoutDashboard,
    accent: '#8B5CF6',
    forWho: 'Quem precisa organizar, automatizar ou atender clientes com um sistema próprio.',
    problem: 'Processos manuais consomem seu tempo e faltam ferramentas próprias.',
    includes: [
      'Mini-sistema ou app sob medida para o seu negócio',
      'Painel (dashboard) com as informações que importam',
      'Automação de tarefas manuais e repetitivas',
      'Sistema simples e objetivo, focado no seu problema',
    ],
    deliverables: ['Web App', 'Dashboard'],
    delivery: 'Sob escopo (a combinar)',
  },
]

export function getService(id) {
  return SERVICES.find((s) => s.id === id)
}

// Preco exibido conforme a pessoa fez ou nao o diagnostico.
export function displayPrice(service, hasDiagnostic) {
  const p = service.price
  return hasDiagnostic ? p : p * MULTIPLIER_NO_DIAGNOSTIC
}

// Comissao do vendedor para um item vendido (sempre sobre o valor pago).
export function commissionFor(serviceId, amountPaid) {
  const s = getService(serviceId)
  if (!s) return 0
  return Math.round(amountPaid * s.commission)
}
