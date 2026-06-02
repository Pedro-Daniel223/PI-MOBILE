/**
 * CardActionGlass — Premium Liquid Glass Light Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Lógica original 100% preservada:
 *   – props: icon, title, desc, image, onPress, flatRight, flatLeft, style
 *   – floatAnim (flutuação da imagem, loop 2000ms)
 *   – pressAnim (scale spring onPressIn/Out)
 *   – handlePressIn / handlePressOut
 *   – useEffect do float loop
 *
 * Arquitetura de camadas — iOS 26 Liquid Glass Light (baixo → cima):
 *
 *  [Animated.View — outerContainer]
 *   Recebe: scale transform, style prop, flatRight/flatLeft, shadows
 *   Sem overflow:hidden — ancora as camadas especulares externas.
 *
 *   [View — glassBody]  ← overflow:hidden (clip de blur + shimmer)
 *    G1. BlurView primário    (tint="light", intensity 52)
 *    G2. BlurView secundário  (tint="light", intensity 14, opacity 0.42)
 *    G3. Tom base do vidro    (branco-frio, muito sutil)
 *    G4. Reflexo ambiental    (superior-esquerdo)
 *    G5. Volume central       (curvatura 3D ilusória)
 *    G6. Vignette inferior    (espessura de material, levíssima)
 *    G7. Shimmer diagonal     (Animated, varredura periódica)
 *    G8. Conteúdo original    (icon, glow, image, title, desc, button)
 *
 *  [Camada Especular — fora do clip]
 *   E1. Barra especular superior  (1px, gradiente branco)
 *   E2. Rim light esquerdo        (1px vertical, gradiente branco)
 *   E3. Franja cromática inferior (0.75px, azul-índigo sutil)
 *   E4. Franja âmbar superior-dir (0.75px, âmbar sutil)
 *   E5. Anel externo              (0.75px branco, adapta flatRight/flatLeft)
 *   E6. Anel interno inset        (0.5px branco recuado, espessura do vidro)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { Value, timing, loop, sequence, delay } = Animated;

export default function CardActionGlass({
  icon,
  title,
  desc,
  image,
  onPress,
  flatRight, // ✅ preservado
  flatLeft,  // ✅ preservado
  style,     // ✅ preservado
}) {

  // ── Lógica original — intacta ─────────────────────────────────────────────
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

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
  // ── fim lógica original ───────────────────────────────────────────────────

  // ── Shimmer (visual only — não interfere na lógica existente) ────────────
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
    outputRange: [-(SCREEN_WIDTH * 1.2), SCREEN_WIDTH * 1.2],
  });
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >

      {/*
        outerContainer — Animated.View
        Recebe a transformação de escala (pressAnim), style prop e flat styles.
        Sem overflow:hidden → sombras renderizam corretamente no iOS e as
        camadas especulares (E1–E6) ficam visíveis além da borda do vidro.
      */}
      <Animated.View
        style={[
          styles.outerContainer,
          style,
          flatRight && styles.flatRight,
          flatLeft  && styles.flatLeft,
          { transform: [{ scale: pressAnim }] },
        ]}
      >

        {/* ════════════════════════════════════════════════════════════════
            CORPO DE VIDRO — overflow:hidden
            Clip necessário para conter BlurViews e varredura de shimmer.
        ════════════════════════════════════════════════════════════════ */}
        <View
          style={[
            styles.glassBody,
            flatRight && styles.flatRight,
            flatLeft  && styles.flatLeft,
          ]}
        >

          {/* G1: BlurView primário — base translúcida leve */}
          <BlurView
            intensity={50}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* G2: BlurView secundário — camada de profundidade, muito sutil */}
          <BlurView
            intensity={0}
            tint="dark"
            style={[StyleSheet.absoluteFill, { opacity: 0.42 }]}
          />

          {/* G3: Tom base do vidro — branco-frio, opacidade mínima
              O vidro Apple tem um tint frio discreto; aqui muito sutil
              para não esconder o fundo */}
          <LinearGradient
          colors={[
            'rgba(255,255,255,0.06)',
            'rgba(255,255,255,0.03)',
            'rgba(255,255,255,0.05)',
          ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* G4: Reflexo ambiental superior-esquerdo
              Fonte de luz de estúdio no canto — efeito visionOS clássico */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.18)',
              'rgba(255, 255, 255, 0.06)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.65, y: 0.55 }}
          />

          {/* G5: Highlight de volume central
              Centro levemente mais luminoso — ilusão de curvatura 3D sutil */}
          <LinearGradient
            colors={[
              'transparent',
              // 'rgba(255, 255, 255, 0.04)',
              // 'rgba(255, 255, 255, 0.08)',
              // 'rgba(255, 255, 255, 0.04)',
              'transparent',
            ]}
            style={[StyleSheet.absoluteFill, { top: '16%', bottom: '16%' }]}
            start={{ x: 0.12, y: 0.5 }}
            end={{ x: 0.88, y: 0.5 }}
          />

          {/* G6: Vignette de profundidade inferior — levíssima
              Densidade mínima na base; reforça espessura sem escurecer */}
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              'rgba(0,5,18,0.05)',
              'rgba(0,5,18,0.14)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.44 }}
            end={{ x: 0.5, y: 1.0 }}
          />

          {/* G7: Shimmer diagonal
              Faixa de luz percorrendo o card em diagonal — reflexo de
              ambiente se movendo. skewX cria o ângulo de incidência natural. */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top:    -125,
              bottom: -125,
              width:  SCREEN_WIDTH * 0.30,
              transform: [
                { translateX: shimmerX },
                { skewX: '-18deg' },
              ],
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.04)',
                'rgba(255, 255, 255, 0.14)',
                'rgba(255, 255, 255, 0.22)',
                'rgba(255, 255, 255, 0.14)',
                'rgba(255, 255, 255, 0.04)',
                'transparent',
              ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>

          {/* ── G8: CONTEÚDO — preservado integralmente ──────────────── */}
          <View style={styles.content}>

            {/* ÍCONE — preservado */}
            <Ionicons
              name={icon}
              size={18}
              color="rgba(255,255,255,0.7)"
              style={{ marginBottom: 6 }}
            />

            {/* GLOW atrás da imagem — preservado */}
            <View style={styles.glow} />

            {/* IMAGEM ANIMADA — floatAnim + scale preservados */}
            <Animated.Image
              source={image}
              style={[
                styles.image,
                {
                  transform: [
                    { translateY: floatAnim },
                    { scale: 1.05 },
                  ],
                },
              ]}
            />

            {/* TEXTO — preservado */}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{desc}</Text>

            {/* BOTÃO GLASS — estrutura preservada, acabamento refinado */}
            <View style={styles.button}>
              <BlurView
                intensity={15}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={[
                  'transparent',
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />

              {/* Linha especular interna — aresta superior do botão */}
              <View style={styles.buttonSpecular} />

              <View style={styles.buttonBorder} />

              <Text style={styles.buttonText}>VER</Text>
            </View>

          </View>
          {/* ── fim conteúdo ──────────────────────────────────────────── */}

        </View>
        {/* ── fim glassBody ─────────────────────────────────────────── */}

        {/* ════════════════════════════════════════════════════════════════
            CAMADA ESPECULAR — fora do overflow:hidden
            Renderizadas sobre o vidro, sem serem recortadas pelo clip.
            Simulam as superfícies físicas reais do material de vidro.
        ════════════════════════════════════════════════════════════════ */}

        {/* E1: Barra especular superior — a "linha diagnóstica" do vidro real
            Reflexo direto da fonte de luz na aresta superior. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top:   0,
            left:  '10%',
            right: '10%',
            height: 1,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
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

        {/* E2: Rim light esquerdo — iluminação lateral de estúdio
            Visível apenas quando flatLeft não está ativo. */}
        {!flatLeft && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left:   0,
              top:    '12%',
              width:  1,
              height: '60%',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
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
        )}

        {/* E3: Franja cromática inferior — refração de ondas curtas
            Azul-índigo sutil na aresta inferior; imperceptível mas texturalmente
            presente — detalhe que lembra vidroóptico real. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left:   '16%',
            right:  '16%',
            height: 0.75,
            borderRadius: 0.75,
            overflow: 'hidden',
          }}
        >
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
        {!flatRight && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top:   0,
              right: '12%',
              width: '28%',
              height: 0.75,
              borderRadius: 0.75,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                // 'rgba(255, 230, 180, 0.26)',
                // 'rgba(255, 210, 140, 0.36)',
                'transparent',
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
        )}

        {/* E5: Anel de borda externo (0.75px) — envelope do vidro
            Adapta os raios de canto para flatRight e flatLeft. */}
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius:              22,
            ...(flatRight && {
              borderTopRightRadius:    4,
              borderBottomRightRadius: 4,
            }),
            ...(flatLeft && {
              borderTopLeftRadius:     4,
              borderBottomLeftRadius:  4,
            }),
            borderWidth: 0.75,
            borderColor: 'rgba(255, 255, 255, 0.52)',
          }}
        />

        {/* E6: Anel interno inset (0.5px) — espessura do vidro
            Segunda borda recuada 1.5px: ilusão das duas superfícies do material.
            Detalhe que separa o premium do comum. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top:    1.5,
            left:   1.5,
            right:  1.5,
            bottom: 1.5,
            borderRadius:              20.5,
            ...(flatRight && {
              borderTopRightRadius:    3,
              borderBottomRightRadius: 3,
            }),
            ...(flatLeft && {
              borderTopLeftRadius:     3,
              borderBottomLeftRadius:  3,
            }),
            borderWidth: 0.5,
            borderColor: 'rgba(255, 255, 255, 0.22)',
          }}
        />

      </Animated.View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Container de transformação — sem overflow:hidden.
  // Sombras aqui funcionam corretamente no iOS (overflow:hidden as cancelaria).
  outerContainer: {
    height:       250,
    borderRadius: 22,
    // Sombra premium: soft, difusa, neutral — levitação sem peso
    shadowColor:   '#182040',
    shadowOpacity: 0.16,
    shadowRadius:  28,
    shadowOffset:  { width: 0, height: 14 },
    elevation:     12,
  },

  // Corpo do vidro — overflow:hidden para clip do blur e shimmer.
  // Mesmas dimensões do outerContainer via flex: 1.
  glassBody: {
    flex:            1,
    borderRadius:    22,
    overflow:        'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  // ── Conteúdo — preservado ─────────────────────────────────────────────
  content: {
    padding: 20,
    flex:    1,
  },

  image: {
    width:         '100%',
    height:        90,
    resizeMode:    'contain',
    alignSelf:     'center',
    marginVertical: 10,
    opacity:       0.95,
  },

  title: {
    color:      '#fff',
    fontSize:   17,
    fontWeight: '800',
    marginTop:  6,
  },

  desc: {
    color:     '#fff',
    fontSize:  11,
    opacity:   0.6,
    marginTop: 3,
  },

  // Botão glass — estrutura preservada
  button: {
    marginTop:     'auto',
    height:        26,
    borderRadius:  14,
    overflow:      'hidden',
    justifyContent: 'center',
    alignItems:    'center',
    width:         '55%',
    alignSelf:     'flex-start',
  },

  // Linha especular interna do botão — aresta superior de vidro
  buttonSpecular: {
    position:        'absolute',
    top:             0,
    left:            '12%',
    right:           '12%',
    height:          0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius:    0.5,
  },

  buttonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth:  0.75,
    borderColor:  'rgba(255, 255, 255, 0.38)',
  },

  buttonText: {
    color:       '#fff',
    fontSize:    12,
    fontWeight:  '700',
    letterSpacing: 1,
  },

  // Glow atrás da imagem — preservado
  glow: {
    position:        'absolute',
    width:           110,
    height:          110,
    borderRadius:    90,
    backgroundColor: 'rgba(255,255,255,0.02)',
    top:             45,
    alignSelf:       'center',
  },

  // ── Flat border styles — preservados ────────────────────────────────
  flatRight: {
    borderTopRightRadius:    4,
    borderBottomRightRadius: 4,
  },

  flatLeft: {
    borderTopLeftRadius:    4,
    borderBottomLeftRadius: 4,
  },

  // Mantido para compatibilidade retroativa
  flatRightBorderFix: {
    borderRightWidth: 0,
  },

});
