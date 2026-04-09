import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import NavbarGlass from '../components/NavbarGlass';



export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* FUNDO */}
      <Image
        source={require('../assets/img/img_teste.jpg')} // troca pelo seu caminho
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        blurRadius={2}
      />

      {/* SCROLL */}
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.title}>Seja bem-vindo 🔥</Text>

        {/* SIMULANDO CONTEÚDO */}
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>
              Conteúdo {i + 1}
            </Text>
          </View>
        ))}

      </ScrollView>

      {/* NAVBAR FIXA */}
      <NavbarGlass navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ae0000',
  },

  scroll: {
    paddingTop: 80,
    paddingBottom: 120, // espaço pra não esconder atrás da navbar
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },


  card: {
    height: 120,
    borderRadius: 16,
    marginBottom: 15,
    justifyContent: 'center',
    padding: 20,

    backgroundColor: '#1c1c1e', // 🔥 sólido (estilo iOS)
  },

  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
