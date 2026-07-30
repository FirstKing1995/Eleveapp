// Trilhas do diagnostico. Em TODAS as perguntas a escala e 0 a 10, onde:
//   0  = problema forte (maior necessidade do servico)
//   10 = tudo resolvido (nenhuma necessidade)
// Assim, a "necessidade" de cada trilha = 10 - media das respostas.

export const BUSINESS_SEGMENTS = [
  'Comércio / Loja',
  'Alimentação (bar, restaurante, etc.)',
  'Serviços (salão, clínica, oficina, etc.)',
  'Prestador autônomo / Profissional liberal',
  'Indústria / Fabricação',
  'Infoproduto / Negócio digital',
  'Outro',
]

export const DIAGNOSTIC_TRAILS = [
  {
    id: 'logo',
    serviceId: 'logo',
    name: 'Marca & Logo',
    intro: 'Vamos entender como está a base da sua marca.',
    questions: [
      {
        id: 'logo_tem',
        text: 'Sua marca já tem um logotipo profissional?',
        low: 'Não tenho / uso só o nome escrito',
        high: 'Sim, um logo profissional',
      },
      {
        id: 'logo_qualidade',
        text: 'O quanto seu logo atual transmite profissionalismo e confiança?',
        low: 'Nada, parece amador',
        high: 'Total, é impecável',
      },
      {
        id: 'logo_arquivos',
        text: 'Você tem seu logo em arquivos de qualidade para usar onde precisar?',
        low: 'Não tenho os arquivos certos',
        high: 'Tenho tudo (vetor, PNG...)',
      },
    ],
  },
  {
    id: 'identidade',
    serviceId: 'identidade',
    name: 'Identidade Visual',
    intro: 'Agora, a consistência da sua comunicação.',
    questions: [
      {
        id: 'id_padrao',
        text: 'Além do logo, você tem uma identidade padronizada (cores, fontes, materiais)?',
        low: 'Não, é tudo solto',
        high: 'Sim, tudo padronizado',
      },
      {
        id: 'id_materiais',
        text: 'Você tem materiais prontos como cartão de visita, papel timbrado e artes?',
        low: 'Não tenho nenhum',
        high: 'Tenho todos prontos',
      },
      {
        id: 'id_consistencia',
        text: 'Sua comunicação visual é consistente em todos os canais?',
        low: 'Cada hora é de um jeito',
        high: 'Totalmente consistente',
      },
    ],
  },
  {
    id: 'social',
    serviceId: 'social',
    name: 'Captação de Clientes',
    intro: 'Vamos falar sobre a entrada de novos clientes.',
    questions: [
      {
        id: 'soc_fluxo',
        text: 'O quanto você tem um fluxo constante e previsível de novos clientes?',
        low: 'Vivo na incerteza',
        high: 'Fluxo constante e previsível',
      },
      {
        id: 'soc_trafego',
        text: 'Você investe em anúncios (tráfego pago) de forma estratégica hoje?',
        low: 'Não invisto / não sei fazer',
        high: 'Sim, com estratégia',
      },
      {
        id: 'soc_redes',
        text: 'Suas redes sociais são gerenciadas com constância e estratégia?',
        low: 'Estão abandonadas',
        high: 'Ativas e estratégicas',
      },
    ],
  },
  {
    id: 'sistema',
    serviceId: 'sistema',
    name: 'Sistemas & Automação',
    intro: 'Por fim, a organização e automação do negócio.',
    questions: [
      {
        id: 'sis_manual',
        text: 'O quanto do seu tempo é gasto com tarefas manuais e repetitivas?',
        low: 'Muito, gasto o dia nisso',
        high: 'Quase nada, é automatizado',
      },
      {
        id: 'sis_app',
        text: 'Um app ou sistema próprio (para clientes ou interno) ajudaria seu negócio?',
        low: 'Ajudaria muito',
        high: 'Não faria diferença',
      },
      {
        id: 'sis_dados',
        text: 'Você tem um painel central com as informações e números do negócio?',
        low: 'Não tenho nada disso',
        high: 'Tenho tudo num painel',
      },
    ],
  },
]

// avg <= threshold  =>  problema presente -> trilha recomendada
export const RECOMMEND_THRESHOLD = 6

export const ALL_QUESTIONS = DIAGNOSTIC_TRAILS.flatMap((t) =>
  t.questions.map((q) => ({ ...q, trailId: t.id })),
)
