import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { cores } from '../styles/tema';

// Botão do app. tipo="contorno" deixa só a borda (ex.: Sair)
export default function Botao({ texto, onPress, carregando, desativado, tipo, cor = cores.primaria }) {
  const contorno = tipo === 'contorno';
  return (
    <TouchableOpacity
      style={[
        styles.botao,
        contorno ? { borderColor: cor, borderWidth: 1 } : { backgroundColor: cor },
        (desativado || carregando) && { opacity: 0.6 },
      ]}
      onPress={onPress}
      disabled={desativado || carregando}
    >
      {carregando ? (
        <ActivityIndicator color={contorno ? cor : '#fff'} />
      ) : (
        <Text style={[styles.texto, { color: contorno ? cor : '#fff' }]}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  texto: { fontSize: 15, fontWeight: '600' },
});
