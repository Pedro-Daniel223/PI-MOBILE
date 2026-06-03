import React, { useState } from 'react';
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
import GlassCarousel from '../components/Cards_home/GlassCarousel';
import CardProfileWelcome from '../components/Cards_home/CardProfileWelcome';
import CardActionGlass from '../components/Cards_home/cardActionGlass';
import CardSocioGlass from '../components/Cards_home/CardSocioGlass';
import InfiniteProductCarousel from '../components/Cards_home/InfiniteProductCarousel';
import ProductCardGlassPro from '../components/Cards_home/ProductCardGlass';
import { useNavigation } from "@react-navigation/native";
import PremiumGlassCard from '../components/Cards_home/PremiumGlassCard';

const products = [
  {
    image: require('../assets/img/Produtos/acessorios/objeto 1/cachecol_transparent (3).png'),
    title: 'Camisa Milan 2006',
    price: 'R$ 199,90',
  },
  {
      image: require('../assets/img/Produtos/acessorios/objeto 2/boneco_transparent (3).png'),
    title: 'Camisa Real Madrid',
    price: 'R$ 249,90',
  },
  {
    image: require('../assets/img/Produtos/acessorios/objeto 3/touca_transparent.png'),
    title: 'Camisa Brasil',
    price: 'R$ 179,90',
  },
];

// Sua branch Nayane - Bom proveito!





export default function Home({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  import React, { useState } from 'react';
  import { View, Text, StyleSheet, ScrollView } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import GlassCarousel from '../components/Cards_home/GlassCarousel';
  import CardProfileWelcome from '../components/Cards_home/CardProfileWelcome';
  import CardActionGlass from '../components/Cards_home/cardActionGlass';
  import CardSocioGlass from '../components/Cards_home/CardSocioGlass';
  import InfiniteProductCarousel from '../components/Cards_home/InfiniteProductCarousel';
  import ProductCardGlassPro from '../components/Cards_home/ProductCardGlass';
  import PremiumGlassCard from '../components/Cards_home/PremiumGlassCard';
  import { products } from '../data/dataHome';
  import { stylesHome } from '../styles/styleHome/styleHome';

  export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
      <View style={stylesHome.container}>
        <LinearGradient
          colors={isDarkMode ? ['#080808', '#1a0000'] : ['#050505', '#7b0000']}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView contentContainerStyle={stylesHome.content}>
          <CardProfileWelcome isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

          <View style={stylesHome.row}>
            <CardActionGlass
              style={{ flex: 1 }}
              flatRight
              icon="storefront-outline"
              title="Drakos Store"
              desc="Veja produtos"
              image={require('../assets/img/img_home/milan_r2006(2).png')}
            />

            <CardSocioGlass flatLeft />
          </View>

          <GlassCarousel />

          <View style={{ marginTop: 25 }}>
            <View style={stylesHome.sectionHeader}>
              <Text style={stylesHome.sectionTitle}>Produtos em destaque</Text>
              <View style={stylesHome.sectionLine} />
            </View>

            <InfiniteProductCarousel
              data={products}
              renderItem={({ item }) => (
                <View style={stylesHome.productWrapper}>
                  <ProductCardGlassPro image={item.image} title={item.title} price={item.price} />
                </View>
              )}
            />
          </View>

          <PremiumGlassCard Text="Seja um membro Premium e tenha acesso a benefícios exclusivos!" />
        </ScrollView>
      </View>
    );
  }