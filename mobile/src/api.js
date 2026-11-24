// Endereço do backend NestJS.
// Vem do comando que liga o app:
//   $env:EXPO_PUBLIC_API_URL="https://xxxx-3000.brs.devtunnels.ms"
// No celular NÃO use "localhost": ele aponta para o próprio celular.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// Token JWT de quem está logado (o AuthContext preenche)
let token = null;
export function usarToken(novo) {
  token = novo;
}

// Função única para chamar a API: api('/cursos'), api('/matriculas', 'POST', {...})
export async function api(caminho, metodo = 'GET', corpo) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Confira o EXPO_PUBLIC_API_URL e se o backend está ligado.');
  }

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    // O Nest pode devolver uma mensagem ou uma lista de mensagens
    const msg = Array.isArray(dados?.message) ? dados.message.join('\n') : dados?.message;
    throw new Error(msg || `Erro ${resposta.status}`);
  }
  return dados;
}

// O JWT tem 3 partes separadas por ponto; a do meio são os dados (id, e-mail, perfil)
export function dadosDoToken(jwt) {
  const meio = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(meio));
}

// 49.9 -> "R$ 49,90"
export function reais(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}
