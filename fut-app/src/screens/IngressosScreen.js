/**
 * IngressosScreen — Liquid Glass Edition
 * ─────────────────────────────────────────────────────────────────────────
 * Redesign 100% visual sobre a tela original de ingressos.
 *
 * O QUE FOI PRESERVADO (zero alterações de lógica):
 *   - useState: selectedGame, quantities, modalVisible, successModalVisible
 *   - dadosJogos, decrease, increase, calculateTotal (mesmos imports/serviços)
 *   - handlePurchase (mesma regra: só abre modal de sucesso se total > 0)
 *   - onPress dos steppers (decrease/increase) chamando os mesmos handlers
 *   - Modal de seleção de jogo (mesmo array dadosJogos.map, mesmo setSelectedGame)
 *   - Modal de sucesso (mesmo successModalVisible)
 *
 * O QUE FOI ADICIONADO (puramente visual/UX, não quebra nada):
 *   - `activeCategory` — estado local só para destacar/filtrar visualmente os
 *     chips de categoria. Não interfere em quantities/calculateTotal.
 *   - FlatList → ScrollView + map: para permitir que os itens vivam dentro de
 *     UMA única superfície de vidro contínua (o pedido explícito era "não
 *     criar vários cartões"). Nenhum handler mudou, apenas o contêiner de lista.
 *
 * ARQUITETURA DE VIDRO (idêntica à do PremiumGlassCard/CardActionGlass):
 *   BlurView primário → BlurView secundário → tom base translúcido →
 *   reflexo ambiental superior → volume central → vignette inferior →
 *   barra especular superior → rim light lateral → anel de borda externo →
 *   anel de borda interno inset → shimmer diagonal periódico
 *
 * INTEGRAÇÃO PENDENTE:
 *   O componente <StadiumSeatExperience /> não estava presente no arquivo
 *   enviado. Deixei um container de vidro pronto (ver `StadiumGlassContainer`)
 *   já no lugar certo do layout — é só importar e renderizar dentro dele.
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dadosJogos } from '../data/dataIngresso';
import { decrease, increase, calculateTotal } from '../services/ingressosService/allIngressoService';

// Se você já tiver o componente real, descomente:
// import StadiumSeatExperience from '../components/StadiumSeatExperience';

const { width: SCREEN_W } = Dimensions.get('window');
const { Value, timing, spring, loop, sequence, delay: animDelay } = Animated;

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════
const DS = {
  bg: '#050607',
  overlay: 'rgba(4, 6, 10, 0.62)',
  crimson: '#c0000a',
  crimsonSoft: 'rgba(192, 0, 10, 0.35)',
  glassBorder: 'rgba(255, 255, 255, 0.30)',
  glassBorderInner: 'rgba(255, 255, 255, 0.16)',
  textPrimary: 'rgba(255, 255, 255, 0.96)',
  textSecondary: 'rgba(255, 255, 255, 0.62)',
  textTertiary: 'rgba(255, 255, 255, 0.40)',
};

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVO: GlassSurface
// Mesma arquitetura de camadas do PremiumGlassCard, porém de altura fluida
// (não fixa), para poder hospedar qualquer conteúdo — hero, painel de
// informações, lista de ingressos etc.
// ═══════════════════════════════════════════════════════════════════════════
function GlassSurface({
  children,
  style,
  borderRadius = 28,
  blurIntensity = 46,
  tint = 'dark',
  padding = 20,
  shimmerAnim,
  enableShimmer = true,
  shimmerWidth = 140,
}) {
  const shimmerX = shimmerAnim
    ? shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_W, SCREEN_W],
      })
    : new Value(0);

  return (
    // Container externo — SEM overflow: recebe sombra (regra iOS: overflow
    // hidden cancela shadow) e os elementos especulares que vazam pra fora.
    <View style={[{ borderRadius }, style]}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 14 },
          shadowOpacity: 0.38,
          shadowRadius: 26,
          elevation: 18,
        }}
      />

      {/* Corpo de vidro — overflow hidden aqui, clipando blur/shimmer */}
      <View style={{ borderRadius, overflow: 'hidden' }}>
        <BlurView intensity={blurIntensity} tint={tint} style={StyleSheet.absoluteFill} />
        <BlurView
          intensity={14}
          tint="light"
          style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
        />

        {/* Tom base translúcido — branco frio, neutro, sem calor */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.10)',
            'rgba(255,255,255,0.04)',
            'rgba(255,255,255,0.06)',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Reflexo ambiental superior-esquerdo */}
        <LinearGradient
          colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.03)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.7, y: 0.6 }}
        />

        {/* Volume central */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.05)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0.5 }}
          end={{ x: 0.9, y: 0.5 }}
        />

        {/* Vignette inferior */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.16)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* Shimmer diagonal periódico */}
        {enableShimmer && shimmerAnim && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -60, bottom: -60,
              width: shimmerWidth,
              transform: [{ translateX: shimmerX }, { skewX: '-16deg' }],
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.12)',
                'rgba(255,255,255,0.05)',
                'transparent',
              ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
        )}

        <View style={{ padding }}>{children}</View>
      </View>

      {/* Barra especular superior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 0,
          left: '10%', right: '10%',
          height: 1, borderRadius: 1, overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.55)',
            'rgba(255,255,255,0.85)',
            'rgba(255,255,255,0.55)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* Rim light lateral esquerda */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', left: 0, top: '12%',
          width: 1, height: '55%', overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.42)', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* Anel de borda externo */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          borderRadius, borderWidth: 0.75, borderColor: DS.glassBorder,
        }}
      />
      {/* Anel de borda interno inset */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 1.5, left: 1.5, right: 1.5, bottom: 1.5,
          borderRadius: borderRadius - 1.5,
          borderWidth: 0.5, borderColor: DS.glassBorderInner,
        }}
      />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVO: GlassBackButton — circular, blur, borda fina, reflexo superior
// ═══════════════════════════════════════════════════════════════════════════
function GlassBackButton({ onPress }) {
  const pressAnim = useRef(new Value(0)).current;
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => spring(pressAnim, { toValue: 1, tension: 420, friction: 28, useNativeDriver: true }).start()}
      onPressOut={() => spring(pressAnim, { toValue: 0, tension: 260, friction: 20, useNativeDriver: true }).start()}
    >
      <Animated.View style={{ width: 44, height: 44, borderRadius: 22, transform: [{ scale }] }}>
        {/* <View style={{ borderRadius: 22, overflow: 'hidden', width: 44, height: 44 }}>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} /> */}
          {/* <LinearGradient
            colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.04)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          /> */}
          {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="chevron-back" size={20} color={DS.textPrimary} />
          </View> */}
        {/* </View> */}
        <View
          // pointerEvents="none"
          // style={{
          //   position: 'absolute', top: 0, left: 8, right: 8, height: 1,
          //   backgroundColor: 'rgba(255,255,255,0.7)', opacity: 0.6,
          // }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 22, borderWidth: 0.75, borderColor: DS.glassBorder,
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVO: GlassChip — categorias (Premium, Arquibancada, VIP...)
// ═══════════════════════════════════════════════════════════════════════════
function GlassChip({ label, active, onPress }) {
  const pressAnim = useRef(new Value(0)).current;
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => spring(pressAnim, { toValue: 1, tension: 420, friction: 28, useNativeDriver: true }).start()}
      onPressOut={() => spring(pressAnim, { toValue: 0, tension: 260, friction: 20, useNativeDriver: true }).start()}
    >
      <Animated.View style={{ transform: [{ scale }], marginRight: 10 }}>
        <View style={{ borderRadius: 100, overflow: 'hidden' }}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          {active && (
            <LinearGradient
              colors={[DS.crimsonSoft, 'rgba(192,0,10,0.08)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <LinearGradient
            colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.02)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={{ paddingVertical: 10, paddingHorizontal: 18 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.3,
                color: active ? '#fff' : DS.textSecondary,
              }}
            >
              {label}
            </Text>
          </View>
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 100,
            borderWidth: 0.75,
            borderColor: active ? 'rgba(255,120,120,0.55)' : DS.glassBorder,
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVO: GlassCapsuleSelector — seletor de jogo (substitui o dropdown)
// ═══════════════════════════════════════════════════════════════════════════
function GlassCapsuleSelector({ label, onPress }) {
  const pressAnim = useRef(new Value(0)).current;
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.98] });

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => spring(pressAnim, { toValue: 1, tension: 420, friction: 28, useNativeDriver: true }).start()}
      onPressOut={() => spring(pressAnim, { toValue: 0, tension: 260, friction: 20, useNativeDriver: true }).start()}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={{ borderRadius: 100, overflow: 'hidden' }}>
          <BlurView intensity={46} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.03)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 16,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: DS.textPrimary, fontSize: 14, fontWeight: '500' }} numberOfLines={1}>
              {label}
            </Text>
            <Ionicons name="chevron-down" size={18} color={DS.textSecondary} />
          </View>
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, left: '12%', right: '12%',
            height: 1, backgroundColor: 'rgba(255,255,255,0.6)', opacity: 0.55,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 100, borderWidth: 0.75, borderColor: DS.glassBorder,
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVO: GlassBuyButton — cápsula, glow vermelho sutil, respiração, shimmer
// ═══════════════════════════════════════════════════════════════════════════
function GlassBuyButton({ label, onPress, breatheAnim, shimmerAnim }) {
  const pressAnim = useRef(new Value(0)).current;
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.965] });
  const glowOpacity = breatheAnim
    ? breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.38] })
    : 0.25;
  const shimmerX = shimmerAnim
    ? shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-260, 260] })
    : new Value(0);

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={() => spring(pressAnim, { toValue: 1, tension: 420, friction: 28, useNativeDriver: true }).start()}
      onPressOut={() => spring(pressAnim, { toValue: 0, tension: 260, friction: 20, useNativeDriver: true }).start()}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {/* Glow vermelho externo, muito sutil, respirando */}
        <Animated.View
          pointerEvents="none"
          style={{
            // position: 'absolute', top: -10, left: -10, right: -10, bottom: -10,
            // borderRadius: 100, backgroundColor: DS.crimson, opacity: glowOpacity,
            // shadowColor: DS.crimson, shadowOffset: { width: 0, height: 0 },
            // shadowOpacity: 0.1, shadowRadius: 20,
          }}
        />

        <View style={{ borderRadius: 100, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#9c0009', '#9c0009']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <BlurView intensity={12} tint="light" style={[StyleSheet.absoluteFill, { opacity: 0.18 }]} />

          {/* Highlight superior */}
          <LinearGradient
            colors={['rgba(255,255,255,0.30)', 'transparent']}
            style={[StyleSheet.absoluteFill, { height: '55%' }]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* Shimmer ocasional */}
          {shimmerAnim && (
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute', top: -20, bottom: -20, width: 60,
                transform: [{ translateX: shimmerX }, { skewX: '-16deg' }],
              }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.30)', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </Animated.View>
          )}

          <View style={{ paddingVertical: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.4 }}>
              {label}
            </Text>
          </View>
        </View>

        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 1.5, left: 1.5, right: 1.5, bottom: 1.5,
            borderRadius: 98, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)',
          }}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIMITIVO: Stepper glass (linha de ingresso dentro da superfície única)
// ═══════════════════════════════════════════════════════════════════════════
function GlassStepperButton({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View style={{ width: 30, height: 30, borderRadius: 15, overflow: 'hidden' }}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={15} color={DS.textPrimary} />
        </View>
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: 15, borderWidth: 0.75, borderColor: DS.glassBorder,
        }}
      />
    </TouchableOpacity>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TELA
// ═══════════════════════════════════════════════════════════════════════════
export default function IngressosScreen({ navigation }) {
  const navigationRef = useNavigation();

  // ── Offsets para posicionar o botão flutuante acima da Tab Bar ──────────
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const BUY_BUTTON_GAP = 20; // distância desejada acima da Tab Bar (16–24px)
  // tabBarHeight já soma a safe area inferior; usamos insets.bottom apenas
  // como piso de segurança caso a tela seja renderizada sem Tab Bar visível.
  const buyButtonBottomOffset = Math.max(tabBarHeight + BUY_BUTTON_GAP, insets.bottom + BUY_BUTTON_GAP);
  // Espaço extra no fim do scroll para o conteúdo não ficar escondido atrás do botão
  const scrollBottomPadding = buyButtonBottomOffset + 90;

  // ── Estado original — intocado ─────────────────────────────────────────
  const [selectedGame, setSelectedGame] = useState(dadosJogos[0]);
  const [quantities, setQuantities] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // ── Estado novo, só de UI (não afeta lógica de compra) ───────────────────
  const [activeCategory, setActiveCategory] = useState(null);

  // ── Animações compartilhadas (um único Value por efeito, reusado) ───────
  const entryAnim = useRef(new Value(0)).current;
  const shimmerAnim = useRef(new Value(0)).current;
  const breatheAnim = useRef(new Value(0)).current;

  useEffect(() => {
    timing(entryAnim, { toValue: 1, duration: 620, useNativeDriver: true }).start();

    const shimmerLoop = loop(
      sequence([
        animDelay(3800),
        timing(shimmerAnim, { toValue: 1, duration: 1300, useNativeDriver: true }),
        timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerLoop.start();

    const breatheLoop = loop(
      sequence([
        timing(breatheAnim, { toValue: 1, duration: 3000, useNativeDriver: true }),
        timing(breatheAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    );
    breatheLoop.start();

    return () => {
      shimmerLoop.stop();
      breatheLoop.stop();
    };
  }, []);

  const entryOpacity = entryAnim;
  const entryTranslateY = entryAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  // ── Handler original — intocado ──────────────────────────────────────────
  const handlePurchase = () => {
    const total = calculateTotal(selectedGame?.ingressos ?? [], quantities);
    if (total > 0) {
      setSuccessModalVisible(true);
    }
  };

  const ingressos = selectedGame?.ingressos ?? [];
  const categorias = [...new Set(ingressos.map((i) => i.nome))];
  const ingressosVisiveis = activeCategory
    ? ingressos.filter((i) => i.nome === activeCategory)
    : ingressos;

  return (
    <View style={{ flex: 1, backgroundColor: DS.bg }}>
      {/* ══════════════════════════════════════════════════════════════════
          FUNDO — foto do estádio + overlay escuro extremamente leve
          Troque a source pela sua imagem real do estádio.
      ══════════════════════════════════════════════════════════════════ */}
      <ImageBackground
        // source={require('../../assets/images/estadio-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: DS.overlay }]} />
      </ImageBackground>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: entryOpacity, transform: [{ translateY: entryTranslateY }] }}>
          {/* ════════════════════════════════════════════════════════════
              HEADER
          ════════════════════════════════════════════════════════════ */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 64,
              paddingBottom: 28,
            }}
          >
            <GlassBackButton onPress={() => navigationRef.goBack()} />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ color: DS.textPrimary, fontSize: 24, fontWeight: '700', letterSpacing: -0.3 }}>
                Ingressos
              </Text>
              <Text style={{ color: DS.textTertiary, fontSize: 13, marginTop: 2 }}>
                Partida principal
              </Text>
            </View>
          </View>

          {/* ════════════════════════════════════════════════════════════
              HERO CARD
          ════════════════════════════════════════════════════════════ */}
          <GlassSurface
            style={{ marginHorizontal: 16, marginBottom: 18 }}
            borderRadius={30}
            padding={24}
            shimmerAnim={shimmerAnim}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', width: 96 }}>
                <Image
                  source={selectedGame?.homeImg ? selectedGame.homeImg : { uri: 'https://placeholder.com/80' }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="contain"
                />
                <Text
                  style={{ color: DS.textSecondary, fontSize: 11, fontWeight: '600', marginTop: 10, letterSpacing: 0.4 }}
                  numberOfLines={1}
                >
                  {(selectedGame?.homeName ?? 'Mandante').toUpperCase()}
                </Text>
              </View>

              <Text style={{ color: DS.textTertiary, fontSize: 13, fontWeight: '600' }}>VS</Text>

              <View style={{ alignItems: 'center', width: 96 }}>
                <Image
                  source={selectedGame?.awayImg ? selectedGame.awayImg : { uri: 'https://placeholder.com/80' }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="contain"
                />
                <Text
                  style={{ color: DS.textSecondary, fontSize: 11, fontWeight: '600', marginTop: 10, letterSpacing: 0.4 }}
                  numberOfLines={1}
                >
                  {(selectedGame?.awayName ?? 'Visitante').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.10)', marginVertical: 22 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location-outline" size={15} color={DS.textTertiary} />
                <Text style={{ color: DS.textSecondary, fontSize: 12, marginLeft: 6 }} numberOfLines={1}>
                  {selectedGame?.local}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar-outline" size={15} color={DS.textTertiary} />
                <Text style={{ color: DS.textSecondary, fontSize: 12, marginLeft: 6 }}>
                  {selectedGame?.dia}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={15} color={DS.textTertiary} />
                <Text style={{ color: DS.textSecondary, fontSize: 12, marginLeft: 6 }}>
                  {selectedGame?.hora}
                </Text>
              </View>
            </View>
          </GlassSurface>

          {/* ════════════════════════════════════════════════════════════
              SELETOR DE JOGO
          ════════════════════════════════════════════════════════════ */}
          <View style={{ marginHorizontal: 16, marginBottom: 22 }}>
            <Text style={styles.sectionLabel}>ESCOLHA O JOGO</Text>
            <GlassCapsuleSelector
              label={selectedGame ? `${selectedGame.homeName}  ×  ${selectedGame.awayName}` : 'Escolha o jogo'}
              onPress={() => setModalVisible(true)}
            />
          </View>

          {/* ════════════════════════════════════════════════════════════
              CHIPS DE CATEGORIA
          ════════════════════════════════════════════════════════════ */}
          {categorias.length > 0 && (
            <View style={{ marginBottom: 22 }}>
              <Text style={[styles.sectionLabel, { marginLeft: 16 }]}>CATEGORIAS</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {categorias.map((cat) => (
                  <GlassChip
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onPress={() => setActiveCategory((prev) => (prev === cat ? null : cat))}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ════════════════════════════════════════════════════════════
              SELEÇÃO DE INGRESSO — UMA superfície de vidro contínua
          ════════════════════════════════════════════════════════════ */}
          <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>ESCOLHA O SEU INGRESSO</Text>
            <GlassSurface borderRadius={26} padding={6} shimmerAnim={shimmerAnim}>
              {ingressosVisiveis.map((item, index) => {
                const qtd = quantities[item.id] || 0;
                const isLast = index === ingressosVisiveis.length - 1;
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 16,
                      paddingHorizontal: 14,
                      borderBottomWidth: isLast ? 0 : 0.5,
                      borderBottomColor: 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={{ color: DS.textPrimary, fontSize: 14, fontWeight: '600' }}>
                        {item.nome}
                      </Text>
                      <Text style={{ color: DS.textTertiary, fontSize: 12, marginTop: 2 }}>
                        {item.lugar}
                      </Text>
                      <Text style={{ color: 'rgba(255,150,150,0.9)', fontSize: 13, fontWeight: '600', marginTop: 4 }}>
                        {item.valor}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <GlassStepperButton icon="remove" onPress={() => decrease(quantities, setQuantities, item.id)} />
                      <Text style={{ color: DS.textPrimary, fontSize: 15, fontWeight: '700', minWidth: 18, textAlign: 'center' }}>
                        {qtd}
                      </Text>
                      <GlassStepperButton icon="add" onPress={() => increase(quantities, setQuantities, item.id)} />
                    </View>
                  </View>
                );
              })}
            </GlassSurface>
          </View>

          {/* ════════════════════════════════════════════════════════════
              STADIUM SEAT EXPERIENCE — container glass premium
              Substitua o conteúdo interno pelo componente real:
              <StadiumSeatExperience ... />
          ════════════════════════════════════════════════════════════ */}
          <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>MAPA DO ESTÁDIO</Text>
            <GlassSurface borderRadius={26} padding={0} shimmerAnim={shimmerAnim}>
              {/*
                <StadiumSeatExperience
                  game={selectedGame}
                  quantities={quantities}
                  setQuantities={setQuantities}
                />
              */}
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Ionicons name="football-outline" size={22} color={DS.textTertiary} />
                <Text style={{ color: DS.textTertiary, fontSize: 12, marginTop: 10, textAlign: 'center' }}>
                  StadiumSeatExperience entra aqui{'\n'}(componente não incluso neste arquivo)
                </Text>
              </View>
            </GlassSurface>
          </View>

          {/* ════════════════════════════════════════════════════════════
              INFORMAÇÕES — uma única superfície glass
          ════════════════════════════════════════════════════════════ */}
          <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
            <GlassSurface borderRadius={26} padding={20} shimmerAnim={shimmerAnim}>
              <InfoRow icon="🎫" title="Entrada Digital" subtitle="QR Code liberado após confirmação." />
              <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 }} />
              <InfoRow icon="💳" title="Pagamento Seguro" subtitle="Compra protegida." />
              <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 }} />
              <InfoRow icon="⚡" title="Acesso Rápido" subtitle="Entrada imediata." isLast />
            </GlassSurface>
          </View>
        </Animated.View>
      </ScrollView>

      {/* ══════════════════════════════════════════════════════════════════
          BOTÃO COMPRAR — fixo no rodapé
      ══════════════════════════════════════════════════════════════════ */}
      <View
        style={{
          position: 'absolute', left: 0, right: 0,
          bottom: buyButtonBottomOffset,
          paddingHorizontal: 16,
        }}
      >
        <GlassBuyButton
          label={`COMPRAR INGRESSO — R$ ${calculateTotal(ingressos, quantities).toFixed(2).replace('.', ',')}`}
          onPress={handlePurchase}
          breatheAnim={breatheAnim}
          shimmerAnim={shimmerAnim}
        />
      </View>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL — SELEÇÃO DE JOGO (mesma lógica, visual em glass)
      ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={{ paddingHorizontal: 16, paddingBottom: 40 }}>
              <GlassSurface borderRadius={28} padding={20} enableShimmer={false}>
                <Text style={{ color: DS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 14 }}>
                  Selecionar Jogo
                </Text>
                {dadosJogos.map((jogo) => (
                  <TouchableOpacity
                    key={jogo.id}
                    style={{ paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.08)' }}
                    onPress={() => {
                      setSelectedGame(jogo);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={{ color: DS.textSecondary, fontSize: 14 }}>
                      {jogo.homeName} × {jogo.awayName}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={{ paddingTop: 16, alignItems: 'center' }} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: 'rgba(255,120,120,0.9)', fontSize: 14, fontWeight: '600' }}>Cancelar</Text>
                </TouchableOpacity>
              </GlassSurface>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL — COMPRA BEM-SUCEDIDA (mesma lógica, visual em glass)
      ══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={1}
          onPress={() => setSuccessModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={{ width: '80%' }}>
              <GlassSurface borderRadius={26} padding={26} enableShimmer={false}>
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="checkmark-circle" size={40} color="rgba(120,255,170,0.9)" />
                  <Text style={{ color: DS.textPrimary, fontSize: 17, fontWeight: '700', marginTop: 12 }}>
                    Sucesso!
                  </Text>
                  <Text style={{ color: DS.textSecondary, fontSize: 13, marginTop: 6, textAlign: 'center' }}>
                    Compra realizada com sucesso!
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 20, width: '100%' }}
                    onPress={() => setSuccessModalVisible(false)}
                  >
                    <View
                      style={{
                        borderRadius: 100, paddingVertical: 12, alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        borderWidth: 0.75, borderColor: DS.glassBorder,
                      }}
                    >
                      <Text style={{ color: DS.textPrimary, fontWeight: '600', fontSize: 14 }}>OK</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </GlassSurface>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function InfoRow({ icon, title, subtitle }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginRight: 14 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: DS.textPrimary, fontSize: 14, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: DS.textTertiary, fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: DS.textTertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 4,
  },
});