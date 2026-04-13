import React, { useRef } from 'react';
import { 
  Animated, 
  TouchableWithoutFeedback, 
  StyleSheet, 
  View, 
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function GlassCard({ children, style, onPress }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  // Animação de compressão estilo iOS Control Center
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.96,
        useNativeDriver: true,
        bounciness: 8,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 40,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <TouchableWithoutFeedback 
      onPressIn={handlePressIn} 
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[
        styles.wrapper, 
        style, 
        { transform: [{ scale: scaleValue }], opacity: opacityValue }
      ]}>
        
        {/* 1. FUNDO: Blur ultra-profundo */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 90 : 120} // Android requer maior intensidade
          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        {/* 2. REFRAÇÃO: Simula a distorção do vidro com um gradiente de ruído/opacidade */}
        <LinearGradient
          colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 3. PROFUNDIDADE FÍSICA: Gradiente reverso para "curvar" o centro */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.15)']}
          style={StyleSheet.absoluteFill}
        />

        {/* 4. RIM LIGHT (Brilho Specular no Topo) */}
        <View style={styles.specularHighlight} />

        {/* 5. BORDA DE CRISTAL (Variável) */}
        <View style={styles.innerBorder} />

        {/* 6. CONTEÚDO */}
        <View style={styles.content}>
          {children}
        </View>

      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28, // Canto mais orgânico estilo Apple
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Base quase invisível
    
    // Sombra externa volumétrica
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  content: {
    padding: 20,
    zIndex: 10,
  },
  // Simula a luz batendo na borda superior (chanfro)
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 5,
  },
  // Borda interna que dá o aspecto de "espessura" ao vidro
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)', // Opacidade baixa para não parecer um traço plano
  },
});