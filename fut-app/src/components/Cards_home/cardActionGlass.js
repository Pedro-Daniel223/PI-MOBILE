import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CardActionGlass({
  icon,
  title,
  desc,
  image, // 👈 NOVO
  onPress,
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={styles.wrapper}>

        {/* BLUR */}
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

        {/* REFRAÇÃO */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.08)',
            'rgba(255,255,255,0.02)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
        />

        {/* PROFUNDIDADE */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.25)']}
          style={StyleSheet.absoluteFill}
        />

        {/* HIGHLIGHT */}
        <View style={styles.highlight} />

        {/* BORDA */}
        <View style={styles.border} />

        {/* CONTEÚDO */}
        <View style={styles.content}>

          <Ionicons name={icon} size={30} color="#fff" />

          {/* IMAGEM */}
          {image && (
            <Image
              source={image}
              style={styles.image}
            />
          )}

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>

          {/* BOTÃO */}
            <View style={styles.button}>
              
              <BlurView
                intensity={60}
                tint="light"
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.25)',
                  'rgba(255,255,255,0.05)',
                  'transparent',
                ]}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.buttonBorder} />

              <Text style={styles.buttonText}>VER</Text>

            </View>

        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',

    shadowColor: '#ff2b2b',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  content: {
    padding: 20,
    flex: 1, // 👈 permite empurrar botão pra baixo
  },

  image: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    marginVertical: 10,
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },

  desc: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },

button: {
  marginTop: 'auto',
  height: 25,
  borderRadius: 12,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  width: '70%',
},

buttonBorder: {
  ...StyleSheet.absoluteFillObject,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
},

buttonText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 1,
},

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});