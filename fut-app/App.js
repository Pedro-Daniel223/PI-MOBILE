// Este arquivo é o ponto de entrada do aplicativo React Native. Ele configura a navegação entre as telas usando o React Navigation.

// Importando navegação
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import 'react-native-gesture-handler';


// Importando telas
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import IngressosScreen from './src/screens/IngressosScreen';
import BoasVindasScreen from './src/screens/BoasVindasScreen';
import BoasVindas2Screen from './src/screens/BoasVindas2Screen';
import BoasVindas3Screen from './src/screens/BoasVindas3Screen';

// Criando o stack
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
          name="Home" 
          component={HomeScreen} 
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