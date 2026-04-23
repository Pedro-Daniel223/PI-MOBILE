import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CardSocioGlass({ onPress, flatLeft, flatRight, style }) {

  const floatAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  // 🔥 animação flutuante
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
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

  // 🔥 animação toque
  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}

    >
      
      <Animated.View
        style={[
          styles.wrapper,
          flatLeft && styles.flatLeft,
          flatRight && styles.flatRight,
          {
            transform: [{ scale: pressAnim }],
          },
        ]}
      >

        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

        <LinearGradient
          colors={[
            'rgba(255,255,255,0.08)',
            'rgba(255,255,255,0.02)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.25)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.highlight} />
        <View
          style={[
            styles.border,
            flatLeft && styles.flatLeftBorderFix,
            flatRight && styles.flatRightBorderFix,
          ]}
        />

        <View style={styles.content}>

          {/* ÍCONE */}
          <Ionicons
            name="people-outline"
            size={18}
            color="rgba(255,255,255,0.7)"
            style={{ marginBottom: 6 }}
          />


      
          {/* IMAGEM */}
          <Animated.Image
            source={require('../../assets/img/card_branco.png')}
            style={[
              styles.image,
              {
                transform: [{ translateY: floatAnim }],
              },
            ]}
          />

          {/* TEXTO */}
          <Text style={styles.title}>Seja Sócio</Text>
          <Text style={styles.desc}>
            Tenha benefícios exclusivos
          </Text>

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

      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
wrapper: {
  height: 250, // 👈 define altura padrão
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
    width: '80%',
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
    opacity: 0.90,
    // marginBottom: 35,
    marginTop: 10,
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
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
    width: '60%',
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

  glow: {
  position: 'absolute',
  width: 110,
  height: 110,
  borderRadius: 80,
  backgroundColor: 'rgba(255,255,255,0.05)',
  right: 10,
  top: 20,
},


  flatLeft: {
  borderTopLeftRadius: 4,
  borderBottomLeftRadius: 4,
},

flatRight: {
  borderTopRightRadius: 4,
  borderBottomRightRadius: 4,
},

flatLeftBorderFix: {
  borderLeftWidth: 0,
},

});