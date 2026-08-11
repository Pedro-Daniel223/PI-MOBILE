import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../../screens/SplashScreen';

import BoasVindasScreen from '../../screens/BoasVindasScreen';
import BoasVindas2Screen from '../../screens/BoasVindas2Screen';
import BoasVindas3Screen from '../../screens/BoasVindas3Screen';

import AuthStack from './AuthStack';
import MainTabs from '../tabs/MainTabs';
import CarrinhosScreen from '../../screens/CarrinhosScreen';
import DetalhesProdutosScreens from '../../screens/DetalhesProdutosScreens';
import CarroselLoja from '../../screens/CarroselLoja';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen
        name="Splash"
        component={SplashScreen}
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

      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
      />

      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
      />

      <Stack.Screen
        name="CarroselLoja"
        component={CarroselLoja}
      />

      <Stack.Screen
        name="Carrinho"
        component={CarrinhosScreen}
      />

      <Stack.Screen
        name="DetalhesProdutos"
        component={DetalhesProdutosScreens}
      />

    </Stack.Navigator>
  );
}
