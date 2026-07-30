// ============================================================
// Diagnóstico elev — perfil + faturamento, problemas e trilhas por serviço
// Escala das perguntas: 0 a 10, onde 0 = problema forte / 10 = resolvido.
// ============================================================

export const BUSINESS_SEGMENTS = [
  'Comércio / Loja',
  'Alimentação (bar, restaurante, etc.)',
  'Serviços (salão, clínica, oficina, etc.)',
  'Prestador autônomo / Profissional liberal',
  'Indústria / Fabricação',
  'Infoproduto / Negócio digital',
  'Outro',
]

// value = referência de faturamento mensal usada pelo "porteiro"
export const REVENUE_RANGES = [
  { id: 'r1', label: 'Até R$ 10 mil / mês', value: 8000 },
  { id: 'r2', label: 'R$ 10 mil a R$ 30 mil / mês', value: 20000 },
  { id: 'r3', label: 'R$ 30 mil a R$ 60 mil / mês', value: 45000 },
  { id: 'r4', label: 'R$ 60 mil a R$ 100 mil / mês', value: 80000 },
  { id: 'r5', label: 'Acima de R$ 100 mil / mês', value: 150000 },
]

// "Quais são os maiores desafios do seu negócio hoje?"
export const PROBLEMS = [
  { id: 'marca', label: 'Minha marca/logo é fraca ou amadora', domain: 'marca' },
  { id: 'material', label: 'Falta material visual pronto (posts, artes, papelaria)', domain: 'marca' },
  { id: 'clientes', label: 'Faltam clientes — vendas inconstantes', domain: 'marketing' },
  { id: 'redes', label: 'Redes sociais paradas ou sem estratégia', domain: 'marketing' },
  { id: 'anuncios', label: 'Não sei investir em anúncios / tráfego', domain: 'marketing' },
  { id: 'tempo', label: 'Perco tempo com tarefas manuais e repetitivas', domain: 'sistema' },
  { id: 'organizacao', label: 'Desorganização — informações espalhadas', domain: 'sistema' },
  { id: 'appproprio', label: 'Preciso de um sistema ou app próprio', domain: 'sistema' },
  { id: 'conteudo', label: 'Preciso de vídeos/posts com frequência', domain: 'conteudo' },
  { id: 'impressos', label: 'Preciso de materiais impressos (cartão, panfleto, placa)', domain: 'impressos' },
]

export const RAIOX = { id: 'tudo', label: 'Quero um raio-x completo do meu negócio', domain: 'all' }

// Trilhas de perguntas, uma por serviço. sistema é a mais completa (com campos abertos).
export const TRAILS = {
  logo: {
    service: 'logo',
    name: 'Marca & Logo',
    intro: 'Vamos avaliar a base da sua marca.',
    questions: [
      { id: 'logo_tem', text: 'Sua marca tem um logotipo profissional que você tem orgulho de mostrar?', low: 'Não tenho / uso só o nome', high: 'Sim, tenho orgulho' },
      { id: 'logo_nivel', text: 'Seu logo transmite o profissionalismo e o nível do seu negócio?', low: 'Não, parece amador', high: 'Sim, totalmente' },
      { id: 'logo_arquivos', text: 'Você tem seu logo em arquivos de qualidade (vetor, PNG) para qualquer uso?', low: 'Não tenho os arquivos', high: 'Tenho tudo pronto' },
      { id: 'logo_cores', text: 'As cores e a tipografia da sua marca são definidas e usadas com consistência?', low: 'Não são definidas', high: 'Definidas e consistentes' },
    ],
  },
  identidade: {
    service: 'identidade',
    name: 'Identidade Visual',
    intro: 'Vamos além do logo: a sua marca como um sistema.',
    questions: [
      { id: 'id_sistema', text: 'Além do logo, você tem uma identidade visual completa (paleta, tipografia, padrões)?', low: 'Não, é tudo solto', high: 'Sim, um sistema completo' },
      { id: 'id_materiais', text: 'Você tem materiais prontos (cartão, papel timbrado, modelos de post)?', low: 'Não tenho nenhum', high: 'Tenho todos prontos' },
      { id: 'id_consistencia', text: 'Sua comunicação é visualmente consistente em todos os canais?', low: 'Cada hora é diferente', high: 'Totalmente consistente' },
      { id: 'id_manual', text: 'Você tem um manual de marca que orienta como usar sua identidade?', low: 'Não existe', high: 'Sim, bem definido' },
      { id: 'id_reconhecimento', text: 'Um cliente reconhece a sua marca "de longe", só pelo visual?', low: 'Não reconhece', high: 'Reconhece na hora' },
    ],
  },
  social: {
    service: 'social',
    name: 'Captação de Clientes',
    intro: 'Vamos olhar a máquina de trazer clientes.',
    questions: [
      { id: 'soc_fluxo', text: 'Você tem um fluxo constante e previsível de novos clientes chegando?', low: 'Vivo na incerteza', high: 'Constante e previsível' },
      { id: 'soc_redes', text: 'Suas redes sociais são atualizadas com constância e estratégia?', low: 'Estão paradas', high: 'Ativas e estratégicas' },
      { id: 'soc_trafego', text: 'Você investe em anúncios (tráfego pago) com método hoje?', low: 'Não invisto / não sei', high: 'Invisto com estratégia' },
      { id: 'soc_rastreio', text: 'Você consegue medir de onde vêm seus clientes (post → contato → venda)?', low: 'Não faço ideia', high: 'Meço tudo' },
      { id: 'soc_meta', text: 'O volume de oportunidades é suficiente para bater suas metas de venda?', low: 'Muito abaixo', high: 'Suficiente e sobra' },
    ],
  },
  sistema: {
    service: 'sistema',
    name: 'Sistemas & Automação',
    intro: 'A parte mais importante: vamos descobrir o que você precisa e quer.',
    questions: [
      { id: 'sis_tempo', text: 'Quanto do seu tempo (e da equipe) é gasto em tarefas manuais e repetitivas?', low: 'Muito, o dia todo', high: 'Quase nada' },
      { id: 'sis_espalhado', text: 'Suas informações estão espalhadas (papel, WhatsApp, planilhas soltas)?', low: 'Tudo espalhado', high: 'Tudo centralizado' },
      { id: 'sis_painel', text: 'Você tem um painel para acompanhar os números do negócio em tempo real?', low: 'Não tenho nada', high: 'Tenho e uso' },
      { id: 'sis_cliente', text: 'Seus clientes teriam uma experiência melhor com um app próprio (agendamento, pedidos, área do cliente)?', low: 'Com certeza sim', high: 'Não faria diferença' },
      { id: 'sis_erros', text: 'Retrabalho e erros por controle manual atrapalham a sua operação?', low: 'Atrapalham muito', high: 'Quase nunca' },
      { id: 'sis_processo', type: 'textarea', text: 'Descreva a tarefa ou processo que mais consome o seu tempo hoje:', placeholder: 'Ex: anotar pedidos no caderno e depois passar pra planilha...' },
      { id: 'sis_desejo', type: 'textarea', text: 'Se você pudesse automatizar UMA coisa no seu negócio, qual seria?', placeholder: 'Ex: um sistema de agendamento que envia lembrete sozinho...' },
      { id: 'sis_usuarios', type: 'text', text: 'Quem usaria esse sistema? (você, equipe, clientes...)', placeholder: 'Ex: eu e mais 2 atendentes' },
    ],
  },
}

export const RECOMMEND_THRESHOLD = 6 // média <= 6 nas perguntas => problema confirmado

// Narrativas de "o que você perde" por serviço (usadas na tela de resultado)
export const LOSS_BY_SERVICE = {
  logo: {
    problem: 'Sua marca ainda não passa a confiança que o seu trabalho merece.',
    loss: 'A cada cliente que compara, a aparência amadora empurra a escolha para o concorrente que "parece" mais profissional — mesmo quando você entrega mais.',
  },
  identidade: {
    problem: 'Sua comunicação é inconsistente e falta material profissional pronto.',
    loss: 'Sem uma identidade coerente, você perde autoridade, gasta tempo improvisando arte e deixa dinheiro na mesa por não parecer a referência do seu mercado.',
  },
  social: {
    problem: 'Não existe uma máquina previsível trazendo clientes todos os dias.',
    loss: 'Cada mês sem captação ativa é faturamento que não volta — e a concorrência que anuncia fica na frente da sua audiência, não você.',
  },
  sistema: {
    problem: 'Processos manuais consomem seu tempo e a informação vive espalhada.',
    loss: 'Cada hora gasta em tarefa repetitiva é uma hora que não gera receita, e os erros de controle manual custam caro em dinheiro e em imagem.',
  },
}
