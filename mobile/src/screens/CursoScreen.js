import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../api';
import Botao from '../components/Botao';
import { cores, comum, corDoCurso } from '../styles/tema';

export default function CursoScreen({ navigation, route }) {
  const { idCurso } = route.params;
  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [matriculado, setMatriculado] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      // GET /aulas já diz se cada aula está liberada (só para quem é matriculado)
      const [c, todosModulos, aulas, matriculas] = await Promise.all([
        api(`/cursos/${idCurso}`),
        api('/modulos'),
        api('/aulas'),
        api('/matriculas'), // só as do aluno logado
      ]);
      setCurso(c);
      setModulos(
        todosModulos
          .filter((m) => m.idCurso === idCurso)
          .sort((a, b) => a.ordem - b.ordem)
          .map((m) => ({ ...m, aulas: aulas.filter((a) => a.idModulo === m.idModulo) })),
      );
      setMatriculado(matriculas.some((m) => m.idCurso === idCurso));
    } catch (e) {
      setErro(e.message);
    }
  }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  if (!curso) return <Text style={[comum.tela, comum.vazio]}>{erro || 'Carregando...'}</Text>;

  const totalAulas = modulos.reduce((soma, m) => soma + m.aulas.length, 0);

  return (
    <View style={comum.tela}>
      <ScrollView>
        {/* Faixa colorida no topo com os dados do curso */}
        <View style={[styles.faixa, { backgroundColor: corDoCurso(curso.idCurso) }]}>
          <Text style={styles.titulo}>{curso.titulo}</Text>
          <Text style={styles.faixaTexto}>{curso.instrutor?.nomeCompleto ?? 'Sem instrutor'}</Text>
          <Text style={styles.faixaTexto}>
            {curso.nivel ?? ''} · {modulos.length} módulos · {totalAulas} aulas
          </Text>
        </View>

        <View style={comum.lista}>
          {curso.descricao ? <Text style={styles.descricao}>{curso.descricao}</Text> : null}

          {modulos.map((modulo) => (
            <View key={modulo.idModulo} style={{ gap: 6 }}>
              <Text style={comum.secao}>Módulo {modulo.ordem} · {modulo.titulo}</Text>
              <View style={[comum.card, { padding: 0 }]}>
                {modulo.aulas.map((aula, i) => (
                  <TouchableOpacity
                    key={aula.idAula}
                    style={[styles.aula, i > 0 && styles.separador]}
                    disabled={!aula.liberada || !aula.urlConteudo}
                    onPress={() => Linking.openURL(aula.urlConteudo)} // abre o conteúdo da aula
                  >
                    <Feather
                      name={aula.liberada ? 'play-circle' : 'lock'}
                      size={20}
                      color={aula.liberada ? cores.primaria : cores.suave}
                    />
                    <Text style={styles.aulaTitulo}>{aula.titulo}</Text>
                    <Text style={styles.duracao}>{aula.duracaoMinutos ? `${aula.duracaoMinutos} min` : aula.tipoConteudo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Rodapé: botão de matrícula ou aviso de que já é aluno */}
      <View style={styles.rodape}>
        {matriculado ? (
          <Text style={[comum.etiqueta, comum.etiquetaOk, styles.ok]}>Você já está matriculado neste curso</Text>
        ) : (
          <Botao texto="Matricular-se" onPress={() => navigation.navigate('Pagamento', { curso })} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: { padding: 20, paddingTop: 24, gap: 4 },
  titulo: { color: '#fff', fontSize: 26, fontWeight: '700' },
  faixaTexto: { color: '#fff', opacity: 0.9 },
  descricao: { color: cores.texto, fontSize: 15 },
  aula: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  separador: { borderTopWidth: 1, borderTopColor: cores.borda },
  aulaTitulo: { flex: 1, color: cores.texto },
  duracao: { color: cores.suave, fontSize: 13 },
  rodape: { padding: 16, paddingBottom: 28, backgroundColor: cores.card, borderTopWidth: 1, borderTopColor: cores.borda },
  ok: { alignSelf: 'center', fontSize: 14, paddingVertical: 8, paddingHorizontal: 14 },
});
