import { useCallback, useState } from 'react';
import { Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api';
import CursoItem from '../components/CursoItem';
import { comum } from '../styles/tema';

export default function MeusCursosScreen({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      // GET /matriculas devolve só as matrículas de quem está logado
      const [matriculas, todos] = await Promise.all([api('/matriculas'), api('/cursos')]);
      const ids = matriculas.map((m) => m.idCurso);
      setCursos(todos.filter((c) => ids.includes(c.idCurso)));
    } catch (e) {
      setErro(e.message);
    }
  }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  return (
    <FlatList
      style={comum.tela}
      contentContainerStyle={comum.lista}
      data={cursos}
      keyExtractor={(c) => String(c.idCurso)}
      refreshing={false}
      onRefresh={carregar}
      ListEmptyComponent={<Text style={comum.vazio}>{erro || 'Você ainda não se matriculou em nenhum curso.'}</Text>}
      renderItem={({ item }) => (
        <CursoItem curso={item} matriculado onPress={() => navigation.navigate('Curso', { idCurso: item.idCurso })} />
      )}
    />
  );
}
