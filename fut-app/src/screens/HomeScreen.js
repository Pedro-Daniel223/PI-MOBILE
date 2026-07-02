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
import PremiumGlassCard from '../components/Cards_home/PremiumGlassCard';
import { products } from '../data/dataHome';
import { stylesHome } from '../styles/styleHome/styleHome';


export default function Home({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  return (
    <View style={stylesHome.container}>



      {/* BACKGROUND */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#080808', '#1a0000'] // Tema escuro vermelho
            : ['#050505', '#7b0000'] // Tema claro
        }
        style={StyleSheet.absoluteFill}
      />

      {/* Alternativas */}
      {/* colors={[
        '#050505',
        '#050505',
        '#1a0000',
      ]} */}

      {/* colors={[
        '#050505',
        '#2b0000',
        '#050505',
      ]} */}

      <ScrollView contentContainerStyle={stylesHome.content}>


        <CardProfileWelcome
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

          <View style={stylesHome.row}>
            <CardActionGlass
              style={{ flex: 1 }}
              flatRight
              icon="storefront-outline"
              title="Drakos Store"
              desc="Veja produtos"
              image={require('../assets/img/img_home/milan_r2006(2).png')}
              onPress={() => navigation.navigate('Loja')}
            />

            <CardSocioGlass
              flatLeft
              onPress={() => navigation.navigate('Socio')}
            />
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
                  <ProductCardGlassPro product={item} />
                </View>
              )}
            />
          </View>

          <PremiumGlassCard>

            <Text>Seja um membro Premium e tenha acesso a benefícios exclusivos!</Text>
          </PremiumGlassCard>
        </ScrollView>
      </View>
    );
  }
