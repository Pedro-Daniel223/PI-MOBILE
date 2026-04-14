import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importando as telas
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';

// O import está correto se o arquivo se chama VerificarCodigoScreens.js
import VerificarCodigoScreens from './src/screens/VerificarCodigoScreens'; 

// Verifique se o nome físico do arquivo é NovaSenhaScreen.js ou NovaSenhaScreens.js
import NovaSenhaScreens from './src/screens/NovaSenhaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>

        <Stack.Screen name="CadastroScreen" component={CadastroScreen}/>

        <Stack.Screen name="EsqueceuSenhaScreen" component={EsqueceuSenhaScreen}/>
        
        {/* MUDEI O 'name' PARA 'VerificarCodigo'. 
            O arquivo continua sendo VerificarCodigoScreens.js, 
            mas o "apelido" da tela na navegação agora é o que o seu código espera.
        */}
        <Stack.Screen name="VerificarCodigo" component={VerificarCodigoScreens}/>

        <Stack.Screen name="NovaSenhaScreens" component={NovaSenhaScreens}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}