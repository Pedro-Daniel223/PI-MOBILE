import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductCardGlass({ image, title, price }) {
  const [active, setActive] = useState(false);

  const rotateAnim = useRef(new Animated.Value(-8)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    const toValue = active ? -8 : 0;

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: active ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setActive(!active);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [-8, 0],
    outputRange: ['-8deg', '0deg'],
  });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
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
            source={image}
            style={[
              styles.productImage,
              { transform: [{ rotate }] },
            ]}
          />

          {/* OVERLAY */}
          <Animated.View
            pointerEvents={active ? 'auto' : 'none'}
            style={[
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
          >
            <TouchableOpacity style={styles.overlayButton}>
              <Text style={styles.overlayText}>Ver na loja</Text>
            </TouchableOpacity>
          </Animated.View>

          <LinearGradient
            colors={[
              'rgba(255,255,255,0.08)',
              'transparent'
            ]}
            style={StyleSheet.absoluteFill}
          />

          {/* FAVORITO */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={18} color="#000" />
          </TouchableOpacity>

          {/* BADGE */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Novo</Text>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.description}>
            Edição clássica retrô com tecido premium
          </Text>

          <View style={styles.footer}>
            <Text style={styles.price}>{price}</Text>

            <TouchableOpacity style={styles.addButton}>
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

  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#fff',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
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