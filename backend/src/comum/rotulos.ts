// Nome de cada campo do jeito que a pessoa lê na tela.
// Usado pelas mensagens de validação e pelos erros do Prisma.
const ROTULOS: Record<string, string> = {
  nomeCompleto: 'Nome completo',
  email: 'E-mail',
  senha: 'Senha',
  password: 'Senha',
  perfil: 'Perfil',

  idUsuario: 'Aluno',
  idInstrutor: 'Instrutor',
  idCategoria: 'Categoria',
  idCurso: 'Curso',
  idModulo: 'Módulo',
  idAula: 'Aula',
  idTrilha: 'Trilha',
  idPlano: 'Plano',
  idAssinatura: 'Assinatura',

  titulo: 'Título',
  descricao: 'Descrição',
  nome: 'Nome',
  nivel: 'Nível',
  ordem: 'Ordem',
  tipoConteudo: 'Tipo de conteúdo',
  urlConteudo: 'URL do conteúdo',
  duracaoMinutos: 'Duração (min)',
  dataPublicacao: 'Data de publicação',
  totalAulas: 'Total de aulas',
  totalHoras: 'Total de horas',

  nota: 'Nota',
  comentario: 'Comentário',
  status: 'Status',
  dataMatricula: 'Data da matrícula',
  dataConclusao: 'Data de conclusão',
  dataAvaliacao: 'Data da avaliação',
  dataEmissao: 'Data de emissão',
  codigoVerificacao: 'Código de verificação',

  preco: 'Preço',
  duracaoMeses: 'Duração (meses)',
  dataInicio: 'Data de início',
  dataFim: 'Data de fim',
  valorPago: 'Valor pago',
  dataPagamento: 'Data do pagamento',
  metodoPagamento: 'Método de pagamento',
  idTransacaoGateway: 'ID da transação',
};

// Nomes das colunas do banco (@map no schema) -> nome do campo no código.
// O Prisma às vezes devolve a coluna ("ID_Curso"), às vezes o campo ("idCurso").
const COLUNAS: Record<string, string> = {
  Email: 'email',
  Nome: 'nome',
  CodigoVerificacao: 'codigoVerificacao',
  ID_Usuario: 'idUsuario',
  ID_Instrutor: 'idInstrutor',
  ID_Categoria: 'idCategoria',
  ID_Curso: 'idCurso',
  ID_Modulo: 'idModulo',
  ID_Aula: 'idAula',
  ID_Trilha: 'idTrilha',
  ID_Plano: 'idPlano',
  ID_Assinatura: 'idAssinatura',
};

export function rotulo(campo: string) {
  return ROTULOS[COLUNAS[campo] ?? campo] ?? campo;
}
