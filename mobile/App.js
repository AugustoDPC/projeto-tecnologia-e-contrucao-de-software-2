import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/AuthContext';
import Rotas from './src/navigation/Rotas';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Rotas />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
