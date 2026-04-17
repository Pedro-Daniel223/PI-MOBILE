import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProductCardGlass({ image, title, price }) {
  return (
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
        <Image
          source={image}
          style={styles.productImage}
        />

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
  );
};




const styles = StyleSheet.create({
  card: {
 borderRadius: 26,
  width: 260,
  marginRight: 15,
  overflow: 'hidden',

  backgroundColor: 'rgba(255,255,255,0.06)', // 👈 base glass

  shadowColor: '#ff2b2b',
  shadowOpacity: 0.2,
  shadowRadius: 20,
  elevation: 8,
  },

    imageContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // ✅
    },

  productImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
    transform: [{ rotate: '-8deg' }],
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

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
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
