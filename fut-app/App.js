import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Bem vindo ao Drakos!!</Text>
      <Text style={styles.texto}>Seja sócio e aproveite os benefícios</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ca0101',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color:'white',
    fontSize:20,
  },
});

