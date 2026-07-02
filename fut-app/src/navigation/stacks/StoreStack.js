import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LojaScreens from '../../screens/LojaScreens';
import DetalhesProdutosScreens from '../../screens/DetalhesProdutosScreens';
import CarrinhosScreen from '../../screens/CarrinhosScreen';

const Stack = createNativeStackNavigator();

export default function StoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen
        name="LojaHome"
        component={LojaScreens}
      />

      <Stack.Screen
        name="DetalhesProdutos"
        component={DetalhesProdutosScreens}
      />

      <Stack.Screen
        name="Carrinho"
        component={CarrinhosScreen}
      />

    </Stack.Navigator>
  );
}