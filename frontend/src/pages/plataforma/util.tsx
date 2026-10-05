// Tipos, carregamento de dados e pequenos ajudantes usados nas telas do aluno e do professor.
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';

export type Usuario = { idUsuario: number; nomeCompleto: string; email: string; perfil: string; dataCadastro: string };
export type Categoria = { idCategoria: number; nome: string; descricao: string | null };
export type Curso = {
  idCurso: number;
  titulo: string;
  descricao: string | null;
  idInstrutor: number;
  idCategoria: number;
  nivel: string | null;
  totalHoras: number | null;
  instrutor?: { nomeCompleto: string };
};
export type Modulo = { idModulo: number; idCurso: number; titulo: string; ordem: number };
// "liberada" e "idCurso" vêm do backend: sem matrícula, urlConteudo vem null.
export type Aula = {
  idAula: number;
  idModulo: number;
  idCurso: number;
  titulo: string;
  tipoConteudo: string;
  urlConteudo: string | null;
  duracaoMinutos: number | null;
  ordem: number;
  liberada: boolean;
};
export type Matricula = { idMatricula: number; idUsuario: number; idCurso: number; dataMatricula: string; dataConclusao: string | null };
export type Progresso = { idUsuario: number; idAula: number; dataConclusao: string; status: string };
export type Avaliacao = { idAvaliacao: number; idUsuario: number; idCurso: number; nota: number; comentario: string | null; dataAvaliacao: string };
export type Certificado = { idCertificado: number; idUsuario: number; idCurso: number; codigoVerificacao: string; dataEmissao: string };
export type Trilha = { idTrilha: number; titulo: string; descricao: string | null; idCategoria: number };
export type TrilhaCurso = { idTrilha: number; idCurso: number; ordem: number };
export type Plano = { idPlano: number; nome: string; descricao: string | null; preco: number; duracaoMeses: number };
export type Assinatura = { idAssinatura: number; idUsuario: number; idPlano: number; dataInicio: string; dataFim: string; plano: Plano };
export type Pagamento = {
  idPagamento: number;
  idAssinatura: number;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
};

// Mesmo texto usado pelo backend para contar a aula como feita.
export const CONCLUIDA = 'Concluída';
// Mesmos valores aceitos pelo backend (METODOS_PAGAMENTO).
export const METODOS_PAGAMENTO = ['Pix', 'Cartão de crédito', 'Cartão de débito'];

// Busca um endereço da API ao abrir a tela. "recarregar" busca de novo (depois de salvar algo).
export function useApi<T>(caminho: string | null) {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState('');

  const recarregar = useCallback(async () => {
    if (!caminho) return;
    try {
      setDados(await api<T>(caminho));
    } catch (e) {
      setErro((e as Error).message);
    }
  }, [caminho]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, erro, recarregar };
}

export const dataBR = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');

export const reais = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function estrelas(nota: number) {
  const n = Math.max(0, Math.min(5, Math.round(nota)));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export function media(notas: number[]) {
  return notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : null;
}

export function iniciais(nome: string | undefined) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
}

// Hoje + N meses, no formato que a API espera.
export function daquiAMeses(meses: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + meses);
  return d.toISOString();
}

export function assinaturaAtiva(assinaturas: Assinatura[]) {
  const agora = new Date();
  return assinaturas.find((a) => new Date(a.dataInicio) <= agora && new Date(a.dataFim) > agora) ?? null;
}

// Quantas aulas do curso existem e quantas já foram concluídas.
export function progressoDoCurso(idCurso: number, aulas: Aula[], progresso: Progresso[]) {
  const doCurso = aulas.filter((a) => a.idCurso === idCurso);
  const feitas = doCurso.filter((a) => progresso.some((p) => p.idAula === a.idAula && p.status === CONCLUIDA));
  return { total: doCurso.length, feitas: feitas.length };
}

export function BarraProgresso({ feitas, total }: { feitas: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((feitas / total) * 100);
  return (
    <div className="progresso" title={`${feitas} de ${total} aulas`}>
      <div className="barra">
        <div style={{ width: `${pct}%` }} />
      </div>
      <span>{pct}%</span>
    </div>
  );
}

export function Estatistica({ valor, rotulo }: { valor: string | number; rotulo: string }) {
  return (
    <div className="card estatistica">
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </div>
  );
}
