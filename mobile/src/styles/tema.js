import { StyleSheet } from 'react-native';

// Mesmas cores do nosso site (frontend/src/styles.css)
export const cores = {
  primaria: '#4f46e5',
  escura: '#1e1b4b',
  fundo: '#f5f6fa',
  card: '#ffffff',
  texto: '#1f2330',
  suave: '#6b7080',
  borda: '#e2e4ec',
  claro: '#eef2ff',
  verde: '#15803d',
  verdeClaro: '#dcfce7',
  perigo: '#dc2626',
};

// Cor da "capa" de cada curso (muda conforme o id)
const capas = ['#4f46e5', '#0891b2', '#d97706', '#db2777', '#059669'];
export const corDoCurso = (id) => capas[id % capas.length];

// Estilos usados em várias telas
export const comum = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: 16, gap: 10 },
  card: {
    backgroundColor: cores.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
  },
  rotulo: { fontSize: 13, fontWeight: '600', color: cores.texto, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: cores.texto,
  },
  erro: { color: cores.perigo },
  vazio: { color: cores.suave, textAlign: 'center', marginTop: 32 },
  secao: {
    fontSize: 12,
    fontWeight: '700',
    color: cores.suave,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: cores.claro,
    color: cores.primaria,
  },
  etiquetaOk: { backgroundColor: cores.verdeClaro, color: cores.verde },
});
