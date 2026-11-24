import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../AuthContext';
import Botao from '../components/Botao';
import { cores, comum } from '../styles/tema';

// Mesmo desenho da tela de login do site: um cartão branco no meio da tela
export default function LoginScreen({ navigation }) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    // Validação antes de chamar a API
    if (!email.trim() || !senha) return setErro('Preencha o e-mail e a senha.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErro('Digite um e-mail válido.');

    setErro('');
    setEnviando(true);
    try {
      await entrar(email.trim(), senha); // logou: o app troca sozinho para as abas
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.marca}>Cursos Online</Text>

      <View style={[comum.card, styles.cartao]}>
        <Text style={styles.titulo}>Entrar</Text>

        <View>
          <Text style={comum.rotulo}>E-mail</Text>
          <TextInput
            style={comum.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text style={comum.rotulo}>Senha</Text>
          <TextInput style={comum.input} secureTextEntry value={senha} onChangeText={setSenha} />
        </View>

        {erro ? <Text style={comum.erro}>{erro}</Text> : null}

        <Botao texto="Entrar" onPress={handleEntrar} carregando={enviando} />

        <Text style={styles.rodape}>
          Não tem conta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
            Cadastre-se
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: cores.escura },
  marca: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  cartao: { gap: 14, padding: 22 },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.texto },
  rodape: { textAlign: 'center', color: cores.suave },
  link: { color: cores.primaria, fontWeight: '600' },
});
