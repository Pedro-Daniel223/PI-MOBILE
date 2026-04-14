import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';




export default function CardActionGlass({
  icon,
  title,
  desc,
  image,
  onPress,
}) {


const floatAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatAnim, {
        toValue: -12,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

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

          {/* ÍCONE (agora mais sutil) */}
          <Ionicons 
            name={icon} 
            size={18} 
            color="rgba(255,255,255,0.7)" 
            style={{ marginBottom: 6 }}
          />




        <Animated.Image
          source={image}
          style={[
            styles.image,
            {
              transform: [{ translateY: floatAnim }],
            },
          ]}
        />






          {/* TEXTO */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>

          {/* BOTÃO GLASS */}
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
    flex: 1,
  },

image: {
  width: '110%',
  height: 100,
  resizeMode: 'contain',
  alignSelf: 'center',
  marginVertical: 10,
  opacity: 0.95,
},

  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6,
  },

  desc: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.6,
    marginTop: 3,
  },

  button: {
    marginTop: 'auto',
    height: 26,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: '55%',
    alignSelf: 'flex-start',
  },

  buttonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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