import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api';
import CursoItem from '../components/CursoItem';
import { cores, comum } from '../styles/tema';

// Mostra os cursos da trilha como uma "linha do tempo": 1, 2, 3...
export default function TrilhaScreen({ navigation, route }) {
  const { trilha } = route.params;
  const [cursos, setCursos] = useState([]);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const [vinculos, todos] = await Promise.all([api('/trilhas-cursos'), api('/cursos')]);
      setCursos(
        vinculos
          .filter((v) => v.idTrilha === trilha.idTrilha)
          .sort((a, b) => a.ordem - b.ordem)
          .map((v) => todos.find((c) => c.idCurso === v.idCurso))
          .filter(Boolean),
      );
    } catch (e) {
      setErro(e.message);
    }
  }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  return (
    <ScrollView style={comum.tela} contentContainerStyle={comum.lista}>
      <Text style={styles.titulo}>{trilha.titulo}</Text>
      {trilha.descricao ? <Text style={styles.sub}>{trilha.descricao}</Text> : null}
      <Text style={comum.secao}>Siga esta ordem</Text>

      {cursos.length === 0 ? <Text style={comum.vazio}>{erro || 'Esta trilha ainda não tem cursos.'}</Text> : null}

      {cursos.map((curso, i) => (
        <View key={curso.idCurso} style={styles.passo}>
          {/* Bolinha com o número e a linha que liga ao próximo curso */}
          <View style={styles.marcador}>
            <View style={styles.bolinha}>
              <Text style={styles.numero}>{i + 1}</Text>
            </View>
            {i < cursos.length - 1 ? <View style={styles.linha} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: 10 }}>
            <CursoItem curso={curso} onPress={() => navigation.navigate('Curso', { idCurso: curso.idCurso })} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 22, fontWeight: '700', color: cores.texto },
  sub: { color: cores.suave },
  passo: { flexDirection: 'row', gap: 12 },
  marcador: { alignItems: 'center', width: 30 },
  bolinha: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  numero: { color: '#fff', fontWeight: '700' },
  linha: { flex: 1, width: 2, backgroundColor: cores.borda, marginTop: 4 },
});
