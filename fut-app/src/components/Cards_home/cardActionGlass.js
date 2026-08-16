/**
 * CardActionGlass — Premium Liquid Glass Light Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Lógica original 100% preservada:
 *   – props: icon, title, desc, image, onPress, flatRight, flatLeft, style
 *   – floatAnim (flutuação da imagem, loop 2000ms)
 *   – pressAnim (scale spring onPressIn/Out)
 *   – handlePressIn / handlePressOut
 *   – useEffect do float loop
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
  Platform,
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

          {/* G1: BlurView primário — base translúcida leve.
              Android: BlurView usa fallback com backgroundColor sólido
              (sem compositor de blur real). Empilhar 2 BlurViews aqui
              somava duas camadas opacas e gerava o "quadrado" atrás
              do card. Mantemos 1 blur real no Android, com intensity
              alta para sustentar a leitura de vidro agora que o
              backgroundColor do glassBody é bem mais translúcido. */}
          <BlurView
            intensity={Platform.OS === 'android' ? 62 : 50}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* G2: BlurView secundário — camada de profundidade, muito sutil.
              No Android substituído por gradiente translúcido puro.
              Opacidade reduzida para deixar mais transparência passar. */}
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
              style={[StyleSheet.absoluteFill, { opacity: 0.42 }]}
            />
          )}

          {/* G3: Tom base do vidro — branco-frio, opacidade mínima
              O vidro Apple tem um tint frio discreto; aqui muito sutil
              para não esconder o fundo.
              Android: reduzido — o blur real (intensity 62) já sustenta
              a leitura de vidro; opacidade menor deixa mais transparência
              passar em vez de mascarar com uma camada sólida clara. */}
          <LinearGradient
            colors={
              Platform.OS === 'android'
                ? ['rgba(255,255,255,0.035)', 'rgba(255,255,255,0.018)', 'rgba(255,255,255,0.03)']
                : [
                    'rgba(255,255,255,0.06)',
                    'rgba(255,255,255,0.03)',
                    'rgba(255,255,255,0.05)',
                  ]
            }
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* G4: Reflexo ambiental superior-esquerdo
              Fonte de luz de estúdio no canto — efeito visionOS clássico.
              Android: reforçado sutilmente — sem blur real refratando
              luz, esta camada carrega mais peso na leitura de "vidro
              iluminado", mesmo tratamento aplicado nos demais cards. */}
          <LinearGradient
            colors={
              Platform.OS === 'android'
                ? ['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.08)', 'transparent']
                : ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.06)', 'transparent']
            }
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.65, y: 0.55 }}
          />

          {/* G5: Highlight de volume central
              Centro levemente mais luminoso — ilusão de curvatura 3D sutil.
              Android: reativado — estava morto (transparent→transparent)
              em ambas as plataformas; sem blur real, o card fica "chapado"
              sem essa curvatura simulada. iOS mantém o comportamento
              original (camada transparente/inerte, comentário preservado). */}
          <LinearGradient
            colors={
              Platform.OS === 'android'
                ? ['transparent', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)', 'transparent']
                : [
                    'transparent',
                    // 'rgba(255, 255, 255, 0.04)',
                    // 'rgba(255, 255, 255, 0.08)',
                    // 'rgba(255, 255, 255, 0.04)',
                    'transparent',
                  ]
            }
            style={[StyleSheet.absoluteFill, { top: '16%', bottom: '16%' }]}
            start={{ x: 0.12, y: 0.5 }}
            end={{ x: 0.88, y: 0.5 }}
          />

          {/* G6: Vignette de profundidade inferior — levíssima
              Densidade mínima na base; reforça espessura sem escurecer.
              Android: levemente mais forte, compensando a falta de
              refração real que o blur do iOS produz naturalmente. */}
          <LinearGradient
            colors={
              Platform.OS === 'android'
                ? ['transparent', 'transparent', 'rgba(0,5,18,0.08)', 'rgba(0,5,18,0.17)']
                : ['transparent', 'transparent', 'rgba(0,5,18,0.05)', 'rgba(0,5,18,0.14)']
            }
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.44 }}
            end={{ x: 0.5, y: 1.0 }}
          />

          {/* G7: Shimmer diagonal
              Faixa de luz percorrendo o card em diagonal — reflexo de
              ambiente se movendo. skewX cria o ângulo de incidência natural.
              Android: Animated.View com transform (translateX + skewX)
              usando useNativeDriver às vezes não respeita o
              overflow:'hidden' do pai corretamente no Android, deixando
              a faixa clara "vazar" como uma listra reta cruzando o card
              (mesmo bug identificado e corrigido nos demais cards da
              família). Envolvemos com um View de clip extra, com o
              mesmo borderRadius do glassBody, e reduzimos a extensão
              vertical/largura e a opacidade de pico da faixa no Android
              para minimizar o risco de vazamento e o aspecto "chapado"
              sobre um fundo agora mais translúcido. */}
          {Platform.OS === 'android' ? (
            <View
              pointerEvents="none"
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 22,
                overflow: 'hidden',
              }}
            >
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top:    -60,
                  bottom: -60,
                  width:  SCREEN_WIDTH * 0.22,
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
                    'rgba(255, 255, 255, 0.09)',
                    'rgba(255, 255, 255, 0.14)',
                    'rgba(255, 255, 255, 0.09)',
                    'rgba(255, 255, 255, 0.03)',
                    'transparent',
                  ]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
              </Animated.View>
            </View>
          ) : (
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
          )}

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
                intensity={Platform.OS === 'android' ? 55 : 15}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={[
                  'transparent',
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
            Reflexo direto da fonte de luz na aresta superior.
            Android: pico de opacidade levemente reforçado, compensando
            a ausência de refração real que o blur do iOS produz. */}
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
            colors={
              Platform.OS === 'android'
                ? [
                    'transparent',
                    'rgba(255, 255, 255, 0.60)',
                    'rgba(255, 255, 255, 0.92)',
                    'rgba(255, 255, 255, 0.96)',
                    'rgba(255, 255, 255, 0.92)',
                    'rgba(255, 255, 255, 0.60)',
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

        {/* E2: Rim light esquerdo — iluminação lateral de estúdio
            Visível apenas quando flatLeft não está ativo.
            Android: reforçado, mesmo tratamento do E1. */}
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
            Adapta os raios de canto para flatRight e flatLeft.
            Android: levemente reforçado — sem blur real, bordas finas
            "somem" mais facilmente contra o fundo agora mais translúcido. */}
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
            borderColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.58)' : 'rgba(255, 255, 255, 0.52)',
          }}
        />

        {/* E6: Anel interno inset (0.5px) — espessura do vidro
            Segunda borda recuada 1.5px: ilusão das duas superfícies do material.
            Detalhe que separa o premium do comum.
            Android: mesmo reforço do E5. */}
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
            borderColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.30)' : 'rgba(255, 255, 255, 0.22)',
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
  // Android: elevation com borderRadius e sem backgroundColor opaco pinta
  // um retângulo sólido atrás do card (bug de composição do Material
  // Design). Fix: backgroundColor 'transparent' explícito + elevation
  // reduzida, sombra suave (shadow*) carrega o efeito de profundidade.
  outerContainer: {
    height:       250,
    borderRadius: 22,
    backgroundColor: 'transparent',
    // Sombra premium: soft, difusa, neutral — levitação sem peso
    shadowColor:   '#182040',
    shadowOpacity: 0.16,
    shadowRadius:  28,
    shadowOffset:  { width: 0, height: 14 },
    elevation: Platform.OS === 'android' ? 6 : 12,
  },

  // Corpo do vidro — overflow:hidden para clip do blur e shimmer.
  // Mesmas dimensões do outerContainer via flex: 1.
  // Android: o bg sólido opaco anterior (#141418) evitava o bug do
  // "quadrado" mas também matava a sensação de vidro. A correção real
  // do bug é não empilhar 2 BlurViews (já resolvido em G1/G2) — aqui
  // usamos um fundo bem mais translúcido e deixamos o blur real
  // (intensity alta) e as camadas de luz sustentarem o efeito de vidro,
  // seguindo a mesma referência aplicada nos demais cards da família.
  glassBody: {
    flex:            1,
    borderRadius:    22,
    overflow:        'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(13,13,17,0.30)' : 'rgba(255,255,255,0.03)',
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