import { dataBR, reais, useApi, type Assinatura, type Pagamento } from '../plataforma/util';

export default function Pagamentos() {
  const { dados: pagamentos, erro } = useApi<Pagamento[]>('/pagamentos');
  const assinaturas = useApi<Assinatura[]>('/assinaturas').dados ?? [];

  const plano = (idAssinatura: number) => assinaturas.find((a) => a.idAssinatura === idAssinatura)?.plano.nome ?? '—';

  return (
    <section>
      <h1>Meus pagamentos</h1>
      <p className="subtitulo">Todos os pagamentos das suas assinaturas.</p>
      {erro && <p className="erro">{erro}</p>}

      {!pagamentos ? (
        <p>Carregando…</p>
      ) : pagamentos.length === 0 ? (
        <p className="vazio">Nenhum pagamento ainda.</p>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Transação</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((p) => (
                <tr key={p.idPagamento}>
                  <td>{dataBR(p.dataPagamento)}</td>
                  <td>{plano(p.idAssinatura)}</td>
                  <td>{reais(p.valorPago)}</td>
                  <td>{p.metodoPagamento}</td>
                  <td>
                    <code>{p.idTransacaoGateway}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
