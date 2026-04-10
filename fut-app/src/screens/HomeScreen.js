import { View, Text, FlatList, StyleSheet } from 'react-native';
import Teste from '../components/teste';
import { useNavigation as nav} from '@react-navigation/native';
import Botao from '../components/teste';
// Button é um componente nativo do React Native para criar botões simples. Ele é fácil de usar e tem uma aparência consistente em diferentes plataformas (iOS e Android). O Button aceita propriedades como title (texto do botão) e onPress (função a ser executada quando o botão é pressionado). É uma opção rápida para adicionar interatividade sem a necessidade de estilização personalizada, embora seja limitado em termos de personalização visual.

export default function HomeScreen() {
  const navigation = nav();

  const dados = [
    { id: '1', nome: 'Notebook', descricao: 'Notebook de última geração' },
    { id: '2', nome: 'Mouse', descricao: 'Mouse ergonômico' },
    { id: '3', nome: 'Teclado', descricao: 'Teclado mecânico' },
    { id: '4', nome: 'Monitor', descricao: 'Monitor 24 polegadas' },
  ];
  
  return (
    <View style={styles.container}>

      {/* Cabeçalho */}

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}

        renderItem={({ item }) => (
          <View style={styles.card}>

          <Text style={styles.nome}>{item.nome}</Text>

          <Text style={styles.descricao}>
            {item.descricao}
          </Text>
        </View>)}
      />
      {/* Botão para navegar para a tela ingressos */}
        <Botao onPress={() => navigation.navigate('Ingressos')} />
    </View> 
          
        );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
    marginTop: 40,
  },

  titulo: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    width: '93%',
    alignSelf: 'center',
    // sombra (Android + iOS)
    elevation: 3, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },

  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  descricao: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  }
});