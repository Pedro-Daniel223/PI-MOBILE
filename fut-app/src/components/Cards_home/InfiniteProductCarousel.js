/**
 * InfiniteProductCarousel — versão estática (sem animação automática)
 * ─────────────────────────────────────────────────────────────────────────────
 * Mantém o layout visual e o GlassItemWrapper original.
 * Apenas a animação de auto-scroll, PanResponder e shimmer foi removida.
 */

import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

import { BlurView }       from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../../contexts/ProductContext';

// ─── Constantes ───────────────────────────────────────────────────────────────
// ITEM_WIDTH responsivo: 280 fixo causava overflow em telas Android
// pequenas (<320px de largura útil). Agora é limitado por uma fração da
// largura da tela, preservando a proporção visual em telas médias/grandes.
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH  = Math.min(280, SCREEN_WIDTH * 0.72);
const CARD_RADIUS = 20;
const CARD_MARGIN = 8;

// ─── GlassItemWrapper ─────────────────────────────────────────────────────────
const GlassItemWrapper = React.memo(({ children, shimmerX }) => (
  <View style={styles.glassOuter}>

    <View style={styles.glassBody}>

      {/* Android: BlurView sem compositor nativo desenha um
          backgroundColor sólido de fallback. Dois BlurViews com
          intensity=0 empilhados somavam duas camadas opacas idênticas,
          aparecendo como um "quadrado" atrás do card. Mantemos 1 blur
          real no Android, com intensity mais alta para sustentar a
          leitura de vidro agora que o backgroundColor do glassBody é
          bem mais translúcido (mesma referência do CardProfileWelcome). */}
      <BlurView
        intensity={Platform.OS === 'android' ? 55 : 0}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      {Platform.OS === 'android' ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.005)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      ) : (
        <BlurView
          intensity={0}
          tint="dark"
          style={[StyleSheet.absoluteFill, { opacity: 0.20 }]}
        />
      )}

      {/* Camada de tom base — no original é morta (transparent→transparent)
          em ambas as plataformas. Android: reativada com opacidade
          mínima, já que sem blur real esta é uma das poucas camadas
          disponíveis para dar textura de vidro. iOS mantém intocado
          (transparent→transparent, comportamento original preservado). */}
      <LinearGradient
        colors={
          Platform.OS === 'android'
            ? ['rgba(255,255,255,0.035)', 'rgba(255,255,255,0.018)']
            : ['transparent', 'transparent']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Reflexo ambiental superior-esquerdo — também morto no original.
          Android: reativado como fonte de luz de estúdio, compensando a
          ausência de refração real do blur. iOS mantém intocado. */}
      <LinearGradient
        colors={
          Platform.OS === 'android'
            ? ['rgba(255, 255, 255, 0.20)', 'rgba(255, 255, 255, 0.07)', 'transparent']
            : ['transparent', 'transparent']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.65, y: 0.55 }}
      />

      {/* Highlight de volume central — reforçado no Android, já ativo em
          ambas as plataformas no original; opacidade elevada só no
          Android para compensar a ausência de curvatura simulada que o
          blur real do iOS já entrega. */}
      <LinearGradient
        colors={
          Platform.OS === 'android'
            ? [
                'transparent',
                'rgba(255, 255, 255, 0.06)',
                'rgba(255, 255, 255, 0.10)',
                'rgba(255, 255, 255, 0.06)',
                'transparent',
              ]
            : [
                'transparent',
                'rgba(255, 255, 255, 0.04)',
                'rgba(255, 255, 255, 0.08)',
                'rgba(255, 255, 255, 0.04)',
                'transparent',
              ]
        }
        style={[StyleSheet.absoluteFill, { top: '16%', bottom: '16%' }]}
        start={{ x: 0.12, y: 0.5 }}
        end={{ x: 0.88, y: 0.5 }}
      />

      {/* Vignette de profundidade inferior — morta no original.
          Android: reativada sutilmente para reforçar espessura do
          material sem blur real fazendo esse trabalho. iOS intocado. */}
      <LinearGradient
        colors={
          Platform.OS === 'android'
            ? ['transparent', 'transparent', 'rgba(0, 8, 24, 0.05)', 'rgba(0, 8, 24, 0.11)']
            : ['transparent', 'transparent']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0.44 }}
        end={{ x: 0.5, y: 1.0 }}
      />

      <View style={styles.glassContent}>
        {children}
      </View>

    </View>

    <View pointerEvents="none" style={styles.specularTop}>
      <LinearGradient
        colors={
          Platform.OS === 'android'
            ? [
                'transparent',
                'rgba(255, 255, 255, 0.62)',
                'rgba(255, 255, 255, 0.92)',
                'rgba(255, 255, 255, 0.96)',
                'rgba(255, 255, 255, 0.92)',
                'rgba(255, 255, 255, 0.62)',
                'transparent',
              ]
            : [
                'transparent',
                'rgba(255, 255, 255, 0.55)',
                'rgba(255, 255, 255, 0.90)',
                'rgba(255, 255, 255, 0.95)',
                'rgba(255, 255, 255, 0.90)',
                'rgba(255, 255, 255, 0.55)',
                'transparent',
              ]
        }
        style={{ flex: 1 }}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
    </View>

    <View pointerEvents="none" style={styles.rimLight}>
      <LinearGradient
        colors={
          Platform.OS === 'android'
            ? ['transparent', 'rgba(255, 255, 255, 0.56)', 'rgba(255, 255, 255, 0.38)', 'rgba(255, 255, 255, 0.16)', 'transparent']
            : ['transparent', 'rgba(255, 255, 255, 0.50)', 'rgba(255, 255, 255, 0.34)', 'rgba(255, 255, 255, 0.12)', 'transparent']
        }
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>

    <View pointerEvents="none" style={styles.chromaticBottom}>
      <LinearGradient
        colors={[
          'transparent',
          'rgba(160, 185, 255, 0.30)',
          'rgba(180, 200, 255, 0.45)',
          'rgba(160, 185, 255, 0.30)',
          'transparent',
        ]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
    </View>

    <View pointerEvents="none" style={styles.chromaticAmber}>
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 230, 180, 0.26)',
          'rgba(255, 210, 140, 0.36)',
          'transparent',
        ]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
    </View>

    <View pointerEvents="none" style={styles.ringOuter} />

    <View pointerEvents="none" style={styles.ringInner} />

  </View>
));

// ─── Componente principal ─────────────────────────────────────────────────────
export default function InfiniteProductCarousel({ data, renderItem }) {
  const { products } = useProducts();

  const sourceData = Array.isArray(data) && data.length > 0 ? data : products;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {sourceData.map((item, index) => (
        <View key={index} style={{ width: ITEM_WIDTH }}>
          <GlassItemWrapper>
            {renderItem({ item })}
          </GlassItemWrapper>
        </View>
      ))}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
  },

  // Android: elevation com borderRadius e backgroundColor 'transparent'
  // pinta um retângulo sólido atrás do card (bug de composição do
  // Material Design). Fix: backgroundColor 'transparent' explícito
  // + elevation reduzida, sombra suave carrega o efeito de profundidade.
  glassOuter: {
    marginHorizontal: CARD_MARGIN,
    marginVertical:   10,
    borderRadius:     CARD_RADIUS,
    backgroundColor:  'transparent',
    shadowColor:      '#182040',
    shadowOpacity:    0.14,
    shadowRadius:     24,
    shadowOffset:     { width: 0, height: 12 },
    elevation: Platform.OS === 'android' ? 5 : 10,
  },

  // Android: o bg sólido opaco anterior (#131317) evitava o bug do
  // "quadrado" mas também matava a sensação de vidro. A correção real
  // do bug é não empilhar 2 BlurViews (já resolvido acima) — aqui
  // usamos um fundo bem mais translúcido e deixamos o blur real
  // (intensity alta) e as camadas de luz sustentarem o efeito de vidro,
  // seguindo a mesma referência aplicada no CardProfileWelcome.
  glassBody: {
    borderRadius:    CARD_RADIUS,
    overflow:        'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(13,13,17,0.30)' : 'transparent',
  },

  glassContent: {
  },

  specularTop: {
    position:     'absolute',
    top:          0,
    left:         '10%',
    right:        '10%',
    height:       1,
    borderRadius: 1,
    overflow:     'hidden',
  },

  rimLight: {
    position:     'absolute',
    left:         0,
    top:          '12%',
    width:        1,
    height:       '60%',
    borderRadius: 1,
    overflow:     'hidden',
  },

  chromaticBottom: {
    position:     'absolute',
    bottom:       0,
    left:         '16%',
    right:        '16%',
    height:       0.75,
    borderRadius: 0.75,
    overflow:     'hidden',
  },

  chromaticAmber: {
    position:     'absolute',
    top:          0,
    right:        '12%',
    width:        '28%',
    height:       0.75,
    borderRadius: 0.75,
    overflow:     'hidden',
  },

  ringOuter: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    borderWidth:  0.75,
    borderColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.18)',
  },

  ringInner: {
    position:     'absolute',
    top:          1.5,
    left:         1.5,
    right:        1.5,
    bottom:       1.5,
    borderRadius: CARD_RADIUS - 1.5,
    borderWidth:  0.5,
    borderColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.30)' : 'rgba(255, 255, 255, 0.22)',
  },

});