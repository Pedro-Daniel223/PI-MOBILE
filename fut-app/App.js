import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando telas
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';
// import HomeScreen from './src/screens/HomeScreen';

// Criando o stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        {/* Tela de Login */}
        <Stack.Screen name="Login" component={LoginScreen}/>

        {/* IMPORTANTE: O "name" abaixo deve ser igual ao que você usa no navigation.navigate */}
        <Stack.Screen name="CadastroScreen" component={CadastroScreen}/>

        {/* Tela de Recuperação de Senha */}
        <Stack.Screen name="EsqueceuSenhaScreen" component={EsqueceuSenhaScreen}/>
        
        {/* Se tiver a Home, descomente a linha abaixo */}
        {/* <Stack.Screen name="Home" component={HomeScreen}/> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}