/**
 * InfiniteProductCarousel — Premium Liquid Glass Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Lógica original 100% preservada:
 *   – ITEM_WIDTH, AUTO_SPEED
 *   – translateX, currentOffset, animationRef, timeoutRef, isDragging
 *   – loopData ([...data, ...data, ...data])
 *   – startAutoScroll (rAF loop, resetPoint)
 *   – stopAutoScroll
 *   – scheduleResume (timeout 1000ms)
 *   – useEffect (start/cleanup)
 *   – panResponder (grant, move, release)
 *   – JSX: View overflow:hidden > Animated.View row > loopData.map
 *   – renderItem({ item }) preservado
 *
 * O que foi adicionado — visual only:
 *   – GlassItemWrapper: componente externo (sem estado, sem side-effects)
 *     que encapsula cada renderItem no mesmo vidro premium da família Home.
 *   – shimmerAnim: único Animated.Value no carousel, interpolação shimmerX
 *     passada para todos os wrappers → shimmer sincronizado entre cards.
 *
 * Arquitetura de camadas por item (baixo → cima):
 *
 *  [glassOuter]  — sem overflow:hidden, ancora sombras + camadas especulares
 *   [glassBody]  — overflow:hidden, clip do blur + shimmer
 *    G1. BlurView primário    (tint="light", intensity 52)
 *    G2. BlurView secundário  (tint="light", intensity 14, opacity 0.42)
 *    G3. Tom base neutro      (branco frio, opacidade mínima)
 *    G4. Reflexo ambiental    (superior-esquerdo)
 *    G5. Volume central       (curvatura 3D ilusória)
 *    G6. Vignette inferior    (levíssima)
 *    G7. Shimmer diagonal     (Animated, sincronizado)
 *    G8. Conteúdo             (renderItem)
 *  [Especular — fora do clip]
 *   E1. Barra especular superior  (1px)
 *   E2. Rim light esquerdo        (1px vertical)
 *   E3. Franja cromática inferior (0.75px azul-índigo)
 *   E4. Franja âmbar superior-dir (0.75px)
 *   E5. Anel externo              (0.75px branco)
 *   E6. Anel interno inset        (0.5px branco recuado)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native';

import { BlurView }       from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../../contexts/ProductContext';

// ─── Constantes ───────────────────────────────────────────────────────────────
const ITEM_WIDTH  = 280;   // preservado — usado no reset de posição do scroll
const AUTO_SPEED  = 0.3;   // preservado
const CARD_RADIUS = 20;
const CARD_MARGIN = 8;     // margem horizontal dentro do slot de 280px

const { Value, timing, loop, sequence, delay } = Animated;

// ─── GlassItemWrapper ─────────────────────────────────────────────────────────
// Componente puro (sem estado, sem efeitos) — apenas camada visual premium.
// Definido fora do componente principal para evitar re-criação em cada render.
// shimmerX: interpolação Animated passada do parent → todos os cards sincronizados.

const GlassItemWrapper = ({ children, shimmerX }) => (
  <View style={styles.glassOuter}>

    {/* ════════════════════════════════════════════════════════════════════
        CORPO DE VIDRO — overflow:hidden
        Clip necessário para conter BlurViews e varredura de shimmer.
    ════════════════════════════════════════════════════════════════════ */}
    <View style={styles.glassBody}>

      {/* G1: BlurView primário — translúcido neutro, fundo visível */}
      <BlurView
        intensity={0}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      {/* G2: BlurView secundário — profundidade sutil */}
      <BlurView
        intensity={0}
        tint="dark"
        style={[StyleSheet.absoluteFill, { opacity: 0.20 }]}
      />

      {/* G3: Tom base neutro — branco frio sem tonalidade própria
          Opacidade mínima: o blur herda as cores do fundo sem criar
          uma camada colorida independente. */}
      <LinearGradient
      colors={[
        'transparent',
      ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* G4: Reflexo ambiental superior-esquerdo
          Fonte de luz de estúdio — efeito visionOS clássico */}
      <LinearGradient
        colors={[
          'transparent',
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.65, y: 0.55 }}
      />

      {/* G5: Highlight de volume central
          Centro levemente mais luminoso — curvatura 3D ilusória */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 255, 255, 0.04)',
          'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0.04)',
          'transparent',
        ]}
        style={[StyleSheet.absoluteFill, { top: '16%', bottom: '16%' }]}
        start={{ x: 0.12, y: 0.5 }}
        end={{ x: 0.88, y: 0.5 }}
      />

      {/* G6: Vignette de profundidade inferior — levíssima
          Reforça espessura do material sem criar coloração própria */}
      <LinearGradient
        colors={[
          'transparent',
          'transparent',

        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0.44 }}
        end={{ x: 0.5, y: 1.0 }}
      />

      {/* G7: Shimmer diagonal — sincronizado via prop do carousel parent
          shimmerX é único → todos os cards varrem luz ao mesmo tempo,
          como se fossem o mesmo material iluminado por uma fonte comum. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top:    -200,
          bottom: -200,
          width:  ITEM_WIDTH * 0.30,
          transform: [
            { translateX: shimmerX },
            { skewX: '-18deg' },
          ],
        }}
      >
        <LinearGradient
          colors={[
            'transparent',

            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>

      {/* G8: Conteúdo — renderItem preservado integralmente */}
      <View style={styles.glassContent}>
        {children}
      </View>

    </View>
    {/* ── fim glassBody ─────────────────────────────────────────────── */}

    {/* ════════════════════════════════════════════════════════════════════
        CAMADA ESPECULAR — fora do overflow:hidden
        Renderizadas sobre o vidro, sem clipping.
    ════════════════════════════════════════════════════════════════════ */}

    {/* E1: Barra especular superior — linha diagnóstica do vidro real */}
    <View pointerEvents="none" style={styles.specularTop}>
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 255, 255, 0.55)',
          'rgba(255, 255, 255, 0.90)',
          'rgba(255, 255, 255, 0.95)',
          'rgba(255, 255, 255, 0.90)',
          'rgba(255, 255, 255, 0.55)',
          'transparent',
        ]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
    </View>

    {/* E2: Rim light esquerdo — iluminação de estúdio lateral */}
    <View pointerEvents="none" style={styles.rimLight}>
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 255, 255, 0.50)',
          'rgba(255, 255, 255, 0.34)',
          'rgba(255, 255, 255, 0.12)',
          'transparent',
        ]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>

    {/* E3: Franja cromática inferior — refração de ondas curtas
        Azul-índigo extremamente sutil na aresta inferior */}
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

    {/* E4: Franja âmbar — borda superior-direita (refração de ondas longas) */}
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

    {/* E5: Anel externo (0.75px) — envelope do vidro */}
    <View pointerEvents="none" style={styles.ringOuter} />

    {/* E6: Anel interno inset (0.5px) — espessura do vidro
        Segunda superfície visível: ilusão de material com espessura real.
        Detalhe que separa o premium do comum. */}
    <View pointerEvents="none" style={styles.ringInner} />

  </View>
);

// ─── Componente principal ─────────────────────────────────────────────────────
export default function InfiniteProductCarousel({ data, renderItem }) {
  const { products } = useProducts();

  // ── Lógica original — intacta ─────────────────────────────────────────────
  const translateX     = useRef(new Animated.Value(0)).current;
  const currentOffset  = useRef(0);
  const animationRef   = useRef(null);
  const timeoutRef     = useRef(null);
  const isDragging     = useRef(false);

  const sourceData = Array.isArray(data) && data.length > 0 ? data : products;
  const loopData = [...sourceData, ...sourceData, ...sourceData];

  // 🔥 ANIMAÇÃO
  const startAutoScroll = () => {
    const animate = () => {
      if (isDragging.current) return;

      currentOffset.current -= AUTO_SPEED;

      const maxWidth   = sourceData.length * ITEM_WIDTH;
      const resetPoint = -maxWidth;

      if (Math.abs(currentOffset.current) >= maxWidth * 2) {
        currentOffset.current = resetPoint;
      }

      translateX.setValue(currentOffset.current);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAutoScroll = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // ⏳ delay inteligente
  const scheduleResume = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isDragging.current) {
        startAutoScroll();
      }
    }, 1000); // 👈 4 segundos (pode mudar pra 5000)
  };

  useEffect(() => {
    if (!sourceData.length) {
      return undefined;
    }

    startAutoScroll();

    return () => {
      stopAutoScroll();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sourceData.length]);

  // 🖐️ TOQUE
  const panResponder = useRef(
    
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isDragging.current = true;

        stopAutoScroll();

        // cancela qualquer retorno automático
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      },

      onPanResponderMove: (_, gesture) => {
        const newOffset = currentOffset.current + gesture.dx;
        translateX.setValue(newOffset);
      },

      onPanResponderRelease: (_, gesture) => {
        currentOffset.current += gesture.dx;

        isDragging.current = false;

        // 👇 só volta depois de um tempo
        scheduleResume();
      },
    })
  ).current;
  // ── fim lógica original ───────────────────────────────────────────────────

  // ── shimmerAnim — visual only, não interfere na lógica do carousel ────────
  // Um único valor compartilhado: todos os wrappers recebem a mesma shimmerX
  // → efeito de luz varrendo toda a fila de produtos em sincronia.
  const shimmerAnim = useRef(new Value(0)).current;

  useEffect(() => {
    const anim = loop(
      sequence([
        delay(3800),
        timing(shimmerAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        timing(shimmerAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const shimmerX = shimmerAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [-(ITEM_WIDTH * 1.5), ITEM_WIDTH * 1.5],
  });
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={{ overflow: 'hidden' }} {...panResponder.panHandlers}>
      
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX }],
        }}
      >
        {loopData.map((item, index) => (
          // Slot de largura preservado — ITEM_WIDTH inalterado.
          // A margem visual fica dentro do GlassItemWrapper (styles.glassOuter),
          // sem afetar os cálculos de resetPoint/maxWidth.
          <View key={index} style={{ width: ITEM_WIDTH }}>
            <GlassItemWrapper shimmerX={shimmerX}>
              {renderItem({ item })}
            </GlassItemWrapper>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Container externo — sem overflow:hidden.
  // Sombras funcionam corretamente no iOS fora do overflow.
  // marginHorizontal cria o respiro visual entre cards sem afetar ITEM_WIDTH.
  glassOuter: {
    marginHorizontal: CARD_MARGIN,
    marginVertical:   10,
    borderRadius:     CARD_RADIUS,
    // Sombra premium: soft, difusa, neutra
    shadowColor:      '#182040',
    shadowOpacity:    0.14,
    shadowRadius:     24,
    shadowOffset:     { width: 0, height: 12 },
    elevation:        10,
  },

  // Corpo do vidro — overflow:hidden para clip do blur e shimmer
  glassBody: {
    borderRadius:    CARD_RADIUS,
    overflow:        'hidden',
    backgroundColor: 'transparent'
  },

  // Wrapper do renderItem — sem padding (renderItem define seu próprio layout)
  glassContent: {
    // Intencionalmente vazio: o conteúdo define suas próprias dimensões.
    // Adicionar padding aqui causaria conflito com o layout interno do renderItem.
  },

  // ── Camada especular ──────────────────────────────────────────────────────

  // E1: Barra especular superior
  specularTop: {
    position:     'absolute',
    top:          0,
    left:         '10%',
    right:        '10%',
    height:       1,
    borderRadius: 1,
    overflow:     'hidden',
  },

  // E2: Rim light esquerdo
  rimLight: {
    position:     'absolute',
    left:         0,
    top:          '12%',
    width:        1,
    height:       '60%',
    borderRadius: 1,
    overflow:     'hidden',
  },

  // E3: Franja cromática inferior (azul-índigo)
  chromaticBottom: {
    position:     'absolute',
    bottom:       0,
    left:         '16%',
    right:        '16%',
    height:       0.75,
    borderRadius: 0.75,
    overflow:     'hidden',
  },

  // E4: Franja âmbar (superior-direita)
  chromaticAmber: {
    position:     'absolute',
    top:          0,
    right:        '12%',
    width:        '28%',
    height:       0.75,
    borderRadius: 0.75,
    overflow:     'hidden',
  },

  // E5: Anel externo (0.75px)
  ringOuter: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_RADIUS,
    borderWidth:  0.75,
    borderColor: 'rgba(255,255,255,0.18)'
  },

  // E6: Anel interno inset (0.5px, recuado 1.5px)
  ringInner: {
    position:     'absolute',
    top:          1.5,
    left:         1.5,
    right:        1.5,
    bottom:       1.5,
    borderRadius: CARD_RADIUS - 1.5,
    borderWidth:  0.5,
    borderColor:  'rgba(255, 255, 255, 0.22)',
  },

});
