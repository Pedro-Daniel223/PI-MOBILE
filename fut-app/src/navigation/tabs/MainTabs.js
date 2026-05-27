import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../../screens/HomeScreen';
import LojaScreens from '../../screens/LojaScreens';
import SociosScreen from '../../screens/SociosScreen';
import IngressosScreen from '../../screens/IngressosScreen';
import NavbarGlass from '../../components/NavbarGlass';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <NavbarGlass {...props} />}
    >
      <Tab.Screen name="Ingressos" component={IngressosScreen} />
      <Tab.Screen name="Socio" component={SociosScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Loja" component={LojaScreens} />




      {/* <Tab.Screen name="Perfil" component={PerfilScreen} /> */}
    </Tab.Navigator>
  );
}