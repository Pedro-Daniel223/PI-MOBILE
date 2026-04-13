import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'

export default function Botao({ onPress }) {
  return (
      <TouchableOpacity
      style={styles.botao}
      onPress={onPress}>
        <Text style={styles.textoBotao}>Ingressos</Text>
      </TouchableOpacity>
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
    margin: '20%',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});