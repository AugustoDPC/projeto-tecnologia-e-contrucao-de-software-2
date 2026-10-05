// Descrição de cada tabela do backend. A tela ResourcePage monta lista e formulário a partir daqui.

export type TipoCampo = 'text' | 'textarea' | 'email' | 'password' | 'int' | 'decimal' | 'date' | 'ref' | 'select';

export type Registro = Record<string, any>;
// Registros já carregados de cada tabela referenciada, por slug.
export type Listas = Record<string, Registro[]>;
export type Valores = Record<string, string>;

export type Campo = {
  nome: string;
  rotulo: string;
  tipo: TipoCampo;
  obrigatorio?: boolean;
  // Para tipo 'ref': qual recurso fornece as opções do select.
  ref?: string;
  // Para tipo 'select': alternativas fixas.
  opcoes?: string[];
  // Esconde o campo na tabela (ex.: senha, textos longos).
  ocultarNaLista?: boolean;
  // Só aparece no formulário de criação (ex.: chaves compostas).
  somenteCriacao?: boolean;
  // Gerado pelo backend: não aparece na criação e não pode ser editado.
  gerado?: boolean;
};

export type Recurso = {
  slug: string; // rota no frontend e no backend
  titulo: string;
  grupo: string;
  // Campo(s) que identificam o registro. Mais de um = chave composta (/:a/:b).
  chave: string[];
  // Campo usado para mostrar o registro em selects de outras telas.
  rotulo: string;
  // Texto do registro nos selects de outras telas (padrão: "#id rotulo").
  descrever?: (r: Registro) => string;
  // Chamado quando um campo do formulário muda; devolve outros campos para preencher.
  aoMudar?: (campo: string, valores: Valores, listas: Listas) => Partial<Valores>;
  campos: Campo[];
};

// Data de hoje no formato do <input type="date">.
export function hoje() {
  return formatarData(new Date());
}

function formatarData(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Soma meses a uma data "AAAA-MM-DD" (31/01 + 1 mês = 28 ou 29/02).
function somarMeses(data: string, meses: number) {
  const [a, m, d] = data.split('-').map(Number);
  const ultimoDia = new Date(a, m - 1 + meses + 1, 0).getDate();
  return formatarData(new Date(a, m - 1 + meses, Math.min(d, ultimoDia)));
}

const reais = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const recursos: Recurso[] = [
  {
    slug: 'usuarios',
    titulo: 'Usuários',
    grupo: 'Core',
    chave: ['idUsuario'],
    rotulo: 'nomeCompleto',
    campos: [
      { nome: 'nomeCompleto', rotulo: 'Nome completo', tipo: 'text', obrigatorio: true },
      { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true },
      { nome: 'senha', rotulo: 'Senha', tipo: 'password', obrigatorio: true, ocultarNaLista: true },
      // USER = aluno, INSTRUTOR = professor. Só o admin cria professores e outros admins.
      { nome: 'perfil', rotulo: 'Perfil', tipo: 'select', opcoes: ['USER', 'INSTRUTOR', 'ADMIN'] },
    ],
  },
  {
    slug: 'categorias',
    titulo: 'Categorias',
    grupo: 'Core',
    chave: ['idCategoria'],
    rotulo: 'nome',
    campos: [
      { nome: 'nome', rotulo: 'Nome', tipo: 'text', obrigatorio: true },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea' },
    ],
  },
  {
    slug: 'cursos',
    titulo: 'Cursos',
    grupo: 'Conteúdo',
    chave: ['idCurso'],
    rotulo: 'titulo',
    campos: [
      { nome: 'titulo', rotulo: 'Título', tipo: 'text', obrigatorio: true },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea', ocultarNaLista: true },
      { nome: 'idInstrutor', rotulo: 'Instrutor', tipo: 'ref', ref: 'usuarios', obrigatorio: true },
      { nome: 'idCategoria', rotulo: 'Categoria', tipo: 'ref', ref: 'categorias', obrigatorio: true },
      { nome: 'nivel', rotulo: 'Nível', tipo: 'select', opcoes: ['Iniciante', 'Intermediário', 'Avançado'] },
      { nome: 'dataPublicacao', rotulo: 'Publicação', tipo: 'date' },
      { nome: 'totalAulas', rotulo: 'Total de aulas', tipo: 'int' },
      { nome: 'totalHoras', rotulo: 'Total de horas', tipo: 'int' },
    ],
  },
  {
    slug: 'modulos',
    titulo: 'Módulos',
    grupo: 'Conteúdo',
    chave: ['idModulo'],
    rotulo: 'titulo',
    campos: [
      { nome: 'idCurso', rotulo: 'Curso', tipo: 'ref', ref: 'cursos', obrigatorio: true },
      { nome: 'titulo', rotulo: 'Título', tipo: 'text', obrigatorio: true },
      { nome: 'ordem', rotulo: 'Ordem', tipo: 'int', obrigatorio: true },
    ],
  },
  {
    slug: 'aulas',
    titulo: 'Aulas',
    grupo: 'Conteúdo',
    chave: ['idAula'],
    rotulo: 'titulo',
    campos: [
      { nome: 'idModulo', rotulo: 'Módulo', tipo: 'ref', ref: 'modulos', obrigatorio: true },
      { nome: 'titulo', rotulo: 'Título', tipo: 'text', obrigatorio: true },
      {
        nome: 'tipoConteudo',
        rotulo: 'Tipo de conteúdo',
        tipo: 'select',
        opcoes: ['Vídeo', 'Texto', 'Quiz'],
        obrigatorio: true,
      },
      { nome: 'urlConteudo', rotulo: 'URL do conteúdo', tipo: 'text', ocultarNaLista: true },
      { nome: 'duracaoMinutos', rotulo: 'Duração (min)', tipo: 'int' },
      { nome: 'ordem', rotulo: 'Ordem', tipo: 'int', obrigatorio: true },
    ],
  },
  {
    slug: 'matriculas',
    titulo: 'Matrículas',
    grupo: 'Interação',
    chave: ['idMatricula'],
    rotulo: 'idMatricula',
    campos: [
      { nome: 'idUsuario', rotulo: 'Aluno', tipo: 'ref', ref: 'usuarios', obrigatorio: true },
      { nome: 'idCurso', rotulo: 'Curso', tipo: 'ref', ref: 'cursos', obrigatorio: true },
      { nome: 'dataMatricula', rotulo: 'Data da matrícula', tipo: 'date' },
      { nome: 'dataConclusao', rotulo: 'Data de conclusão', tipo: 'date' },
    ],
  },
  {
    slug: 'progresso-aulas',
    titulo: 'Progresso das aulas',
    grupo: 'Interação',
    chave: ['idUsuario', 'idAula'],
    rotulo: 'status',
    campos: [
      { nome: 'idUsuario', rotulo: 'Aluno', tipo: 'ref', ref: 'usuarios', obrigatorio: true, somenteCriacao: true },
      { nome: 'idAula', rotulo: 'Aula', tipo: 'ref', ref: 'aulas', obrigatorio: true, somenteCriacao: true },
      { nome: 'dataConclusao', rotulo: 'Data de conclusão', tipo: 'date', obrigatorio: true },
      {
        nome: 'status',
        rotulo: 'Status',
        tipo: 'select',
        opcoes: ['Em andamento', 'Concluída'],
        obrigatorio: true,
      },
    ],
  },
  {
    slug: 'avaliacoes',
    titulo: 'Avaliações',
    grupo: 'Interação',
    chave: ['idAvaliacao'],
    rotulo: 'idAvaliacao',
    campos: [
      { nome: 'idUsuario', rotulo: 'Aluno', tipo: 'ref', ref: 'usuarios', obrigatorio: true },
      { nome: 'idCurso', rotulo: 'Curso', tipo: 'ref', ref: 'cursos', obrigatorio: true },
      { nome: 'nota', rotulo: 'Nota', tipo: 'int', obrigatorio: true },
      { nome: 'comentario', rotulo: 'Comentário', tipo: 'textarea' },
      { nome: 'dataAvaliacao', rotulo: 'Data', tipo: 'date' },
    ],
  },
  {
    slug: 'trilhas',
    titulo: 'Trilhas',
    grupo: 'Curadoria',
    chave: ['idTrilha'],
    rotulo: 'titulo',
    campos: [
      { nome: 'titulo', rotulo: 'Título', tipo: 'text', obrigatorio: true },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea', ocultarNaLista: true },
      { nome: 'idCategoria', rotulo: 'Categoria', tipo: 'ref', ref: 'categorias', obrigatorio: true },
    ],
  },
  {
    slug: 'trilhas-cursos',
    titulo: 'Cursos das trilhas',
    grupo: 'Curadoria',
    chave: ['idTrilha', 'idCurso'],
    rotulo: 'ordem',
    campos: [
      { nome: 'idTrilha', rotulo: 'Trilha', tipo: 'ref', ref: 'trilhas', obrigatorio: true, somenteCriacao: true },
      { nome: 'idCurso', rotulo: 'Curso', tipo: 'ref', ref: 'cursos', obrigatorio: true, somenteCriacao: true },
      { nome: 'ordem', rotulo: 'Ordem', tipo: 'int', obrigatorio: true },
    ],
  },
  {
    slug: 'certificados',
    titulo: 'Certificados',
    grupo: 'Curadoria',
    chave: ['idCertificado'],
    rotulo: 'codigoVerificacao',
    campos: [
      { nome: 'idUsuario', rotulo: 'Aluno', tipo: 'ref', ref: 'usuarios', obrigatorio: true },
      { nome: 'idCurso', rotulo: 'Curso', tipo: 'ref', ref: 'cursos', obrigatorio: true },
      { nome: 'idTrilha', rotulo: 'Trilha', tipo: 'ref', ref: 'trilhas' },
      { nome: 'codigoVerificacao', rotulo: 'Código de verificação', tipo: 'text', gerado: true },
      { nome: 'dataEmissao', rotulo: 'Emissão', tipo: 'date' },
    ],
  },
  {
    slug: 'planos',
    titulo: 'Planos',
    grupo: 'Negócio',
    chave: ['idPlano'],
    rotulo: 'nome',
    descrever: (p) => `#${p.idPlano} ${p.nome} — ${p.duracaoMeses} meses, ${reais(p.preco)}`,
    campos: [
      { nome: 'nome', rotulo: 'Nome', tipo: 'text', obrigatorio: true },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea', ocultarNaLista: true },
      { nome: 'preco', rotulo: 'Preço (R$)', tipo: 'decimal', obrigatorio: true },
      { nome: 'duracaoMeses', rotulo: 'Duração (meses)', tipo: 'int', obrigatorio: true },
    ],
  },
  {
    slug: 'assinaturas',
    titulo: 'Assinaturas',
    grupo: 'Negócio',
    chave: ['idAssinatura'],
    rotulo: 'idAssinatura',
    descrever: (a) => `#${a.idAssinatura} ${a.plano?.nome ?? ''} — ${a.usuario?.nomeCompleto ?? ''}`,
    // Ao escolher o plano (ou mudar o início), calcula o fim pela duração do plano.
    aoMudar: (campo, v, listas) => {
      if (campo !== 'idPlano' && campo !== 'dataInicio') return {};
      const plano = listas.planos?.find((p) => p.idPlano === Number(v.idPlano));
      if (!plano) return {};
      const inicio = v.dataInicio || hoje();
      return { dataInicio: inicio, dataFim: somarMeses(inicio, plano.duracaoMeses) };
    },
    campos: [
      { nome: 'idUsuario', rotulo: 'Usuário', tipo: 'ref', ref: 'usuarios', obrigatorio: true },
      { nome: 'idPlano', rotulo: 'Plano', tipo: 'ref', ref: 'planos', obrigatorio: true },
      { nome: 'dataInicio', rotulo: 'Início', tipo: 'date', obrigatorio: true },
      { nome: 'dataFim', rotulo: 'Fim', tipo: 'date', obrigatorio: true },
    ],
  },
  {
    slug: 'pagamentos',
    titulo: 'Pagamentos',
    grupo: 'Negócio',
    chave: ['idPagamento'],
    rotulo: 'idTransacaoGateway',
    // Ao escolher a assinatura, preenche o valor do plano e a data de hoje.
    aoMudar: (campo, v, listas) => {
      if (campo !== 'idAssinatura') return {};
      const assinatura = listas.assinaturas?.find((a) => a.idAssinatura === Number(v.idAssinatura));
      if (!assinatura?.plano) return {};
      return { valorPago: String(assinatura.plano.preco), dataPagamento: v.dataPagamento || hoje() };
    },
    campos: [
      { nome: 'idAssinatura', rotulo: 'Assinatura', tipo: 'ref', ref: 'assinaturas', obrigatorio: true },
      { nome: 'valorPago', rotulo: 'Valor pago (R$)', tipo: 'decimal', obrigatorio: true },
      { nome: 'dataPagamento', rotulo: 'Data', tipo: 'date' },
      {
        nome: 'metodoPagamento',
        rotulo: 'Método',
        tipo: 'select',
        // Mesmos valores aceitos pelo backend (METODOS_PAGAMENTO).
        opcoes: ['Pix', 'Cartão de crédito', 'Cartão de débito'],
        obrigatorio: true,
      },
      { nome: 'idTransacaoGateway', rotulo: 'ID da transação', tipo: 'text', gerado: true },
    ],
  },
];

export const grupos = [...new Set(recursos.map((r) => r.grupo))];

// Telas do professor: catálogo, conteúdo e acompanhamento dos alunos (sem usuários e financeiro).
// No curso não aparece o "Instrutor": o backend coloca o próprio professor.
const SLUGS_PROFESSOR = [
  'cursos',
  'categorias',
  'trilhas',
  'modulos',
  'aulas',
  'matriculas',
  'progresso-aulas',
  'avaliacoes',
  'certificados',
];

export const recursosProfessor: Recurso[] = recursos
  .filter((r) => SLUGS_PROFESSOR.includes(r.slug))
  .map((r) => (r.slug === 'cursos' ? { ...r, campos: r.campos.filter((c) => c.nome !== 'idInstrutor') } : r));

export function acharRecurso(slug: string | undefined, lista: Recurso[] = recursos) {
  return lista.find((r) => r.slug === slug);
}

// Caminho do registro no backend: /cursos/3 ou /trilhas-cursos/1/2.
export function caminhoDoRegistro(recurso: Recurso, registro: Record<string, unknown>) {
  return `/${recurso.slug}/${recurso.chave.map((c) => registro[c]).join('/')}`;
}
