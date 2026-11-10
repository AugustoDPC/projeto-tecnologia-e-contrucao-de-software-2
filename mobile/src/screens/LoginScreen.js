import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { cores } from '../styles/theme';

// Tela de login da PlataformaCursos (base: Etapa 5.2 do tutorial).
export default function LoginScreen() {
  // Estados dos campos do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  // Mensagem de erro da validação ('' = sem erro)
  const [erro, setErro] = useState('');

  // Confere os campos antes de enviar; devolve a mensagem de erro ou '' se estiver tudo certo
  function validar() {
    if (!email.trim()) return 'Informe o e-mail.';
    // algo@algo.algo — sem espaços
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'E-mail inválido. Ex.: nome@gmail.com';
    if (!senha) return 'Informe a senha.';
    return '';
  }

  function handleLogin() {
    const mensagem = validar();
    setErro(mensagem);
    if (mensagem) return;

    // Por enquanto só o layout.
    // Aqui entrará a chamada à API NestJS (POST /auth/login com { email, password })
    alert(`Login de ${email.trim()}`);
  }

  return (
    // KeyboardAvoidingView: empurra o conteúdo para cima quando o teclado abre (iOS)
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* BLOCO 1: cabeçalho */}
      <View style={styles.cabecalho}>
        {/* Logo feita com View: um círculo (borderRadius = metade do tamanho) */}
        <View style={styles.logo}>
          <Text style={styles.logoTexto}>PC</Text>
        </View>
        <Text style={styles.titulo}>PlataformaCursos</Text>
        <Text style={styles.subtitulo}>Faça login para continuar</Text>
      </View>

      {/* BLOCO 2: formulário */}
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address" // teclado com @
          autoCapitalize="none"         // não coloca maiúscula automática
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry               // esconde os caracteres
          value={senha}
          onChangeText={setSenha}
        />

        {/* Só aparece quando a validação encontra um problema */}
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        {/* alignSelf: só este item vai para a direita */}
        <Text style={styles.esqueci}>Esqueci a senha</Text>

        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.botaoTexto}>ENTRAR</Text>
        </TouchableOpacity>
      </View>

      {/* BLOCO 3: rodapé em linha (o cadastro vem numa próxima etapa) */}
      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>Não tem conta? </Text>
        <Text style={styles.link}>Cadastre-se</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // ocupa a tela inteira
    justifyContent: 'center',   // blocos no centro vertical
    padding: 24,
    gap: 32,                    // espaço entre os três blocos
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    alignItems: 'center',       // centraliza logo e textos na horizontal
    gap: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cores.primaria,
    justifyContent: 'center',   // centraliza a sigla nos dois eixos
    alignItems: 'center',
  },
  logoTexto: { color: cores.branco, fontSize: 30, fontWeight: 'bold' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: cores.texto },
  subtitulo: { color: cores.cinza },
  formulario: {
    gap: 12,                    // sem alignItems: os inputs esticam (stretch)
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    color: cores.texto,
  },
  erro: { color: cores.perigo },
  esqueci: {
    alignSelf: 'flex-end',      // sobrescreve o stretch: vai para a direita
    color: cores.primaria,
  },
  botao: {
    height: 50,
    borderRadius: 10,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  rodape: {
    flexDirection: 'row',       // textos lado a lado
    justifyContent: 'center',   // centralizados na horizontal
  },
  rodapeTexto: { color: cores.texto },
  link: { color: cores.primaria, fontWeight: 'bold' },
});
