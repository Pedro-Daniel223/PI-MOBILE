/**
 * GlassCarousel — Ultra-Premium Liquid Glass Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Arquitetura de camadas por card (baixo → cima):
 *
 *  SHADOW SYSTEM
 *   S1. Sombra de levitação (grande, difusa, deep navy)
 *   S2. Sombra de contato (próxima, sharp)
 *   S3. Glow colorido inferior (acento de cor do time)
 *
 *  GLASS BODY (overflow: hidden)
 *   G1. BlurView primário (base fosca, intensity 100)
 *   G2. BlurView secundário (profundidade, intensity 28)
 *   G3. Tom base azul-escuro naval (gradient diagonal)
 *   G4. Reflexo ambiental superior-esquerdo (luz de estúdio)
 *   G5. Highlight de volume central (curvatura ilusória)
 *   G6. Vignette de profundidade inferior
 *   G7. Overlay de textura metálica sutil
 *   G8. Shimmer diagonal animado (varredura de luz)
 *   G9. Conteúdo (children)
 *
 *  SPECULAR LAYER (fora do clip)
 *   E1. Barra especular superior (1px, ultra-brilhante)
 *   E2. Rim light esquerdo (1px vertical)
 *   E3. Separação cromática: franja azul inferior
 *   E4. Separação cromática: franja âmbar superior-direito
 *   E5. Anel externo (0.75px branco)
 *   E6. Anel interno inset (0.5px branco recuado)
 *
 *  Mantém:
 *   - Estrutura de layout e conteúdo original
 *   - Lógica de carousel e auto-scroll
 *   - Todos os dados, logos, times, botão
 *   - Indicadores de paginação
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 170;
const CARD_RADIUS = 28;

const CARD_GAP = 18;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_GAP;

// ─── Shimmer animation helper ─────────────────────────────────────────────────
const { Value, timing, loop, sequence, delay } = Animated;

// ─── Single Premium Glass Card ────────────────────────────────────────────────
const PremiumMatchCard = ({ item, shimmerAnim }) => {
  const navigation = useNavigation();
  const shimmerX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-(CARD_WIDTH * 1.6), CARD_WIDTH * 1.6],
  });

  return (
          <View
        style={{
          width: CARD_WIDTH,
          marginRight: CARD_GAP,
        }}
      >

      {/* ══════════════════════════════════════════════════════════════════
          SHADOW SYSTEM — S1 + S2 + S3
      ══════════════════════════════════════════════════════════════════ */}

      {/* S1. Levitação: grande, difusa */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: CARD_RADIUS,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 22 },
          shadowOpacity: 0.55,
          shadowRadius: 44,
          elevation: 30,
          marginHorizontal: 10,
        }}
      />

      {/* S2. Contato: próxima, sharp */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: CARD_WIDTH * 0.82,
          height: CARD_HEIGHT,
          borderRadius: CARD_RADIUS,
          alignSelf: 'center',
          backgroundColor: 'transparent',
          shadowColor: '#040d1f',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.28,
          shadowRadius: 12,
          marginHorizontal: 10,
          left: CARD_WIDTH * 0.09,
        }}
      />

      {/* S3. Glow colorido inferior — acento premium */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: -8,
          left: CARD_WIDTH * 0.12 + 10,
          right: CARD_WIDTH * 0.12,
          height: 20,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
          'rgba(255,255,255,0.10)',
          'rgba(255,255,255,0.04)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>

      {/* ══════════════════════════════════════════════════════════════════
          GLASS BODY — overflow: hidden (clip do shimmer e conteúdo)
      ══════════════════════════════════════════════════════════════════ */}
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: CARD_RADIUS,
          overflow: 'hidden',
          marginHorizontal: 0,
        }}
      >

        {/* G1. BlurView primário — base fosca principal */}
        <BlurView
          intensity={10}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        {/* G2. BlurView secundário — camada de profundidade */}
        <BlurView
          intensity={28}
          tint="dark"
          style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
        />

        {/* G3. Tom base naval escuro — identidade premium */}
        <LinearGradient
        colors={[
          'rgba(255,255,255,0.06)',
          'rgba(255,255,255,0.03)',
          'rgba(255,255,255,0.05)',
        ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
        />

        {/* G4. Reflexo ambiental superior-esquerdo
            Fonte de luz de estúdio no canto — efeito visionOS/Apple */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.18)',
            'rgba(255, 255, 255, 0.07)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.70, y: 0.58 }}
        />

        {/* G5. Highlight de volume central */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.01)',
            'transparent',
          ]}
          style={[
            StyleSheet.absoluteFill,
            { top: CARD_HEIGHT * 0.15, bottom: CARD_HEIGHT * 0.15 },
          ]}
          start={{ x: 0.12, y: 0.5 }}
          end={{ x: 0.88, y: 0.5 }}
        />

        {/* G6. Vignette de profundidade inferior */}
        <LinearGradient
          colors={[
            'transparent',
            'transparent',
            'rgba(0, 5, 18, 0.05)',
            'rgba(0, 5, 18, 0.14)',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.42 }}
          end={{ x: 0.5, y: 1.0 }}
        />

        {/* G7. Overlay de textura metálica — micro-reflexo */}
        <LinearGradient
      colors={[
        'rgba(255,255,255,0.025)',
        'transparent',
        'rgba(255,255,255,0.015)',
      ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 1.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
        />

        {/* G8. Shimmer diagonal — varredura de luz premium */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -(CARD_HEIGHT * 0.5),
            bottom: -(CARD_HEIGHT * 0.5),
            width: CARD_WIDTH * 0.28,
            transform: [
              { translateX: shimmerX },
              { skewX: '-18deg' },
            ],
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.03)',
              'rgba(255, 255, 255, 0.13)',
              'rgba(255, 255, 255, 0.20)',
              'rgba(255, 255, 255, 0.13)',
              'rgba(255, 255, 255, 0.03)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>

        {/* ── G9. CONTEÚDO ─────────────────────────────────────────────── */}
        <View style={styles.content}>

          {/* ESQUERDA */}
          <View style={{ flex: 1 }}>
            <Text style={styles.smallTitle}>próximos jogos</Text>
            <Text style={styles.dateLabel}>Data:</Text>
            <Text style={styles.date}>{item.date}</Text>

            
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('Ingressos')}
            >
                <View style={styles.buttonGlass} />

                <LinearGradient
                  colors={['transparent', 'transparent']}
                  style={StyleSheet.absoluteFill}
                />

                <Text style={styles.buttonText}>
                    VER JOGO
                </Text>
            </TouchableOpacity>
            
          </View>

          {/* DIREITA — Match display */}
          <View style={styles.matchContainer}>

            <View style={styles.team}>
              {/* Halo do logo */}
              <View style={styles.logoHalo}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.12)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <Image source={item.logoA} style={styles.logo} />
              </View>
              <Text style={styles.teamName}>{item.teamA}</Text>
            </View>

            {/* VS separator */}
            <View style={styles.vsContainer}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
                style={styles.vsDividerLeft}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
              <Text style={styles.vs}>X</Text>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
                style={styles.vsDividerRight}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </View>

            <View style={styles.team}>
              <View style={styles.logoHalo}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.12)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <Image source={item.logoB} style={styles.logo} />
              </View>
              <Text style={styles.teamName}>{item.teamB}</Text>
            </View>

          </View>

        </View>
        {/* ── fim conteúdo ─────────────────────────────────────────────── */}

      </View>
      {/* ── fim glass body ─────────────────────────────────────────────── */}

      {/* ══════════════════════════════════════════════════════════════════
          SPECULAR LAYER (fora do clip)
      ══════════════════════════════════════════════════════════════════ */}

      {/* E1. Barra especular superior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: CARD_WIDTH * 0.09,
          right: CARD_WIDTH * 0.09,
          height: 1,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.52)',
            'rgba(255,255,255,0.88)',
            'rgba(255,255,255,0.92)',
            'rgba(255,255,255,0.88)',
            'rgba(255,255,255,0.52)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E2. Rim light esquerdo */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          top: CARD_HEIGHT * 0.14,
          width: 1,
          height: CARD_HEIGHT * 0.58,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.46)',
            'rgba(255,255,255,0.32)',
            'rgba(255,255,255,0.14)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* E3. Franja cromática azul — borda inferior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: CARD_WIDTH * 0.16,
          right: CARD_WIDTH * 0.16,
          height: 0.75,
          borderRadius: 0.75,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(140, 175, 255, 0.40)',
            'rgba(160, 195, 255, 0.55)',
            'rgba(140, 175, 255, 0.40)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E4. Franja cromática âmbar — borda superior-direita */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          right: CARD_WIDTH * 0.10,
          width: CARD_WIDTH * 0.26,
          height: 0.75,
          borderRadius: 0.75,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 225, 170, 0.28)',
            'rgba(255, 205, 130, 0.38)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E5. Anel externo */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: CARD_RADIUS,
          borderWidth: 0.75,
          borderColor: 'rgba(255, 255, 255, 0.22)',
        }}
      />

      {/* E6. Anel interno inset (espessura do vidro) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 1.5,
          left: 1.5,
          width: CARD_WIDTH - 3,
          height: CARD_HEIGHT - 3,
          borderRadius: CARD_RADIUS - 1.5,
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.10)',
        }}
      />

    </View>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function GlassCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  // Shimmer compartilhado entre todos os cards
  const shimmerAnim = useRef(new Value(0)).current;

  useEffect(() => {
    const anim = loop(
      sequence([
        delay(3800),
        timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const data = [
    {
      teamA: 'Drakos',
      teamB: 'Vasco',
      logoA: require('../../assets/img/img_home/img_jogos/Drakos HD.png'),
      logoB: require('../../assets/img/img_home/img_jogos/Vasco da Gama HD.png'),
      date: '27/09/2026',
      home: true,
    },
    {
      teamA: 'Drakos',
      teamB: 'Corinthians',
      logoA: require('../../assets/img/img_home/img_jogos/Drakos HD.png'),
      logoB: require('../../assets/img/img_home/img_jogos/Corinthians HD.png'),
      date: '02/10/2026',
      home: false,
    },
    {
      teamA: 'Drakos',
      teamB: 'Bahia',
      logoA: require('../../assets/img/img_home/img_jogos/Drakos HD.png'),
      logoB: require('../../assets/img/img_home/img_jogos/Bahia HD.png'),
      date: '10/10/2026',
      home: true,
    },
  ];

  const handleScroll = (e) => {
   const FULL_CARD_WIDTH = CARD_WIDTH + 18;

    const index = Math.round(
      e.nativeEvent.contentOffset.x / FULL_CARD_WIDTH
    );
    setActiveIndex(index);
  };

  const scrollRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        let nextIndex = prev + 1;
        if (nextIndex >= data.length) nextIndex = 0;
        scrollRef.current?.scrollTo({
          x: nextIndex * FULL_CARD_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ marginTop: 10 }}>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={FULL_CARD_WIDTH}
        decelerationRate="fast"
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        {data.map((item, index) => (
          <PremiumMatchCard
            key={index}
            item={item}
            shimmerAnim={shimmerAnim}
          />
        ))}
      </Animated.ScrollView>

      {/* ── Indicadores de página ─────────────────────────────────── */}
      <View style={styles.dots}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>

    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Conteúdo ───────────────────────────────────────────────────────────
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingRight: 16,
    zIndex: 10,
  },

  smallTitle: {
    color: 'rgba(255,255,255,0.50)',
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  dateLabel: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 11,
    marginTop: 12,
    letterSpacing: 0.5,
  },

  date: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // ── Botão glass premium ────────────────────────────────────────────────
  button: {
    marginTop: 14,
    width: 96,
    paddingVertical: 7,
    borderRadius: 12,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.20)',
  },

  buttonGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.30)',
  },

  buttonText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.8,
    zIndex: 2,
  },

  // ── Match display ──────────────────────────────────────────────────────
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  team: {
    alignItems: 'center',
    gap: 6,
  },

  logoHalo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  teamName: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 28,
  },

  vsDividerLeft: {
    width: 1,
    height: 18,
  },

  vsDividerRight: {
    width: 1,
    height: 18,
  },

  vs: {
    color: 'rgba(255,255,255,0.50)',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Indicadores ────────────────────────────────────────────────────────
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 5,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },

  dotActive: {
    width: 18,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },

});
