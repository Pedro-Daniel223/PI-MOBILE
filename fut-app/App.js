import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import 'react-native-gesture-handler';


// Importando telas
import SplashScreen from './src/screens/SplashScreen';
import IngressosScreen from './src/screens/IngressosScreen';
import BoasVindasScreen from './src/screens/BoasVindasScreen';
import BoasVindas2Screen from './src/screens/BoasVindas2Screen';
import BoasVindas3Screen from './src/screens/BoasVindas3Screen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
// O import está correto se o arquivo se chama VerificarCodigoScreens.js
import VerificarCodigoScreens from './src/screens/VerificarCodigoScreens'; 

// Verifique se o nome físico do arquivo é NovaSenhaScreen.js ou NovaSenhaScreens.js
import NovaSenhaScreens from './src/screens/NovaSenhaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Splash"
          component={SplashScreen}
          />

        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />

        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}

        <Stack.Screen
          name="CadastroScreen"
          component={CadastroScreen}
        />

        <Stack.Screen
          name="EsqueceuSenhaScreen"
          component={EsqueceuSenhaScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
        />

        {/* MUDEI O 'name' PARA 'VerificarCodigo'. 
            O arquivo continua sendo VerificarCodigoScreens.js, 
            mas o "apelido" da tela na navegação agora é o que o seu código espera.
        */}
        <Stack.Screen
          name="VerificarCodigo"
          component={VerificarCodigoScreens}
        />

        <Stack.Screen
          name="NovaSenhaScreens"
          component={NovaSenhaScreens}
        />
        
        {/* Tela de Ingressos recem criada */}
        <Stack.Screen 
          name="Ingressos" 
          component={IngressosScreen} 
        />

        <Stack.Screen
        name="BoasVindas"
        component={BoasVindasScreen}
        />
        
        <Stack.Screen
        name="BoasVindas2"
        component={BoasVindas2Screen}
        />

        <Stack.Screen
        name="BoasVindas3"
        component={BoasVindas3Screen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}