import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../../screens/HomeScreen';
import SociosScreen from '../../screens/SociosScreen';
import IngressosScreen from '../../screens/IngressosScreen';
import PerfilScreen from '../../screens/PerfilScreen';

import NavbarGlass from '../../components/NavbarGlass';
import StoreStack from '../stacks/StoreStack';

const Tab = createBottomTabNavigator();

const getFocusedRouteName = (route) => {
  if (!route?.state) {
    return route?.name;
  }

  const nestedRoute = route.state.routes[route.state.index ?? 0];
  return getFocusedRouteName(nestedRoute);
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => {
        const activeTabRoute = props.state.routes[props.state.index];
        const focusedRouteName = getFocusedRouteName(activeTabRoute);
        const hideNavbar = focusedRouteName === 'Carrinho' || focusedRouteName === 'DetalhesProdutos';

        if (hideNavbar) {
          return null;
        }

        return <NavbarGlass {...props} />;
      }}
    >
      <Tab.Screen
        name="Ingressos"
        component={IngressosScreen}
      />

      <Tab.Screen
        name="Socio"
        component={SociosScreen}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* AQUI MUDA */}
      <Tab.Screen
        name="Loja"
        component={StoreStack}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
      />
    </Tab.Navigator>
  );
}
