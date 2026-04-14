import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importando telas
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import EsqueceuSenhaScreen from './src/screens/EsqueceuSenhaScreen';
// Importe a nova tela aqui (verifique se o caminho do arquivo está correto)
import VerificarCodigoScreen from './src/screens/VerificarCodigoScreens'; 
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

        {/* Tela de Cadastro */}
        <Stack.Screen name="CadastroScreen" component={CadastroScreen}/>

        {/* Tela de Recuperação de Senha (onde digita o e-mail) */}
        <Stack.Screen name="EsqueceuSenhaScreen" component={EsqueceuSenhaScreen}/>
        
        {/* NOVA TELA: Verificação de Código (OTP) */}
        {/* O name "VerificarCodigo" deve ser o mesmo usado no navigation.navigate da tela anterior */}
        <Stack.Screen name="VerificarCodigo" component={VerificarCodigoScreen}/>

        {/* Se tiver a Home, descomente a linha abaixo */}
        {/* <Stack.Screen name="Home" component={HomeScreen}/> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}