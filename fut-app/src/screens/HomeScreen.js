import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

import GlassCarousel from '../components/Cards_home/GlassCarousel';
import CardProfileWelcome from '../components/Cards_home/CardProfileWelcome';
import CardActionGlass from '../components/Cards_home/cardActionGlass';
import CardSocioGlass from '../components/Cards_home/CardSocioGlass';
import InfiniteProductCarousel from '../components/Cards_home/InfiniteProductCarousel';
import ProductCardGlassPro from '../components/Cards_home/ProductCardGlass';
import PremiumGlassCard from '../components/Cards_home/PremiumGlassCard';
import VideoHighlightCard from '../components/Cards_home/Videohighlightcard';
import { stylesHome } from '../styles/styleHome/styleHome';
import { useProducts } from '../contexts/ProductContext';
import HomeBackground from '../styles/styleHome/HomeBackground';

export default function Home({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { products } = useProducts();
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <HomeBackground isDarkMode={isDarkMode} />

      <ScrollView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        contentContainerStyle={stylesHome.content}
      >
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
            data={featuredProducts}
            renderItem={({ item }) => (
              <View style={stylesHome.productWrapper}>
                <ProductCardGlassPro product={item} />
              </View>
            )}
          />
        </View>

        {/* <PremiumGlassCard>
        </PremiumGlassCard> */}

        <VideoHighlightCard
          onPress={() => {
            Linking.openURL('https://youtu.be/K1qcPok3kjQ?si=F-WpGcvBMQ-jlwZy');
          }}
        />
      </ScrollView>
    </View>
  );
}
