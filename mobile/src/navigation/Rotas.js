import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import MeusCursosScreen from '../screens/MeusCursosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import TrilhaScreen from '../screens/TrilhaScreen';
import CursoScreen from '../screens/CursoScreen';
import PagamentoScreen from '../screens/PagamentoScreen';
import { cores } from '../styles/tema';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Cabeçalho branco com texto escuro (o mesmo para todas as telas)
const cabecalho = {
  headerStyle: { backgroundColor: cores.card },
  headerTintColor: cores.texto,
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: true,
  headerBackTitle: 'Voltar',
};

// Ícone (Feather) de cada aba
const icones = { Inicio: 'home', MeusCursos: 'book-open', Perfil: 'user' };

// Abas de baixo: Início, Meus Cursos e Perfil
function Abas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...cabecalho,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.suave,
        tabBarIcon: ({ color, size }) => <Feather name={icones[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Cursos Online', tabBarLabel: 'Início' }} />
      <Tab.Screen name="MeusCursos" component={MeusCursosScreen} options={{ title: 'Meus Cursos' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function Rotas() {
  const { usuario, iniciando } = useAuth();

  // Enquanto confere se tem login salvo no celular
  if (iniciando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cores.escura }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={cabecalho}>
      {usuario ? (
        <>
          <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
          <Stack.Screen name="Trilha" component={TrilhaScreen} />
          <Stack.Screen name="Curso" component={CursoScreen} />
          <Stack.Screen name="Pagamento" component={PagamentoScreen} options={{ title: 'Matrícula' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
