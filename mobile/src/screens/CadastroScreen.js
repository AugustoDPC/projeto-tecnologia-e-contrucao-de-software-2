import { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';
import Botao from '../components/Botao';
import { cores, comum } from '../styles/tema';

// Campos do formulário: [chave, rótulo, é senha?]
const CAMPOS = [
  ['nome', 'Nome completo', false],
  ['email', 'E-mail', false],
  ['senha', 'Senha (mínimo 6 caracteres)', true],
  ['confirmar', 'Confirmar senha', true],
];

export default function CadastroScreen({ navigation }) {
  const { cadastrar } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    if (!form.nome.trim() || !form.email.trim() || !form.senha) return setErro('Preencha todos os campos.');
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setErro('Digite um e-mail válido.');
    if (form.senha.length < 6) return setErro('A senha deve ter no mínimo 6 caracteres.');
    if (form.senha !== form.confirmar) return setErro('As senhas não conferem.');

    setErro('');
    setEnviando(true);
    try {
      // POST /auth/cadastrar: a conta nasce como aluno e o app já entra
      await cadastrar(form.nome.trim(), form.email.trim(), form.senha);
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  }

  return (
    <ScrollView
      style={{ backgroundColor: cores.escura }}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <View style={[comum.card, styles.cartao]}>
        <Text style={styles.titulo}>Criar conta</Text>

        {CAMPOS.map(([chave, rotulo, senha]) => (
          <View key={chave}>
            <Text style={comum.rotulo}>{rotulo}</Text>
            <TextInput
              style={comum.input}
              secureTextEntry={senha}
              autoCapitalize={chave === 'nome' ? 'words' : 'none'}
              keyboardType={chave === 'email' ? 'email-address' : 'default'}
              value={form[chave]}
              onChangeText={(valor) => setForm({ ...form, [chave]: valor })}
            />
          </View>
        ))}

        {erro ? <Text style={comum.erro}>{erro}</Text> : null}

        <Botao texto="Cadastrar" onPress={handleCadastrar} carregando={enviando} />

        <Text style={styles.rodape}>
          Já tem conta?{' '}
          <Text style={styles.link} onPress={() => navigation.goBack()}>Entrar</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  cartao: { gap: 14, padding: 22 },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.texto },
  rodape: { textAlign: 'center', color: cores.suave },
  link: { color: cores.primaria, fontWeight: '600' },
});
