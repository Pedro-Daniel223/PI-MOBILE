import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../screens/LoginScreen';
import CadastroScreen from '../../screens/CadastroScreen';
import EsqueceuSenhaScreen from '../../screens/EsqueceuSenhaScreen';
import VerificarCodigoScreens from '../../screens/VerificarCodigoScreens';
import NovaSenhaScreen from '../../screens/NovaSenhaScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Cadastro" component={CadastroScreen} />

      <Stack.Screen
        name="EsqueceuSenha"
        component={EsqueceuSenhaScreen}
      />

      <Stack.Screen
        name="VerificarCodigo"
        component={VerificarCodigoScreens}
      />

      <Stack.Screen
        name="NovaSenha"
        component={NovaSenhaScreen}
      />

    </Stack.Navigator>
  );
}