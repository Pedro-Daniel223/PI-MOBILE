import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas existentes
import SplashScreen from './src/screens/SplashScreen';
import IngressosScreen from './src/screens/IngressosScreen';
import BoasVindasScreen from './src/screens/BoasVindasScreen';
import BoasVindas2Screen from './src/screens/BoasVindas2Screen';
import BoasVindas3Screen from './src/screens/BoasVindas3Screen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';
import VerificarCodigoScreens from './src/screens/VerificarCodigoScreens';
import NovaSenhaScreens from './src/screens/NovaSenhaScreen';

// Novas telas
import LojaScreens from './src/screens/LojaScreens';
// Removi a importação da DetalhesProdutosScreen aqui

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CadastroScreen" component={CadastroScreen} />
        <Stack.Screen name="EsqueceuSenhaScreen" component={EsqueceuSenhaScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VerificarCodigo" component={VerificarCodigoScreens} />
        <Stack.Screen name="NovaSenhaScreens" component={NovaSenhaScreens} />
        <Stack.Screen name="Ingressos" component={IngressosScreen} />
        <Stack.Screen name="BoasVindas" component={BoasVindasScreen} />
        <Stack.Screen name="BoasVindas2" component={BoasVindas2Screen} />
        <Stack.Screen name="BoasVindas3" component={BoasVindas3Screen} />
        
        {/* Rota da Loja */}
        <Stack.Screen name="Loja" component={LojaScreens} />
        
        {/* A tela DetalhesProduto foi removida daqui */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}