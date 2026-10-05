import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../auth';
import {
  assinaturaAtiva,
  daquiAMeses,
  dataBR,
  METODOS_PAGAMENTO,
  reais,
  useApi,
  type Assinatura,
  type Plano,
} from '../plataforma/util';

export default function Planos() {
  const { idUsuario } = useAuth();
  const { dados: planos, erro: erroPlanos } = useApi<Plano[]>('/planos');
  const assinaturasApi = useApi<Assinatura[]>('/assinaturas');
  const [metodo, setMetodo] = useState(METODOS_PAGAMENTO[0]);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  const ativa = assinaturaAtiva(assinaturasApi.dados ?? []);

  // Assinar = criar a assinatura (hoje até hoje + duração) e registrar o pagamento.
  async function assinar(plano: Plano) {
    if (!confirm(`Assinar o plano ${plano.nome} por ${reais(plano.preco)} via ${metodo}?`)) return;
    setErro('');
    setAviso('');
    try {
      const assinatura = await api<Assinatura>('/assinaturas', 'POST', {
        idUsuario,
        idPlano: plano.idPlano,
        dataInicio: new Date().toISOString(),
        dataFim: daquiAMeses(plano.duracaoMeses),
      });
      await api('/pagamentos', 'POST', {
        idAssinatura: assinatura.idAssinatura,
        valorPago: plano.preco,
        metodoPagamento: metodo,
      });
      setAviso(`Plano ${plano.nome} assinado! O pagamento já aparece em Meus pagamentos.`);
      await assinaturasApi.recarregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <section>
      <h1>Planos</h1>
      <p className="subtitulo">Escolha o plano que combina com você.</p>

      {erroPlanos && <p className="erro">{erroPlanos}</p>}
      {erro && <p className="erro">{erro}</p>}
      {aviso && <p className="sucesso">{aviso}</p>}

      {ativa ? (
        <p className="aviso">
          Seu plano atual é o <strong>{ativa.plano.nome}</strong>, válido até {dataBR(ativa.dataFim)}.{' '}
          <Link to="/aluno/assinaturas">Gerenciar assinatura</Link>
        </p>
      ) : (
        <label className="em-linha bloco">
          Pagar com
          <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
            {METODOS_PAGAMENTO.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      )}

      {!planos ? (
        <p>Carregando…</p>
      ) : planos.length === 0 ? (
        <p className="vazio">Nenhum plano cadastrado ainda.</p>
      ) : (
        <div className="cards-cursos">
          {planos.map((p) => (
            <div key={p.idPlano} className={`card card-curso ${ativa?.idPlano === p.idPlano ? 'destaque' : ''}`}>
              <h3>{p.nome}</h3>
              <p className="preco">{reais(p.preco)}</p>
              <p className="info">
                {p.duracaoMeses} {p.duracaoMeses === 1 ? 'mês' : 'meses'} de acesso
              </p>
              {p.descricao && <p className="descricao">{p.descricao}</p>}
              <button disabled={!!ativa} onClick={() => assinar(p)}>
                {ativa?.idPlano === p.idPlano ? 'Seu plano' : 'Assinar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
