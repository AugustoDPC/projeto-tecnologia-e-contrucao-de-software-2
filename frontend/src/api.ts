// Por padrão usa o proxy do Vite (vite.config.ts). Defina VITE_API_URL para apontar direto ao backend.
const API_URL = import.meta.env.VITE_API_URL ?? '/backend';

export const TOKEN_KEY = 'token';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type Metodo = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function api<T = unknown>(path: string, method: Metodo = 'GET', body?: unknown): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const semServidor = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando (npm run start:dev).';

  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, semServidor);
  }

  // Com o backend desligado, o proxy do Vite responde 500 sem corpo JSON.
  if (!res.headers.get('content-type')?.includes('application/json') && res.status >= 500) {
    throw new ApiError(res.status, semServidor);
  }

  // Token expirado ou inválido: encerra a sessão.
  if (res.status === 401 && token) {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('auth:logout'));
  }

  const texto = await res.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!res.ok) {
    // O ValidationPipe do Nest devolve um array de mensagens.
    const msg = Array.isArray(dados?.message) ? dados.message.join('\n') : (dados?.message ?? `Erro ${res.status}`);
    throw new ApiError(res.status, msg);
  }

  return dados as T;
}
