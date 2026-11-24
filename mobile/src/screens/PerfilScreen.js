import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import Botao from '../components/Botao';
import { cores, comum } from '../styles/tema';

export default function PerfilScreen() {
  const { usuario, sair } = useAuth();
  const [avisos, setAvisos] = useState([]);

  // Avisos (notificações) criados pelo backend, por exemplo na matrícula
  useFocusEffect(
    useCallback(() => {
      api('/notificacoes')
        .then((lista) => {
          setAvisos(lista);
          return api('/notificacoes/lidas', 'PATCH'); // marca como lidos
        })
        .catch(() => {});
    }, []),
  );

  return (
    <ScrollView style={comum.tela} contentContainerStyle={comum.lista}>
      <View style={[comum.card, styles.perfil]}>
        <View style={styles.avatar}>
          <Text style={styles.letra}>{usuario.nomeCompleto[0].toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{usuario.nomeCompleto}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
          <Text style={[comum.etiqueta, { marginTop: 6 }]}>{usuario.perfil === 'USER' ? 'Aluno' : usuario.perfil}</Text>
        </View>
      </View>

      <Text style={comum.secao}>Avisos</Text>
      {avisos.length === 0 ? <Text style={styles.email}>Nenhum aviso por enquanto.</Text> : null}
      {avisos.map((aviso) => (
        <View key={aviso.idNotificacao} style={[comum.card, styles.aviso]}>
          <Feather name="info" size={18} color={cores.primaria} />
          <View style={{ flex: 1 }}>
            <Text style={styles.avisoTexto}>{aviso.mensagem}</Text>
            <Text style={styles.data}>{new Date(aviso.dataCriacao).toLocaleString('pt-BR')}</Text>
          </View>
          {!aviso.lida ? <Text style={comum.etiqueta}>Novo</Text> : null}
        </View>
      ))}

      <View style={{ marginTop: 16 }}>
        <Botao texto="Sair da conta" tipo="contorno" cor={cores.perigo} onPress={sair} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  perfil: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: cores.escura,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letra: { color: '#fff', fontSize: 26, fontWeight: '700' },
  nome: { fontSize: 18, fontWeight: '700', color: cores.texto },
  email: { color: cores.suave },
  aviso: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12 },
  avisoTexto: { color: cores.texto },
  data: { color: cores.suave, fontSize: 12, marginTop: 4 },
});
