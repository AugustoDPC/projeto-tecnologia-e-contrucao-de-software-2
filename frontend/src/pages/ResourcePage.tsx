import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import {
  acharRecurso,
  caminhoDoRegistro,
  recursos,
  type Campo,
  type Listas,
  type Recurso,
  type Registro,
  type Valores,
} from '../resources';

type Opcao = { valor: string; texto: string };

// "lista" = quais tabelas esta tela pode abrir (o admin vê todas; o professor, as dele).
export default function ResourcePage({ lista = recursos }: { lista?: Recurso[] }) {
  const { slug } = useParams();
  const recurso = acharRecurso(slug, lista);

  if (!recurso) return <p className="erro">Página não encontrada.</p>;
  // A key reinicia o estado ao trocar de tabela no menu.
  return <Tabela key={recurso.slug} recurso={recurso} />;
}

// Opções de um select que aponta para outra tabela (ex.: categorias de um curso).
function opcoesDaRef(ref: string, listas: Listas): Opcao[] {
  const alvo = recursos.find((r) => r.slug === ref)!;
  return (listas[ref] ?? []).map((r) => {
    const id = r[alvo.chave[0]];
    const texto = alvo.descrever
      ? alvo.descrever(r)
      : `#${id} ${alvo.rotulo !== alvo.chave[0] ? r[alvo.rotulo] : ''}`.trim();
    return { valor: String(id), texto };
  });
}

function Tabela({ recurso }: { recurso: Recurso }) {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [listas, setListas] = useState<Listas>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  // null = formulário fechado, {} = novo registro, registro = edição.
  const [editando, setEditando] = useState<Registro | null>(null);

  const colunas = [
    ...(recurso.chave.length === 1 ? [recurso.chave[0]] : []),
    ...recurso.campos.filter((c) => !c.ocultarNaLista).map((c) => c.nome),
  ];

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setRegistros(await api<Registro[]>(`/${recurso.slug}`));
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  }, [recurso.slug]);

  // Carrega as tabelas referenciadas, usadas nos selects e nos preenchimentos automáticos.
  const carregarListas = useCallback(async () => {
    const refs = [...new Set(recurso.campos.filter((c) => c.ref).map((c) => c.ref!))];
    const resultado: Listas = {};
    await Promise.all(
      refs.map(async (ref) => {
        try {
          resultado[ref] = await api<Registro[]>(`/${ref}`);
        } catch {
          resultado[ref] = [];
        }
      }),
    );
    setListas(resultado);
  }, [recurso]);

  useEffect(() => {
    carregar();
    carregarListas();
  }, [carregar, carregarListas]);

  function abrir(registro: Registro) {
    setEditando(registro);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function excluir(registro: Registro) {
    if (!confirm('Excluir este registro?')) return;
    try {
      await api(caminhoDoRegistro(recurso, registro), 'DELETE');
      if (editando && caminhoDoRegistro(recurso, editando) === caminhoDoRegistro(recurso, registro)) {
        setEditando(null);
      }
      await carregar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  function rotuloDaColuna(nome: string) {
    return recurso.campos.find((c) => c.nome === nome)?.rotulo ?? 'ID';
  }

  function mostrar(nome: string, valor: unknown) {
    if (valor === null || valor === undefined || valor === '') return '—';
    const campo = recurso.campos.find((c) => c.nome === nome);
    if (campo?.tipo === 'date') return new Date(valor as string).toLocaleDateString('pt-BR');
    if (campo?.tipo === 'decimal') return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    if (campo?.ref) return opcoesDaRef(campo.ref, listas).find((o) => o.valor === String(valor))?.texto ?? `#${valor}`;
    return String(valor);
  }

  const novo = editando !== null && Object.keys(editando).length === 0;
  const caminhoEditando = editando && !novo ? caminhoDoRegistro(recurso, editando) : null;

  return (
    <section>
      <div className="cabecalho-pagina">
        <h1>{recurso.titulo}</h1>
        <button onClick={() => abrir({})}>+ Novo</button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {editando && (
        <Formulario
          // Trocar a key recria o formulário com os dados do registro clicado.
          key={caminhoEditando ?? 'novo'}
          recurso={recurso}
          registro={editando}
          listas={listas}
          onCancelar={() => setEditando(null)}
          onSalvo={async () => {
            setEditando(null);
            await Promise.all([carregar(), carregarListas()]);
          }}
        />
      )}

      {carregando ? (
        <p>Carregando…</p>
      ) : registros.length === 0 ? (
        <p className="vazio">Nenhum registro cadastrado.</p>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                {colunas.map((c) => (
                  <th key={c}>{rotuloDaColuna(c)}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => {
                const caminho = caminhoDoRegistro(recurso, r);
                return (
                  <tr key={caminho} className={caminho === caminhoEditando ? 'editando' : ''}>
                    {colunas.map((c) => (
                      <td key={c}>{mostrar(c, r[c])}</td>
                    ))}
                    <td className="acoes">
                      <button className="secundario" onClick={() => abrir(r)}>
                        Editar
                      </button>
                      <button className="perigo" onClick={() => excluir(r)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type FormProps = {
  recurso: Recurso;
  registro: Registro;
  listas: Listas;
  onCancelar: () => void;
  onSalvo: () => void;
};

function Formulario({ recurso, registro, listas, onCancelar, onSalvo }: FormProps) {
  const novo = Object.keys(registro).length === 0;
  const [valores, setValores] = useState<Valores>(() =>
    Object.fromEntries(recurso.campos.map((c) => [c.nome, paraInput(c, registro[c.nome])])),
  );
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Campos gerados pelo backend não aparecem ao criar.
  const visiveis = recurso.campos.filter((c) => !(novo && c.gerado));
  // Na edição, a senha é opcional (em branco = mantém a atual).
  const obrigatorio = (c: Campo) => !!c.obrigatorio && !(c.tipo === 'password' && !novo);

  function mudar(nome: string, valor: string) {
    setValores((atual) => {
      const proximo = { ...atual, [nome]: valor };
      return { ...proximo, ...recurso.aoMudar?.(nome, proximo, listas) } as Valores;
    });
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    const corpo: Registro = {};
    for (const c of recurso.campos) {
      if (c.gerado || (!novo && c.somenteCriacao)) continue;
      const v = valores[c.nome];
      if (v === '') continue;
      corpo[c.nome] = paraApi(c, v);
    }

    try {
      if (novo) await api(`/${recurso.slug}`, 'POST', corpo);
      else await api(caminhoDoRegistro(recurso, registro), 'PATCH', corpo);
      onSalvo();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="card formulario" onSubmit={salvar}>
      <h2>{novo ? 'Novo registro' : `Editar registro ${caminhoDoRegistro(recurso, registro).split('/').slice(2).join(' / ')}`}</h2>
      <div className="grade">
        {visiveis.map((c) => (
          <label key={c.nome} className={c.tipo === 'textarea' ? 'largo' : ''}>
            {c.rotulo}
            {obrigatorio(c) && ' *'}
            <Entrada
              campo={c}
              valor={valores[c.nome]}
              opcoes={opcoesDoCampo(c, listas, valores[c.nome])}
              obrigatorio={obrigatorio(c)}
              desabilitado={c.gerado || (!novo && !!c.somenteCriacao)}
              onChange={(v) => mudar(c.nome, v)}
            />
          </label>
        ))}
      </div>
      {erro && <p className="erro">{erro}</p>}
      <div className="botoes">
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
        <button type="button" className="secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function opcoesDoCampo(campo: Campo, listas: Listas, atual: string): Opcao[] {
  if (campo.ref) return opcoesDaRef(campo.ref, listas);
  if (!campo.opcoes) return [];
  const opcoes = campo.opcoes.map((o) => ({ valor: o, texto: o }));
  // Mantém visível um valor antigo que não está mais na lista.
  if (atual && !campo.opcoes.includes(atual)) opcoes.unshift({ valor: atual, texto: atual });
  return opcoes;
}

type EntradaProps = {
  campo: Campo;
  valor: string;
  opcoes: Opcao[];
  obrigatorio: boolean;
  desabilitado: boolean;
  onChange: (v: string) => void;
};

function Entrada({ campo, valor, opcoes, obrigatorio, desabilitado, onChange }: EntradaProps) {
  const comum = {
    value: valor,
    required: obrigatorio,
    disabled: desabilitado,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };

  switch (campo.tipo) {
    case 'textarea':
      return <textarea rows={3} {...comum} />;
    case 'ref':
    case 'select':
      return (
        <select {...comum}>
          <option value="">Selecione…</option>
          {opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      );
    case 'int':
      return <input type="number" step="1" {...comum} />;
    case 'decimal':
      return <input type="number" step="0.01" min="0" {...comum} />;
    case 'date':
      return <input type="date" {...comum} />;
    case 'password':
      return <input type="password" minLength={6} autoComplete="new-password" {...comum} />;
    default:
      return <input type={campo.tipo} {...comum} />;
  }
}

// Converte o valor vindo da API para o formato do <input>.
function paraInput(campo: Campo, valor: unknown): string {
  if (valor === null || valor === undefined || campo.tipo === 'password') return '';
  if (campo.tipo === 'date') return String(valor).slice(0, 10);
  return String(valor);
}

// Converte o valor do <input> para o formato esperado pelos DTOs do backend.
function paraApi(campo: Campo, valor: string): unknown {
  switch (campo.tipo) {
    case 'int':
    case 'ref':
      return parseInt(valor, 10);
    case 'decimal':
      return parseFloat(valor);
    case 'date':
      return new Date(`${valor}T00:00:00`).toISOString();
    default:
      return valor;
  }
}
