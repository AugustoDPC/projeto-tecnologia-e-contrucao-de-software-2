import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { api, reais } from '../api';
import { useAuth } from '../AuthContext';
import Botao from '../components/Botao';
import { cores, comum } from '../styles/tema';

// Os mesmos métodos que o backend aceita (METODOS_PAGAMENTO)
const METODOS = ['Pix', 'Cartão de crédito', 'Cartão de débito'];

// Linha com bolinha de marcar (usada nos planos e nas formas de pagamento)
function Opcao({ marcada, onPress, titulo, detalhe, direita }) {
  return (
    <TouchableOpacity style={[styles.opcao, marcada && styles.opcaoMarcada]} onPress={onPress}>
      <Feather name={marcada ? 'check-circle' : 'circle'} size={20} color={marcada ? cores.primaria : cores.suave} />
      <View style={{ flex: 1 }}>
        <Text style={styles.opcaoTitulo}>{titulo}</Text>
        {detalhe ? <Text style={styles.detalhe}>{detalhe}</Text> : null}
      </View>
      {direita ? <Text style={styles.preco}>{direita}</Text> : null}
    </TouchableOpacity>
  );
}

export default function PagamentoScreen({ navigation, route }) {
  const { curso } = route.params;
  const { usuario } = useAuth();
  const [planos, setPlanos] = useState([]);
  const [plano, setPlano] = useState(null);
  const [metodo, setMetodo] = useState(METODOS[0]);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  // GET /planos ao abrir a tela; já deixa o primeiro escolhido
  useEffect(() => {
    api('/planos')
      .then((lista) => {
        setPlanos(lista);
        setPlano(lista[0] ?? null);
      })
      .catch((e) => setErro(e.message));
  }, []);

  async function pagar() {
    setErro('');
    setEnviando(true);
    try {
      const { idUsuario } = usuario;

      // 1) Assinatura do plano: começa hoje e dura os meses do plano
      const inicio = new Date();
      const fim = new Date();
      fim.setMonth(fim.getMonth() + plano.duracaoMeses);
      const assinatura = await api('/assinaturas', 'POST', {
        idUsuario,
        idPlano: plano.idPlano,
        dataInicio: inicio.toISOString(),
        dataFim: fim.toISOString(),
      });

      // 2) Pagamento (simulado: o backend gera o código da transação)
      await api('/pagamentos', 'POST', {
        idAssinatura: assinatura.idAssinatura,
        valorPago: plano.preco,
        metodoPagamento: metodo,
      });

      // 3) Matrícula: o backend também cria o aviso de boas-vindas (aparece no Perfil)
      await api('/matriculas', 'POST', { idUsuario, idCurso: curso.idCurso });

      Alert.alert('Matrícula confirmada!', `Bons estudos em ${curso.titulo}.`);
      navigation.popTo('Abas', { screen: 'MeusCursos' }); // volta e abre a aba Meus Cursos
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <View style={comum.tela}>
      <ScrollView contentContainerStyle={comum.lista}>
        <View style={comum.card}>
          <Text style={styles.detalhe}>Você está se matriculando em</Text>
          <Text style={styles.curso}>{curso.titulo}</Text>
        </View>

        <Text style={comum.secao}>1. Plano</Text>
        {planos.map((p) => (
          <Opcao
            key={p.idPlano}
            marcada={plano?.idPlano === p.idPlano}
            onPress={() => setPlano(p)}
            titulo={p.nome}
            detalhe={p.descricao ?? `${p.duracaoMeses} meses`}
            direita={reais(p.preco)}
          />
        ))}

        <Text style={comum.secao}>2. Forma de pagamento</Text>
        {METODOS.map((m) => (
          <Opcao key={m} marcada={metodo === m} onPress={() => setMetodo(m)} titulo={m} />
        ))}

        {erro ? <Text style={comum.erro}>{erro}</Text> : null}
      </ScrollView>

      <View style={styles.rodape}>
        <Botao
          texto={plano ? `Pagar ${reais(plano.preco)}` : 'Pagar'}
          onPress={pagar}
          carregando={enviando}
          desativado={!plano}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  curso: { fontSize: 20, fontWeight: '700', color: cores.texto, marginTop: 2 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: cores.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  opcaoMarcada: { borderColor: cores.primaria, backgroundColor: cores.claro },
  opcaoTitulo: { fontWeight: '600', color: cores.texto },
  detalhe: { color: cores.suave, fontSize: 13 },
  preco: { fontWeight: '700', color: cores.texto },
  rodape: { padding: 16, paddingBottom: 28, backgroundColor: cores.card, borderTopWidth: 1, borderTopColor: cores.borda },
});
