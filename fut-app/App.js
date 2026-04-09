// Este arquivo é o ponto de entrada do aplicativo React Native. Ele configura a navegação entre as telas usando o React Navigation.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Importando telas
import HomeScreen from './src/screens/HomeScreen';
import IngressosScreen from './src/screens/IngressosScreen';

// Criando o stack
const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
        />
        
        {/* Tela de Ingressos recem criada */}
        <Stack.Screen 
          name="Ingressos" 
          component={IngressosScreen} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
