import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import NavbarGlass from '../components/NavbarGlass';
import GlassCarousel from '../components/Cards_home/GlassCarousel';
import CardProfileWelcome from '../components/Cards_home/CardProfileWelcome';
import CardActionGlass from '../components/Cards_home/cardActionGlass';
import CardSocioGlass from '../components/Cards_home/CardSocioGlass';
import InfiniteProductCarousel from '../components/Cards_home/InfiniteProductCarousel';
import ProductCardGlassPro from '../components/Cards_home/ProductCardGlass';

const products = [
  {
    image: require('../assets/img/img_home/milan_r2006(2).png'),
    title: 'Camisa Milan 2006',
    price: 'R$ 199,90',
  },
  {
    image: require('../assets/img/img_home/milan_r2006(2).png'),
    title: 'Camisa Real Madrid',
    price: 'R$ 249,90',
  },
  {
    image: require('../assets/img/img_home/milan_r2006(2).png'),
    title: 'Camisa Brasil',
    price: 'R$ 179,90',
  },
];






export default function Home({ navigation }) {
  return (
    <View style={styles.container}>

      

      {/* BACKGROUND */}
      <LinearGradient
        colors={['#b30000', '#5a0000', '#1a0000']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content}>


        <CardProfileWelcome />


        {/* CARDS */}
        <View style={{ flexDirection: 'row', gap: 12 }}>

          <View style={styles.middleGlow} />
        <CardActionGlass
          style={{ flex: 1.3 }}
          flatRight
          icon="storefront-outline"
          title="Drakos Store"
          desc="Veja produtos"
          image={require('../assets/img/img_home/milan_r2006(2).png')}
          
        />

      <CardSocioGlass
        style={{ flex: 0.7 }}
        flatLeft
      />

        </View>

        {/* CARD GRANDE */}
          <GlassCarousel />



              {/* CARROSEL DE PRODUTOS */}
      <View style={{ marginTop: 25 }}>

        <Text style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 12,
        }}>
          Produtos em destaque
        </Text>

            
      {/* <ProductCardGlassPro
        image={require('../assets/img/img_home/milan_r2006(2).png')}
        title="Camisa Milan 2006"
        price="R$ 199,90"
      />

      <ProductCardGlassPro
        image={require('../assets/img/img_home/milan_r2006(2).png')}
        title="Camisa Milan 2006"
        price="R$ 199,90"
      />

      <ProductCardGlassPro
        image={require('../assets/img/img_home/milan_r2006(2).png')}
        title="Camisa Milan 2006"
        price="R$ 199,90"
      /> */}

        <InfiniteProductCarousel
          data={products}
          renderItem={({ item }) => (
            <View style={{ width: 280 }}>
              <ProductCardGlassPro
                image={item.image}
                title={item.title}
                price={item.price}
              />
            </View>
          )}
        />
      </View>

      </ScrollView>



      {/* NAVBAR */}
      <NavbarGlass navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  
  
  
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 20, // 👈 ESSENCIAL (resolve 80% do visual)
    justifyContent: 'space-between', // 👈 ESSENCIAL
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 50,
    borderRadius: 22,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
  },

  statusTitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },

  statusText: {
    color: '#fff',
    fontWeight: '700',
  },

  welcome: {
    marginTop: 20,
    marginBottom: 20,
  },

  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },

  nameText: {
    color: '#fff',
    fontSize: 20,
  },

  subText: {
    color: '#fff',
    opacity: 0.7,
  },

  row: {
    flexDirection: 'row',
    gap: 12, // 👈 controla o espaço entre os dois
    marginTop: 20, // 👈 afasta do card de cima
    justifyContent: 'space-between', // 👈 ESSENCIAL (resolve 80% do visual)
    alignItems: 'stretch', // 👈 garante altura igual
  },

  card: {
    width: '48%',
    borderRadius: 20,
  },

  bigCard: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },

  cardDesc: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },

  button: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
  },

  cardImage: {
    width: 100,
    height: 70,
  },

  middleGlow: {
  position: 'absolute',
  width: 2,
  height: '90%',
  backgroundColor: 'rgba(255,255,255,0.2)',
  alignSelf: 'center',
  left: '50%',

  // glow
  shadowColor: '#fff',
  shadowOpacity: 0.6,
  shadowRadius: 8,
  elevation: 10,
},



});