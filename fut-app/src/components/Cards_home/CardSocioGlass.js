/**
 * CardSocioGlass — Premium Liquid Glass Neutral Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Lógica original 100% preservada:
 *   – Props: onPress, flatLeft, flatRight, style
 *   – floatAnim  (flutuação da imagem, loop 2000ms, 0 → -5 → 0)
 *   – pressAnim  (scale spring, 1 → 0.96 → 1)
 *   – handlePressIn / handlePressOut
 *   – useEffect do loop flutuante
 *   – Imagem local: require('../../assets/img/card_branco.png')
 *   – Ícone: "people-outline"
 *   – Textos: "Seja Sócio" / "Tenha benefícios exclusivos"
 *   – flatLeftBorderFix / flatRightBorderFix mantidos
 *
 * Arquitetura de camadas — Liquid Glass Neutro (baixo → cima):
 *
 *  [Animated.View — outerContainer]
 *   Recebe: scale transform, flatLeft/flatRight, shadows premium
 *   Sem overflow:hidden → sombras renderizam corretamente no iOS.
 *
 *   [View — glassBody]  ← overflow:hidden (clip de blur + shimmer)
 *    G1. BlurView primário    (tint="light", intensity 52)
 *    G2. BlurView secundário  (tint="light", intensity 14, opacity 0.42)
 *    G3. Tom base do vidro    (branco frio, opacidade mínima)
 *    G4. Reflexo ambiental    (superior-esquerdo, estúdio de luz)
 *    G5. Volume central       (curvatura 3D ilusória)
 *    G6. Vignette inferior    (levíssima, espessura do material)
 *    G7. Shimmer diagonal     (Animated, varredura periódica)
 *    G8. Conteúdo original    (icon, image, title, desc, button)
 *
 *  [Camada Especular — fora do overflow:hidden]
 *   E1. Barra especular superior  (1px, gradiente branco)
 *   E2. Rim light esquerdo        (1px vertical, ocultado com flatLeft)
 *   E3. Franja cromática inferior (0.75px, azul-índigo sutil)
 *   E4. Franja âmbar superior-dir (0.75px, ocultada com flatRight)
 *   E5. Anel externo              (0.75px branco, adapta flat edges)
 *   E6. Anel interno inset        (0.5px branco recuado, espessura do vidro)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { Value, timing, loop, sequence, delay } = Animated;

export default function CardSocioGlass({ onPress, flatLeft, flatRight, style }) {

  // ── Lógica original — intacta ─────────────────────────────────────────────

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

  // ── fim lógica original ───────────────────────────────────────────────────

  // ── Shimmer (visual only — não altera nenhuma lógica existente) ──────────
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
        Recebe scale transform e flat-edge styles.
        Sem overflow:hidden → sombras iOS funcionam + camadas especulares visíveis.
      */}
      <Animated.View
        style={[
          styles.outerContainer,
          flatLeft  && styles.flatLeft,
          flatRight && styles.flatRight,
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
            flatLeft  && styles.flatLeft,
            flatRight && styles.flatRight,
          ]}
        >

          {/* G1: BlurView primário — translúcido neutro */}
          <BlurView
            intensity={50}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* G2: BlurView secundário — profundidade, mínimo */}
          <BlurView
            intensity={0}
            tint="dark"
            style={[StyleSheet.absoluteFill, { opacity: 0.42 }]}
          />

          {/* G3: Tom base do vidro — branco-frio, opacidade mínima
              Neutro puro: sem amarelos, vermelhos ou acinzentados pesados.
              O fundo fica visível através do blur. */}
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.06)',
              'rgba(255,255,255,0.06)',
              'rgba(255,255,255,0.06)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* G4: Reflexo ambiental superior-esquerdo
              Fonte de luz de estúdio — efeito visionOS / Apple */}
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
              Centro levemente mais luminoso — curvatura 3D ilusória */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.01)',
              'transparent',
            ]}
            style={[StyleSheet.absoluteFill, { top: '16%', bottom: '16%' }]}
            start={{ x: 0.12, y: 0.5 }}
            end={{ x: 0.88, y: 0.5 }}
          />

          {/* G6: Vignette de profundidade inferior — levíssima
              Densidade mínima na base; reforça espessura do material
              sem escurecer nem criar coloração própria */}
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              'rgba(0, 8, 24, 0.016)',
              'rgba(0, 8, 24, 0.038)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.44 }}
            end={{ x: 0.5, y: 1.0 }}
          />

          {/* G7: Shimmer diagonal
              Faixa de luz percorrendo o card em diagonal periódica.
              Simula reflexo de ambiente em movimento sobre vidro real. */}
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
              name="people-outline"
              size={18}
              color="rgba(255,255,255,0.7)"
              style={{ marginBottom: 6 }}
            />

            {/* IMAGEM — floatAnim preservado, source preservado */}
            <Animated.Image
              source={require('../../assets/img/card_branco.png')}
              style={[
                styles.image,
                {
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            />

            {/* TEXTO — preservado */}
            <Text style={styles.title}>Seja Sócio</Text>
            <Text style={styles.desc}>
              Tenha benefícios exclusivos
            </Text>

            {/* BOTÃO — estrutura preservada, acabamento refinado */}
            <View style={styles.button}>
              <BlurView
                intensity={40}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={[
                  // 'rgba(255, 255, 255, 0.28)',
                  // 'rgba(255, 255, 255, 0.10)',
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
            Elementos especulares posicionados sobre o vidro, sem clipping.
            Simulam as superfícies físicas reais de um material óptico.
        ════════════════════════════════════════════════════════════════ */}

        {/* E1: Barra especular superior — a "linha diagnóstica" do vidro real
            Reflexo direto da fonte de luz na aresta superior.
            Presente mesmo em flatLeft/flatRight. */}
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

        {/* E2: Rim light esquerdo — iluminação de estúdio lateral
            Suprimido quando flatLeft está ativo (borda plana sem aresta). */}
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
            Azul-índigo extremamente sutil na aresta inferior.
            Imperceptível na maioria dos ângulos; textura de vidro óptico. */}
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

        {/* E4: Franja âmbar — borda superior-direita (refração de ondas longas)
            Suprimida quando flatRight está ativo. */}
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
                'rgba(255, 230, 180, 0.26)',
                'rgba(255, 210, 140, 0.36)',
                'transparent',
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
        )}

        {/* E5: Anel de borda externo (0.75px)
            Adapta os raios de canto para flatLeft e flatRight. */}
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius:             22,
            ...(flatLeft && {
              borderTopLeftRadius:    4,
              borderBottomLeftRadius: 4,
            }),
            ...(flatRight && {
              borderTopRightRadius:    4,
              borderBottomRightRadius: 4,
            }),
            borderWidth: 0.75,
            borderColor: 'rgba(255, 255, 255, 0.52)',
          }}
        />

        {/* E6: Anel interno inset (0.5px, recuado 1.5px)
            Segunda superfície do vidro — ilusão de espessura do material.
            Detalhe que separa o premium do comum. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top:    1.5,
            left:   1.5,
            right:  1.5,
            bottom: 1.5,
            borderRadius:             20.5,
            ...(flatLeft && {
              borderTopLeftRadius:    3,
              borderBottomLeftRadius: 3,
            }),
            ...(flatRight && {
              borderTopRightRadius:    3,
              borderBottomRightRadius: 3,
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

  // Container externo de transformação — sem overflow:hidden.
  // Sombras aqui renderizam corretamente no iOS (overflow as cancelaria).
  // Sombra: neutra, soft, premium — sem tonalidades quentes ou avermelhadas.
  outerContainer: {
    height:       250,
    borderRadius: 22,
    shadowColor:   '#182040',
    shadowOpacity: 0.15,
    shadowRadius:  28,
    shadowOffset:  { width: 0, height: 14 },
    elevation:     12,
  },

  // Corpo do vidro — overflow:hidden para clip do blur e shimmer.
  glassBody: {
    flex:            1,
    borderRadius:    22,
    overflow:        'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },

  // ── Conteúdo — preservado ─────────────────────────────────────────────
  content: {
    padding: 20,
    flex:    1,
  },

  image: {
    width:          '80%',
    height:         90,
    resizeMode:     'contain',
    alignSelf:      'center',
    marginVertical: 10,
    opacity:        0.90,
    marginTop:      10,
  },

  title: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '800',
  },

  desc: {
    color:     '#fff',
    fontSize:  11,
    opacity:   0.6,
    marginTop: 3,
  },

  // Botão glass — estrutura preservada
  button: {
    marginTop:      'auto',
    height:         26,
    borderRadius:   14,
    overflow:       'hidden',
    justifyContent: 'center',
    alignItems:     'center',
    width:          '60%',
    alignSelf:      'flex-start',
  },

  // Linha especular interna do botão — aresta superior do vidro
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
    color:         '#fff',
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 1,
  },

  // Glow style — preservado na definição (não renderizado, igual ao original)
  glow: {
    position:        'absolute',
    width:           110,
    height:          110,
    borderRadius:    80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    right:           10,
    top:             20,
  },

  // ── Flat edge styles — preservados ───────────────────────────────────
  flatLeft: {
    borderTopLeftRadius:    4,
    borderBottomLeftRadius: 4,
  },

  flatRight: {
    borderTopRightRadius:    4,
    borderBottomRightRadius: 4,
  },

  // Mantidos para compatibilidade retroativa
  flatLeftBorderFix: {
    borderLeftWidth: 0,
  },

  flatRightBorderFix: {
    borderRightWidth: 0,
  },

});
