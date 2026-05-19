/**
 * PremiumGlassCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Um componente de vidro líquido de nível Apple/visionOS para React Native.
 *
 * Arquitetura de camadas (baixo → cima):
 *   0. Glow ambiente externo com respiro (Animated, fora dos limites)
 *   1. Sombra profunda dupla (difusa + próxima)
 *   2. Corpo de vidro (overflow: hidden — clip do shimmer)
 *      2a. BlurView primário (base fosca)
 *      2b. BlurView secundário (profundidade adicional)
 *      2c. Tom base do vidro (LinearGradient)
 *      2d. Reflexo ambiental superior-esquerdo
 *      2e. Volume central (highlight suave)
 *      2f. Fade de profundidade inferior
 *      2g. Varredura diagonal de shimmer (Animated, inclinado)
 *      2h. Flash de pressão (overlay branco Animated)
 *      2i. Conteúdo (children)
 *   3. Barra especular superior (1px, alta opacidade, fora do clip)
 *   4. Luz de borda esquerda (1px, fora do clip)
 *   5. Separação cromática sutil (borda inferior azul/âmbar — refração)
 *   6. Anel de borda externo (0.75px branco)
 *   7. Anel de borda interno inset (0.5px branco, recuado 1px)
 *
 * Props:
 *   children          – Conteúdo renderizado dentro do card
 *   style             – Estilos adicionais no container externo
 *   onPress           – Handler de toque
 *   width             – Largura do card (padrão: 340)
 *   height            – Altura do card (padrão: 220)
 *   borderRadius      – Raio dos cantos (padrão: 26)
 *   blurIntensity     – Intensidade do BlurView (padrão: 60)
 *   tint              – Tint do BlurView: 'light' | 'dark' | 'default' (padrão: 'light')
 *   enableShimmer     – Ativa varredura de shimmer periódica (padrão: true)
 *   enableBreathing   – Ativa glow de respiro suave (padrão: true)
 *   enableFloat       – Ativa flutuação vertical lenta (padrão: false)
 *   glowColor         – Cor do glow ambiente (padrão: branco frio)
 *   shimmerDelay      – Delay entre varreduras em ms (padrão: 4000)
 *   contentPadding    – Padding interno do conteúdo (padrão: 24)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Easing curves ────────────────────────────────────────────────────────────
// Apple usa curvas de aceleração específicas — "ease in out" suave para respiro,
// "spring" para interações táteis.
const { Value, timing, spring, loop, sequence, delay, parallel } = Animated;

// ─── Componente ───────────────────────────────────────────────────────────────
const PremiumGlassCard = ({
  children,
  style,
  onPress,
  width = 340,
  height = 220,
  borderRadius = 26,
  blurIntensity = 60,
  tint = 'light',
  enableShimmer = true,
  enableBreathing = true,
  enableFloat = false,
  glowColor = 'rgba(220, 232, 255, 1)',
  shimmerDelay = 4000,
  contentPadding = 24,
}) => {

  // ── Valores de animação ──────────────────────────────────────────────────
  const pressAnim   = useRef(new Value(0)).current; // 0 = repouso, 1 = pressionado
  const shimmerAnim = useRef(new Value(0)).current; // 0 = antes, 1 = depois da varredura
  const breatheAnim = useRef(new Value(0)).current; // 0→1→0 loop de respiro
  const floatAnim   = useRef(new Value(0)).current; // 0→1→0 loop de flutuação

  // ── Shimmer: varredura diagonal periódica ────────────────────────────────
  useEffect(() => {
    if (!enableShimmer) return;
    const anim = loop(
      sequence([
        delay(shimmerDelay),
        timing(shimmerAnim, {
          toValue: 1,
          duration: 1400,
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
  }, [enableShimmer, shimmerDelay]);

  // ── Glow de respiro ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!enableBreathing) return;
    const anim = loop(
      sequence([
        timing(breatheAnim, {
          toValue: 1,
          duration: 3200,
          useNativeDriver: true,
        }),
        timing(breatheAnim, {
          toValue: 0,
          duration: 3200,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [enableBreathing]);

  // ── Flutuação vertical ───────────────────────────────────────────────────
  useEffect(() => {
    if (!enableFloat) return;
    const anim = loop(
      sequence([
        timing(floatAnim, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        timing(floatAnim, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [enableFloat]);

  // ── Handlers de pressão com spring physics ───────────────────────────────
  const handlePressIn = useCallback(() => {
    spring(pressAnim, {
      toValue: 1,
      tension: 420,
      friction: 28,
      useNativeDriver: true,
    }).start();
  }, [pressAnim]);

  const handlePressOut = useCallback(() => {
    spring(pressAnim, {
      toValue: 0,
      tension: 260,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [pressAnim]);

  // ── Valores derivados ─────────────────────────────────────────────────────

  // Escala de pressão: leve encolhimento físico
  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.964],
  });

  // Flutuação Y
  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  // Shimmer: translação diagonal através do card
  // Vai de -largura*1.5 (esquerda, fora) até +largura*1.5 (direita, fora)
  const shimmerX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.5, width * 1.5],
  });

  // Glow de respiro: opacidade do halo externo
  const breatheOpacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.20],
  });

  // Flash de pressão: clarão branco momentâneo (tipo apertar botão físico)
  const pressFlashOpacity = pressAnim.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0.07, 0.03],
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessible={false}
    >
      {/* Container de transformação (scale + float) */}
      <Animated.View
        style={[
          { width, height },
          style,
          {
            transform: [
              { scale },
              { translateY: enableFloat ? floatY : 0 },
            ],
          },
        ]}
      >

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 0 — Glow ambiente externo com respiro
            Halo de luz que pulsa suavemente, simulando a emissão de luz
            do vidro. Fica fora dos limites do card para "vazar" ao redor.
        ════════════════════════════════════════════════════════════════ */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -24,
            left: -24,
            width: width + 48,
            height: height + 48,
            borderRadius: borderRadius + 24,
            overflow: 'hidden',
            opacity: breatheOpacity,
          }}
        >
          <LinearGradient
            colors={[
              glowColor,
              'rgba(210, 225, 255, 0.55)',
              'rgba(200, 218, 255, 0.15)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
          />
        </Animated.View>

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 1 — Sombras duplas
            Apple usa dois layers de sombra:
              a) Grande e difusa (profundidade de levitação)
              b) Próxima e dura (contato com a superfície)
        ════════════════════════════════════════════════════════════════ */}
        {/* 1a. Sombra profunda/difusa */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width,
            height,
            borderRadius,
            backgroundColor: 'transparent',
            shadowColor: '#0a1628',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.24,
            shadowRadius: 40,
            elevation: 28,
          }}
        />
        {/* 1b. Sombra de contato (próxima, mais escura) */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: width * 0.88,
            height: height,
            alignSelf: 'center',
            borderRadius,
            backgroundColor: 'transparent',
            shadowColor: '#06101e',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
          }}
        />

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 2 — Corpo de vidro (overflow: hidden para clicar shimmer)
        ════════════════════════════════════════════════════════════════ */}
        <View
          style={{
            position: 'absolute',
            width,
            height,
            borderRadius,
            overflow: 'hidden',
          }}
        >
          {/* 2a. BlurView primário — base fosca principal */}
          <BlurView
            intensity={blurIntensity}
            tint={tint}
            style={StyleSheet.absoluteFill}
          />

          {/* 2b. BlurView secundário — camada de profundidade adicional
              Menor intensidade, cria a ilusão de vidro com espessura */}
          <BlurView
            intensity={18}
            tint="light"
            style={[
              StyleSheet.absoluteFill,
              { opacity: 0.6 },
            ]}
          />

          {/* 2c. Tom base do material de vidro
              O vidro da Apple tem um leve tint azul-branco frio */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.32)',
              'rgba(248, 251, 255, 0.14)',
              'rgba(245, 249, 255, 0.20)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* 2d. Reflexo ambiental superior-esquerdo
              Simula uma fonte de luz no canto superior esquerdo do ambiente,
              como iluminação de escritório/sala — efeito visionOS clássico */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.22)',
              'rgba(255, 255, 255, 0.08)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.65, y: 0.55 }}
          />

          {/* 2e. Highlight de volume central
              O centro do vidro aparece ligeiramente mais brilhante,
              dando a ilusão de curvatura (como um objeto 3D arredondado) */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.06)',
              'rgba(255, 255, 255, 0.10)',
              'rgba(255, 255, 255, 0.06)',
              'transparent',
            ]}
            style={[
              StyleSheet.absoluteFill,
              { top: height * 0.15, bottom: height * 0.15 },
            ]}
            start={{ x: 0.15, y: 0.5 }}
            end={{ x: 0.85, y: 0.5 }}
          />

          {/* 2f. Fade de profundidade inferior
              A parte inferior do vidro é levemente mais escura/densa,
              reforçando a sensação de material com espessura */}
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              'rgba(0, 8, 20, 0.035)',
              'rgba(0, 8, 20, 0.08)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.45 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* 2g. Varredura diagonal de shimmer
              Faixa de luz que percorre o card diagonalmente — simulando
              reflexo de luz ambiente se movendo. Skew cria o ângulo natural. */}
          {enableShimmer && (
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -height * 0.5,
                bottom: -height * 0.5,
                width: width * 0.32,
                transform: [
                  { translateX: shimmerX },
                  { skewX: '-18deg' },
                ],
              }}
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255, 255, 255, 0.05)',
                  'rgba(255, 255, 255, 0.16)',
                  'rgba(255, 255, 255, 0.22)',
                  'rgba(255, 255, 255, 0.16)',
                  'rgba(255, 255, 255, 0.05)',
                  'transparent',
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </Animated.View>
          )}

          {/* 2h. Flash de pressão
              Ao pressionar, um breve clarão branco emanado do centro —
              simula o reflexo de luz ao deformar fisicamente o material */}
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: pressFlashOpacity },
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.90)',
                'rgba(255,255,255,0.60)',
                'rgba(255,255,255,0.20)',
              ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.3, y: 0.1 }}
              end={{ x: 0.7, y: 0.9 }}
            />
          </Animated.View>

          {/* 2i. Conteúdo dos children */}
          <View
            style={{
              flex: 1,
              padding: contentPadding,
            }}
          >
            {children}
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 3 — Barra especular superior (highlight de borda)
            A linha mais brilhante do vidro — onde a luz incide diretamente
            na aresta superior. Esta é a linha "diagnóstica" de qualidade:
            um vidro real sempre tem esse reflexo sharp na aresta.
        ════════════════════════════════════════════════════════════════ */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: width * 0.10,
            right: width * 0.10,
            height: 1,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.65)',
              'rgba(255, 255, 255, 0.92)',
              'rgba(255, 255, 255, 0.95)',
              'rgba(255, 255, 255, 0.92)',
              'rgba(255, 255, 255, 0.65)',
              'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 4 — Luz de borda esquerda (rim light)
            Simula iluminação de rim lateral — como numa foto de produto
            da Apple com luz de estúdio à esquerda.
        ════════════════════════════════════════════════════════════════ */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: height * 0.14,
            width: 1,
            height: height * 0.58,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.52)',
              'rgba(255, 255, 255, 0.38)',
              'rgba(255, 255, 255, 0.18)',
              'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 5 — Separação cromática de refração (detalhe sutil)
            No mundo real, o vidro refrata comprimentos de onda diferentes.
            Uma linha muito sutil azul-índigo na borda inferior e
            uma linha âmbar quente na borda superior direita mimetizam isso.
            Em 99% dos ângulos não é visível — mas a textura é palpável.
        ════════════════════════════════════════════════════════════════ */}
        {/* Borda inferior — franja azul (refração de ondas curtas) */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left: width * 0.18,
            right: width * 0.18,
            height: 0.75,
            borderRadius: 0.75,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(160, 185, 255, 0.35)',
              'rgba(180, 200, 255, 0.50)',
              'rgba(160, 185, 255, 0.35)',
              'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>
        {/* Borda superior direita — franja âmbar (refração de ondas longas) */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            right: width * 0.12,
            width: width * 0.28,
            height: 0.75,
            borderRadius: 0.75,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 230, 180, 0.30)',
              'rgba(255, 210, 140, 0.40)',
              'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 6 — Anel de borda externo
            0.75px de branco semi-transparente. Define o "envelope" do vidro.
        ════════════════════════════════════════════════════════════════ */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width,
            height,
            borderRadius,
            borderWidth: 0.75,
            borderColor: 'rgba(255, 255, 255, 0.48)',
          }}
        />

        {/* ════════════════════════════════════════════════════════════════
            CAMADA 7 — Anel de borda interno (inset 1px)
            Uma segunda borda recuada 1px cria a ilusão de espessura do vidro —
            como se você estivesse vendo as duas superfícies (frente e fundo)
            do material. Detalhe que separa o premium do comum.
        ════════════════════════════════════════════════════════════════ */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 1.5,
            left: 1.5,
            width: width - 3,
            height: height - 3,
            borderRadius: borderRadius - 1.5,
            borderWidth: 0.5,
            borderColor: 'rgba(255, 255, 255, 0.22)',
          }}
        />

      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default PremiumGlassCard;


// ─────────────────────────────────────────────────────────────────────────────
// USO / EXEMPLO
// ─────────────────────────────────────────────────────────────────────────────
//
//  import PremiumGlassCard from './PremiumGlassCard';
//  import { View, Text, StyleSheet } from 'react-native';
//  import { LinearGradient } from 'expo-linear-gradient';
//
//  export default function App() {
//    return (
//      <LinearGradient
//        colors={['#c8d8f0', '#dce8f8', '#e8f0f8']}
//        style={styles.bg}
//      >
//        <PremiumGlassCard
//          width={340}
//          height={220}
//          blurIntensity={60}
//          tint="light"
//          enableShimmer={true}
//          enableBreathing={true}
//          enableFloat={false}
//          onPress={() => console.log('pressed')}
//        >
//          <Text style={styles.title}>Balance</Text>
//          <Text style={styles.value}>$12,480.00</Text>
//          <Text style={styles.sub}>+2.4% this month</Text>
//        </PremiumGlassCard>
//      </LinearGradient>
//    );
//  }
//
//  const styles = StyleSheet.create({
//    bg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//    title: {
//      fontFamily: 'SF Pro Display',  // ou sua fonte customizada
//      fontSize: 14,
//      fontWeight: '500',
//      color: 'rgba(0,0,0,0.45)',
//      letterSpacing: 0.4,
//    },
//    value: {
//      fontFamily: 'SF Pro Display',
//      fontSize: 36,
//      fontWeight: '300',
//      color: 'rgba(0,0,0,0.82)',
//      marginTop: 8,
//      letterSpacing: -0.5,
//    },
//    sub: {
//      fontFamily: 'SF Pro Text',
//      fontSize: 13,
//      color: 'rgba(52,199,89,0.9)',   // verde sistema Apple
//      marginTop: 4,
//    },
//  });
//
// ─────────────────────────────────────────────────────────────────────────────
// DICA DE BACKGROUND:
//   O vidro líquido depende MUITO do fundo. Use sempre:
//     - Gradientes suaves azul-cinza (como visionOS)
//     - Fotos desfocadas (backgroundImage + blur)
//     - Evite fundos brancos puros ou pretos puros
// ─────────────────────────────────────────────────────────────────────────────
