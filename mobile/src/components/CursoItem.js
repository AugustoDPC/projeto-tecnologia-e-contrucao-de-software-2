import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { cores, comum, corDoCurso } from '../styles/tema';

// Um curso na lista: "capa" colorida com a inicial + título, professor e nível
export default function CursoItem({ curso, onPress, matriculado }) {
  return (
    <TouchableOpacity style={[comum.card, styles.linha]} onPress={onPress}>
      <View style={[styles.capa, { backgroundColor: corDoCurso(curso.idCurso) }]}>
        <Text style={styles.inicial}>{curso.titulo[0]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.titulo}>{curso.titulo}</Text>
        <Text style={styles.prof}>{curso.instrutor?.nomeCompleto ?? 'Sem instrutor'}</Text>
        <View style={styles.etiquetas}>
          {curso.nivel ? <Text style={comum.etiqueta}>{curso.nivel}</Text> : null}
          {matriculado ? <Text style={[comum.etiqueta, comum.etiquetaOk]}>Matriculado</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 14, alignItems: 'center', padding: 12 },
  capa: { width: 56, height: 56, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  inicial: { color: '#fff', fontSize: 24, fontWeight: '700' },
  info: { flex: 1, gap: 3 },
  titulo: { fontSize: 16, fontWeight: '700', color: cores.texto },
  prof: { fontSize: 13, color: cores.suave },
  etiquetas: { flexDirection: 'row', gap: 6, marginTop: 2 },
});
