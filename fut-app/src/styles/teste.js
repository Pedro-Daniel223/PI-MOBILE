import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function Teste() {
  return (
    <View style={styles.botao}>
      <Text style={styles.textoBotao}>Ingressos</Text>
    </View>
  );
}


const styles = StyleSheet.create({

  botao: {
    width: '80%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: '20%',
  },
  textoBotao: {
    color:'#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});