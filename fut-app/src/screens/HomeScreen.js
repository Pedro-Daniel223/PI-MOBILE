import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
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
import { useSubscription } from '../contexts/SubscriptionContext';
import { useTheme } from '../contexts/ThemeContext';
import HomeBackground from '../styles/styleHome/HomeBackground';

export default function Home({ navigation }) {
  const { isDark } = useTheme();
  const { products, refreshProducts, loading: loadingProducts } = useProducts();
  const { refreshSubscription, loadingSubscription } = useSubscription();
  const [refreshing, setRefreshing] = useState(false);
  const refreshingRef = useRef(false);
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);
  const refreshIndicatorTop = Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? 14) + 8
    : 44;

  const handleRefresh = useCallback(async () => {
    if (refreshingRef.current || loadingProducts || loadingSubscription) {
      return;
    }

    refreshingRef.current = true;
    setRefreshing(true);

    try {
      await Promise.allSettled([
        refreshProducts(),
        refreshSubscription(),
      ]);
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  }, [loadingProducts, loadingSubscription, refreshProducts, refreshSubscription]);

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <HomeBackground isDarkMode={isDark} />

      {refreshing && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: refreshIndicatorTop,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 20,
            elevation: 20,
          }}
        >
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.22)',
            }}
          >
            <ActivityIndicator size="small" color="#fff" />
          </View>
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        contentContainerStyle={stylesHome.content}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      >
        <CardProfileWelcome />

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
