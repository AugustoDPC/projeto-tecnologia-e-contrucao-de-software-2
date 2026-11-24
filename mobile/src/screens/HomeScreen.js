import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import CursoItem from '../components/CursoItem';
import { cores, comum } from '../styles/tema';

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();
  const [aba, setAba] = useState('cursos'); // 'cursos' ou 'trilhas'
  const [cursos, setCursos] = useState([]);
  const [trilhas, setTrilhas] = useState([]);
  const [vinculos, setVinculos] = useState([]); // Trilhas_Cursos
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const [c, t, v] = await Promise.all([api('/cursos'), api('/trilhas'), api('/trilhas-cursos')]);
      setCursos(c);
      setTrilhas(t);
      setVinculos(v);
      setErro('');
    } catch (e) {
      setErro(e.message);
    }
  }

  // Recarrega sempre que a tela aparece
  useFocusEffect(useCallback(() => { carregar(); }, []));

  const qtdCursos = (idTrilha) => vinculos.filter((v) => v.idTrilha === idTrilha).length;

  const cabecalho = (
    <View style={styles.topo}>
      <Text style={styles.ola}>Olá, {usuario.nomeCompleto.split(' ')[0]}!</Text>
      <Text style={styles.sub}>O que você quer aprender hoje?</Text>

      {/* Seletor Cursos / Trilhas: aba ativa fica sublinhada */}
      <View style={styles.abas}>
        {['cursos', 'trilhas'].map((nome) => (
          <TouchableOpacity key={nome} style={[styles.aba, aba === nome && styles.abaAtiva]} onPress={() => setAba(nome)}>
            <Text style={[styles.abaTexto, aba === nome && styles.abaTextoAtivo]}>
              {nome === 'cursos' ? `Cursos (${cursos.length})` : `Trilhas (${trilhas.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      style={comum.tela}
      contentContainerStyle={comum.lista}
      data={aba === 'cursos' ? cursos : trilhas}
      keyExtractor={(item) => String(item.idCurso ?? item.idTrilha)}
      ListHeaderComponent={cabecalho}
      ListEmptyComponent={<Text style={comum.vazio}>{erro || 'Nada cadastrado ainda.'}</Text>}
      refreshing={false}
      onRefresh={carregar}
      renderItem={({ item }) =>
        aba === 'cursos' ? (
          <CursoItem curso={item} onPress={() => navigation.navigate('Curso', { idCurso: item.idCurso })} />
        ) : (
          <TouchableOpacity style={[comum.card, styles.trilha]} onPress={() => navigation.navigate('Trilha', { trilha: item })}>
            <Feather name="map" size={22} color={cores.primaria} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={styles.trilhaTitulo}>{item.titulo}</Text>
              {item.descricao ? <Text style={styles.sub}>{item.descricao}</Text> : null}
              <Text style={comum.etiqueta}>{qtdCursos(item.idTrilha)} cursos</Text>
            </View>
          </TouchableOpacity>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  topo: { gap: 4, marginBottom: 6 },
  ola: { fontSize: 24, fontWeight: '700', color: cores.texto },
  sub: { color: cores.suave },
  abas: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: cores.borda, marginTop: 14 },
  aba: { paddingVertical: 10, marginRight: 24, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  abaAtiva: { borderBottomColor: cores.primaria },
  abaTexto: { fontWeight: '600', color: cores.suave },
  abaTextoAtivo: { color: cores.primaria },
  trilha: { flexDirection: 'row', gap: 14, borderLeftWidth: 4, borderLeftColor: cores.primaria },
  trilhaTitulo: { fontSize: 16, fontWeight: '700', color: cores.texto },
});
