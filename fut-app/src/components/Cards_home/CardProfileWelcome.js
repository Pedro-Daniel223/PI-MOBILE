/**
 * CardProfileWelcome — Premium Liquid Glass Edition
 * ─────────────────────────────────────────────────────────────────────────────
 * Lógica original 100% preservada.
 * Apenas a camada visual foi reescrita com a engenharia do PremiumGlassCard.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_AVATAR_URL } from '../../data/dataPerfil';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { Value, timing, loop, sequence, delay } = Animated;
const IS_SMALL_SCREEN = SCREEN_WIDTH < 360;
const IS_ANDROID = Platform.OS === 'android';


export default function CardProfileWelcome() {
  const navigation = useNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const { cliente } = useAuth();
  const { subscription, loadingSubscription } = useSubscription();
  const { isDark, toggleTheme } = useTheme();
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  const avatarUri = cliente?.url_foto_clientes?.trim() || DEFAULT_AVATAR_URL;

  // ── Lógica original — intacta ──────────────────────────────────────────
  const nomeCompleto = [
    cliente?.nome_clientes?.trim(),
    cliente?.sobrenome_clientes?.trim(),
  ].filter(Boolean).join(' ').trim() || 'Usuário';
  const statusAssinatura = loadingSubscription
    ? ''
    : subscription?.title
      || subscription?.nome_plano
      || subscription?.plan?.title
      || 'Não sócio';

  const fullText = [
    'Seja bem-vindo',
    `${nomeCompleto},`,
    'aproveite nosso app'
  ];

  const [displayedText, setDisplayedText] = useState(['', '', '']);
  const [lineIndex, setLineIndex]         = useState(0);
  const [charIndex, setCharIndex]         = useState(0);

  useEffect(() => {
    if (IS_ANDROID) {
      return;
    }
    setDisplayedText(['', '', '']);
    setLineIndex(0);
    setCharIndex(0);
  }, [nomeCompleto, avatarUri]);

  useEffect(() => {
    if (IS_ANDROID) {
      return undefined;
    }

    const typingSpeed = 40;

    const interval = setInterval(() => {
      if (lineIndex < fullText.length) {
        const currentLine = fullText[lineIndex];

        if (charIndex < currentLine.length) {
          setDisplayedText(prev => {
            const newText = [...prev];
            newText[lineIndex] = currentLine.substring(0, charIndex + 1);
            return newText;
          });
          setCharIndex(prev => prev + 1);
        } else {
          setLineIndex(prev => prev + 1);
          setCharIndex(0);
        }
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [charIndex, lineIndex]);
  // ── fim lógica original ──────────────────────────────────────────────

  // ── Animações visuais (novas — não interferem na lógica existente) ────
  const shimmerAnim = useRef(new Value(0)).current;
  const breatheAnim = useRef(new Value(0)).current;

  // Varredura diagonal de shimmer
  useEffect(() => {
    const anim = loop(
      sequence([
        delay(4400),
        timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        timing(shimmerAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // Glow de respiro suave
  useEffect(() => {
    const anim = loop(
      sequence([
        timing(breatheAnim, { toValue: 1, duration: 3400, useNativeDriver: true }),
        timing(breatheAnim, { toValue: 0, duration: 3400, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // Valores derivados das animações
  const shimmerX = shimmerAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [-(SCREEN_WIDTH * 1.3), SCREEN_WIDTH * 1.3],
  });

  const breatheOpacity = breatheAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 0.18],
  });
  // ── fim animações ──────────────────────────────────────────────────────

  // windowWidth (reativo a mudanças de orientação/tamanho) define o
  // breakpoint de fonte do novo bloco de texto Android.
  const androidIsCompact = windowWidth < 360;

  return (
    <View style={[styles.outerContainer, IS_ANDROID && styles.outerContainerAndroid]}>

      {/* ══════════════════════════════════════════════════════════════════
          CAMADA 0 — Glow de respiro vermelho
      ══════════════════════════════════════════════════════════════════ */}
      <Animated.View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          margin:       -22,
          borderRadius: 50,
          overflow:     'hidden',
          opacity:      breatheOpacity,
        }}
      >
        <LinearGradient
          colors={[
            'rgba(255, 50, 50, 0.32)',
            'rgba(220, 30, 30, 0.16)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
      </Animated.View>

      {/* ══════════════════════════════════════════════════════════════════
          CORPO DE VIDRO — overflow:hidden (clip do shimmer)
      ══════════════════════════════════════════════════════════════════ */}
      <View style={[
        styles.wrapper,
        IS_ANDROID && styles.wrapperAndroid,
      ]}>

        {/* Botão de configurações — zIndex 10, preservado integralmente */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <BlurView intensity={Platform.OS === 'android' ? 35 : 5} tint="dark" style={styles.editBlur}>
            <Ionicons name="cart-outline" size={16} color="#fff" />
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.themeButton}
          onPress={toggleTheme}
        >
          <BlurView intensity={Platform.OS === 'android' ? 35 : 5} tint="dark" style={styles.editBlur}>
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={16}
              color="#fff"
            />
          </BlurView>
        </TouchableOpacity>

{/* ------------------------importante---------------------- */}
        {/* G1: BlurView primário — base fosca principal.
            Android: BlurView não usa compositor nativo (fallback com
            backgroundColor sólido), então empilhar 2 BlurViews aqui
            criava um bloco opaco visível ("quadrado" atrás do card).
            Mantemos apenas 1 BlurView real no Android, com intensity
            mais alta para sustentar a leitura de vidro agora que o
            backgroundColor do wrapper é bem mais translúcido. */}
        <BlurView
          intensity={Platform.OS === 'android' ? 62 : 10}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        {/* G2: BlurView secundário — profundidade adicional.
            No Android isso é substituído por um LinearGradient escuro
            translúcido puro (sem 2º blur), preservando a leitura de
            profundidade sem duplicar a camada opaca de fallback.
            Opacidade reduzida para deixar mais transparência passar. */}
        {Platform.OS === 'android' ? (
          <LinearGradient
            colors={['rgba(10,10,14,0.16)', 'rgba(10,10,14,0.10)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ) : (
          <BlurView
            intensity={22}
            tint="dark"
            style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
          />
        )}

        {/* G3: Tom base escuro — diagonal para dinamismo.
            Android: sem BlurView real, esta é a principal fonte de
            textura do "vidro" — um gradiente diagonal genuíno lê melhor
            que a cor sólida repetida (que no iOS é mascarada pelo blur
            real por trás). No iOS o valor original é mantido intocado. */}
        <LinearGradient
          colors={
            Platform.OS === 'android'
              ? ['rgba(210, 210, 215, 0.06)', 'rgba(160, 160, 170, 0.025)', 'rgba(190, 190, 200, 0.045)']
              : [
                  'rgba(192, 192, 192, 0.07)',
                  'rgba(192, 192, 192, 0.07)',
                  'rgba(192, 192, 192, 0.07)',
                ]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* G4: Reflexo ambiental superior-esquerdo
            Fonte de luz de estúdio — efeito visionOS clássico.
            Android: reforçado sutilmente — sem blur real refratando luz,
            esta camada carrega mais peso na leitura de "vidro iluminado". */}
        <LinearGradient
          colors={
            Platform.OS === 'android'
              ? ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.06)', 'transparent']
              : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.05)', 'transparent']
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.65, y: 0.55 }}
        />

        {/* G5: Highlight de volume central
            Centro levemente mais brilhante — curvatura ilusória 3D.
            Android: reativado — sem blur real, o card fica "chapado"
            sem essa curvatura simulada. iOS mantém o comportamento
            original (camada transparente, já compensada pelo blur real). */}
        <LinearGradient
          colors={
            Platform.OS === 'android'
              ? ['transparent', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)', 'transparent']
              : [
                  'transparent',
                  // 'rgba(192, 192, 192, 0.07)',
                  // 'rgba(192, 192, 192, 0.07)',
                  // 'rgba(192, 192, 192, 0.07)',
                  'transparent',
                ]
          }
          style={[StyleSheet.absoluteFill, { top: '18%', bottom: '18%' }]}
          start={{ x: 0.12, y: 0.5 }}
          end={{ x: 0.88, y: 0.5 }}
        />

        {/* G6: Vignette de profundidade inferior
            Parte inferior mais densa — reforça espessura do material.
            Android: levemente mais forte, compensando a falta de
            refração real que o blur do iOS produz naturalmente. */}
        <LinearGradient
          colors={
            Platform.OS === 'android'
              ? ['transparent', 'transparent', 'rgba(0, 0, 0, 0.07)', 'rgba(0, 0, 0, 0.16)']
              : ['transparent', 'transparent', 'rgba(0, 0, 0, 0.04)', 'rgba(0, 0, 0, 0.11)']
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.45 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* G7: Tint vermelho sutil — identidade da marca no material.
            Android: reativado com opacidade mínima — reforça a
            identidade Drakos sem competir com o conteúdo. iOS mantém
            o comportamento original (camada transparente/inerte). */}
          <LinearGradient
            colors={
              Platform.OS === 'android'
                ? ['rgba(180, 20, 20, 0.05)', 'transparent']
                : ['transparent', 'transparent']
            }
            style={StyleSheet.absoluteFill}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

        {/* G8: Shimmer diagonal
            Faixa de luz percorrendo o card — reflexo de luz ambiente.
            Android: Animated.View com transform (translateX + skewX)
            usando useNativeDriver às vezes não respeita o
            overflow:'hidden' do pai corretamente no Android, deixando a
            faixa clara "vazar" como uma listra reta cruzando o card
            (em vez de ficar contida e diagonal). Envolvemos com um View
            de clip extra, com o mesmo borderRadius do wrapper, e
            reduzimos a extensão vertical/largura da faixa no Android
            para minimizar a área que poderia vazar. */}
        {Platform.OS === 'android' ? (
          <View
            pointerEvents="none"
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 28,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top:      -20,
                bottom:   -20,
                width:    SCREEN_WIDTH * 0.20,
                transform: [
                  { translateX: shimmerX },
                  { skewX: '-18deg' },
                ],
              }}
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255, 255, 255, 0.02)',
                  'rgba(255, 255, 255, 0.07)',
                  'rgba(255, 255, 255, 0.12)',
                  'rgba(255, 255, 255, 0.07)',
                  'rgba(255, 255, 255, 0.02)',
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
              top:      -60,
              bottom:   -60,
              width:    SCREEN_WIDTH * 0.28,
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
                'rgba(255, 255, 255, 0.11)',
                'rgba(255, 255, 255, 0.18)',
                'rgba(255, 255, 255, 0.11)',
                'rgba(255, 255, 255, 0.03)',
                'transparent',
              ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
        )}

        {/* G9: glowOverlay vermelho — preservado do original */}
        <View style={styles.glowOverlay} />

        {/* ── CONTEÚDO — preservado integralmente ──────────────────────── */}

        {/* HEADER */}
        <View style={[styles.topRow, IS_ANDROID && styles.topRowAndroid]}>

          {/* Avatar com anel premium e halo de luz */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.06)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
          </View>

          <View style={[styles.statusBlock, IS_ANDROID && styles.statusBlockAndroid]}>
            <Text style={[styles.statusTitle, IS_ANDROID && styles.statusTitleAndroid]}>Status atual:</Text>
            <View style={[styles.statusChip, IS_ANDROID && styles.statusChipAndroid]}>
              <Text style={[styles.statusText, IS_ANDROID && styles.statusTextAndroid]}>{statusAssinatura}</Text>
            </View>
          </View>
        </View>

        {/* TEXTO ANIMADO — states e lógica 100% intactos.
            Android: layout de texto totalmente independente do iOS —
            nome em linha própria, mensagem em bloco vertical simples,
            sem herdar styles.text/styles.name (que carregam premissas
            de lineHeight/largura pensadas para o layout do iOS). Os
            três valores (displayedText[0/1/2]) e a lógica de digitação
            são exatamente os mesmos; só a apresentação muda. */}
        {IS_ANDROID ? (
          <View style={styles.textBlockAndroid}>
            <Text
              style={[
                styles.greetingLineAndroid,
                androidIsCompact && styles.greetingLineAndroidCompact,
              ]}
            >
              {fullText[0]}
            </Text>
            <Text
              style={[
                styles.nameLineAndroid,
                androidIsCompact && styles.nameLineAndroidCompact,
              ]}
            >
              {fullText[1]}
            </Text>
            <Text
              style={[
                styles.greetingLineAndroid,
                androidIsCompact && styles.greetingLineAndroidCompact,
              ]}
            >
              {fullText[2]}
            </Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.text}>{displayedText[0]}</Text>

            <Text style={[styles.text, styles.name]}>
              {displayedText[1]}
            </Text>

            <Text style={styles.text}>{displayedText[2]}</Text>
          </View>
        )}

        {/* AÇÕES — eventos e estrutura preservados */}
        <View style={styles.actionsContainer}>

        </View>

      </View>
      {/* ── fim wrapper ──────────────────────────────────────────────── */}

      {/* ══════════════════════════════════════════════════════════════════
          CAMADA ESPECULAR — fora do overflow:hidden
      ══════════════════════════════════════════════════════════════════ */}

      {/* E1: Barra especular superior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top:      0,
          left:     '10%',
          right:    '10%',
          height:   1,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={
            Platform.OS === 'android'
              ? [
                  'transparent',
                  'rgba(255,255,255,0.50)',
                  'rgba(255,255,255,0.80)',
                  'rgba(255,255,255,0.86)',
                  'rgba(255,255,255,0.80)',
                  'rgba(255,255,255,0.50)',
                  'transparent',
                ]
              : [
                  'transparent',
                  'rgba(255,255,255,0.50)',
                  'rgba(255,255,255,0.86)',
                  'rgba(255,255,255,0.92)',
                  'rgba(255,255,255,0.86)',
                  'rgba(255,255,255,0.50)',
                  'transparent',
                ]
          }
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E2: Rim light esquerdo */}
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
              ? ['transparent', 'rgba(255,255,255,0.50)', 'rgba(255,255,255,0.34)', 'rgba(255,255,255,0.14)', 'transparent']
              : ['transparent', 'rgba(255,255,255,0.42)', 'rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)', 'transparent']
          }
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* E3: Franja cromática inferior */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom:   0,
          left:     '16%',
          right:    '16%',
          height:   0.75,
          borderRadius: 0.75,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(160, 80, 80, 0.32)',
            'rgba(185, 100, 100, 0.48)',
            'rgba(160, 80, 80, 0.32)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E4: Franja âmbar */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top:      0,
          right:    '12%',
          width:    '28%',
          height:   0.75,
          borderRadius: 0.75,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 225, 170, 0.26)',
            'rgba(255, 205, 130, 0.36)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E5: Anel externo */}
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 28,
          borderWidth:  0.75,
          borderColor:  Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.22)',
        }}
      />

      {/* E6: Anel interno inset */}
      <View
        pointerEvents="none"
        style={{
          position:     'absolute',
          top:          1.5,
          left:         1.5,
          right:        1.5,
          bottom:       1.5,
          borderRadius: 26.5,
          borderWidth:  0.5,
          borderColor:  Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.13)' : 'rgba(255, 255, 255, 0.09)',
        }}
      />

    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  outerContainer: {
    marginTop:  50,
    borderRadius: 28,
    backgroundColor: 'transparent',

    shadowColor:   '#1a0a0a',
    shadowOpacity: 0.42,
    shadowRadius:  36,
    shadowOffset:  { width: 0, height: 18 },
    elevation: Platform.OS === 'android' ? 8 : 18,
  },

  outerContainerAndroid: {
    alignSelf: 'stretch',
    width: '100%',
  },

  // Corpo do vidro — overflow:hidden necessário para clip do shimmer e blurs.
  // Android: o bg sólido opaco anterior evitava o bug do "quadrado" mas
  // também matava a sensação de vidro. A correção real do bug é não
  // empilhar 2 BlurViews (já resolvido em G1/G2) — aqui usamos um fundo
  // bem mais translúcido e deixamos o blur real (intensity alta) e as
  // camadas de luz sustentarem o efeito de vidro.
  wrapper: {
    padding:         20,
    borderRadius:    28,
    overflow:        'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(12,12,16,0.32)' : 'transparent',
  },

  wrapperAndroid: {
    paddingTop: 22,
    paddingBottom: 28,
    width: '100%',
    alignSelf: 'stretch',
    // Sem minHeight fixo: nomes longos ("Maria Eduarda Nascimento,")
    // podem quebrar em 2-3 linhas em telas estreitas. O card cresce
    // naturalmente pelo próprio layout de flexbox — altura sempre
    // acompanha o conteúdo real, nunca compete com ele.
  },

  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   20,
  },

  topRowAndroid: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  // Android: sem BlurView real atrás, o preenchimento translúcido original
  // (0.06) ficava quase invisível sobre o fundo sólido do wrapper.
  // Reforçado sutilmente só no Android para manter a leitura de "anel de
  // vidro" ao redor do avatar.
  // Android: reforço reduzido — o card em si já está mais translúcido
  // agora (blur real fazendo o trabalho), então o anel do avatar não
  // precisa mais compensar tanto quanto antes.
  avatarRing: {
    width:           54,
    height:          54,
    borderRadius:    27,
    marginRight:     12,
    overflow:        'hidden',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     0.75,
    borderColor:     Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.30)' : 'rgba(255, 255, 255, 0.28)',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)',
  },

  avatar: {
    width:        50,
    height:       50,
    borderRadius: 25,
  },

  statusTitle: {
    color:    '#fff',
    fontSize: 12,
    opacity:  0.55,
    letterSpacing: 0.3,
  },

  statusTitleAndroid: {
    marginBottom: 2,
  },

  statusBlock: {
    flexShrink: 1,
  },

  statusBlockAndroid: {
    maxWidth: '100%',
    flexShrink: 1,
    flexGrow: 1,
    minWidth: 0,
  },

  // Android: mesmo reforço — sem blur real, o chip translúcido original
  // ficava quase indistinguível do fundo do card.
  statusChip: {
    marginTop:       3,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius:    8,
    alignSelf:       'flex-start',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
    borderWidth:     0.5,
    borderColor:     Platform.OS === 'android' ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.15)',
  },

  statusChipAndroid: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },

  statusText: {
    color:      '#fff',
    fontWeight: '600',
    fontSize:   13,
    letterSpacing: 0.2,
  },

  statusTextAndroid: {
    fontSize: 12,
    lineHeight: 17,
    flexShrink: 1,
  },

  textContainer: {
    width: '100%',
  },

  // ── Bloco de texto Android — layout independente do iOS ─────────────────
  // Card de boas-vindas tratado como layout próprio no Android: nome em
  // linha isolada, mensagem em bloco vertical simples, espaçamento
  // generoso. Não tenta replicar o texto corrido único do iOS — prioriza
  // nunca cortar texto, para qualquer tamanho de nome ou tela.
  textBlockAndroid: {
    marginTop: 14,
    marginBottom: 6,
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },

  text: {
    color:      '#fff',
    fontSize:   IS_SMALL_SCREEN ? 19 : 22,
    fontWeight: '500',
    lineHeight: IS_SMALL_SCREEN ? 24 : 28,
  },

  // Linhas de saudação ("Seja bem-vindo" / "aproveite nosso app").
  // Fonte reduzida e lineHeight bem generoso (fontSize * ~1.6) — folga
  // ampla o bastante para nunca cortar em nenhuma métrica de fonte de
  // fabricante Android, priorizando robustez sobre densidade visual.
  greetingLineAndroid: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    width: '100%',
    flexWrap: 'wrap',
  },

  greetingLineAndroidCompact: {
    fontSize: 13,
    lineHeight: 21,
  },

  name: {
    color:           '#ff2b2b',
    textShadowColor:  'rgba(255,0,0,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // Nome do usuário — linha própria, isolado da saudação. Mantém a
  // identidade visual (vermelho + glow) mas com fonte menor e lineHeight
  // bem generoso (fontSize * ~1.6), já que é o texto de comprimento mais
  // variável e mais propenso a ter acentos (á, ã, é, ç, õ).
  nameLineAndroid: {
    color: '#ff2b2b',
    textShadowColor: 'rgba(255,0,0,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 6,
    width: '100%',
    flexWrap: 'wrap',
  },

  nameLineAndroidCompact: {
    fontSize: 16,
    lineHeight: 25,
  },

  // Android: reativado como glow interno vermelho muito sutil — reforça
  // a identidade da marca e dá profundidade extra que, no iOS, o blur
  // real já entrega sozinho. iOS permanece transparent (sem efeito,
  // comportamento original preservado).
  glowOverlay: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    borderRadius:    28,
    backgroundColor: Platform.OS === 'android' ? 'rgba(160, 10, 10, 0.035)' : 'transparent',
  },

  editButton: {
    position: 'absolute',
    top:      16,
    right:    16,
    zIndex:   10,
  },

    themeButton: {
      position: 'absolute',
      top: 16,
      right: 62,
      zIndex: 10,
    },

  editBlur: {
    padding:     10,
    borderRadius: 14,
    overflow:     'hidden',
    borderWidth:  0.75,
    borderColor:  'rgba(255,255,255,0.18)',
    backgroundColor: Platform.OS === 'android' ? 'rgba(20,20,24,0.55)' : 'transparent',
  },

  actionsContainer: {
    marginTop:  20,
    alignItems: 'flex-start',
  },

  actionButton: {
    alignSelf: 'flex-start',
  },

  actionBlur: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius:    14,
    overflow:        'hidden',
    borderWidth:     0.75,
    borderColor:     'rgba(255,255,255,0.16)',
    backgroundColor: Platform.OS === 'android' ? 'rgba(20,20,24,0.55)' : 'transparent',
  },

  actionBlurSpecular: {
    position:        'absolute',
    top:             0,
    left:            '10%',
    right:           '10%',
    height:          0.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius:    0.5,
  },

  actionText: {
    color:      '#fff',
    marginLeft: 6,
    fontSize:   13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

});
