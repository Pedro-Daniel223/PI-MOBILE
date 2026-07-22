import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../contexts/CartContext';

const resolveImageSource = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return { uri: value };
  }

  return value;
};

const parsePrice = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function ProductCardGlass({ image, title, price, product }) {
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const pressAnim = useRef(new Animated.Value(0)).current;

  const productData = product ?? { image, title, price };
  const productImageRaw =
    productData.image ??
    image ??
    productData.imagem ??
    productData.images?.[0] ??
    productData.imagens?.[0] ??
    null;
  const productImage = resolveImageSource(productImageRaw);
  const productTitle = productData.title ?? title ?? 'Produto';
  const productPrice = productData.priceDisplay ?? productData.price ?? price;
  const productDetails = {
    id: productData.id ?? productTitle,
    nome: productData.nome ?? productTitle,
    preco:
      typeof productData.preco === 'number'
        ? productData.preco
        : parsePrice(productPrice),
    imagem: productData.imagem ?? productImage,
    imagens: productData.imagens ?? (productImage ? [productImage] : []),
    descricao:
      productData.descricao ??
      productData.description ??
      'Produto em destaque da Home',
    categoria: productData.categoria,
    precoAntigo: productData.precoAntigo,
    desconto: productData.desconto,
  };

  console.log('[ProductCardGlass] image payload', {
    id: productDetails.id,
    image: productData.image ?? null,
    imagem: productData.imagem ?? null,
    images: productData.images ?? null,
    imagens: productData.imagens ?? null,
    raw: productImageRaw,
    resolved: productImage,
  });

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 350,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      tension: 250,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    navigation.navigate('Loja', {
      screen: 'DetalhesProdutos',
      params: { produto: productDetails },
    });
  };

  const handleAddToCart = () => {
    addToCart(productDetails);
    Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
  };

  const rotate = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-8deg', '0deg'],
  });

  const overlayOpacity = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.18],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.card}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

        <LinearGradient
          colors={[
            'rgba(255,255,255,0.15)',
            'rgba(255,255,255,0.05)',
            'transparent'
          ]}
          style={StyleSheet.absoluteFill}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.border} />

        {/* IMAGEM */}
        <View style={styles.imageContainer}>

          <Animated.Image
            source={productImage}
            style={[
              styles.productImage,
              { transform: [{ rotate }] },
            ]}
            onLoad={() => {
              console.log('[ProductCardGlass] image loaded', {
                id: productDetails.id,
                source: productImage,
              });
            }}
            onError={(event) => {
              console.log('[ProductCardGlass] image error', {
                id: productDetails.id,
                source: productImage,
                error: event?.nativeEvent,
              });
            }}
          />

          {/* OVERLAY */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
          >
            <View style={styles.overlayButton}>
              <Text style={styles.overlayText}>Ver detalhes</Text>
            </View>
          </Animated.View>

          <LinearGradient
            colors={[
              'rgba(255,255,255,0.08)',
              'transparent'
            ]}
            style={StyleSheet.absoluteFill}
          />

          {/* BADGE */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Novo</Text>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{productTitle}</Text>

          <Text style={styles.description}>
            Edição clássica retrô com tecido premium
          </Text>

          <View style={styles.footer}>
            <Text style={styles.price}>{productPrice}</Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} activeOpacity={0.8}>
              <Ionicons name="cart-outline" size={18} color="#a90000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    width: 260,
    marginRight: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#ff2b2b',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  imageContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)', // 🔥 melhora MUITO o visual
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  overlayText: {
    fontWeight: '700',
    color: '#000',
  },

  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#ff2b2b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },

  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  infoContainer: {
    padding: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },

  description: {
    fontSize: 13,
    color: '#fff',
    marginTop: 6,
    marginBottom: 16,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#f2f2f2',
  },

  addButton: {
    backgroundColor: '#dadada',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },


  
});
