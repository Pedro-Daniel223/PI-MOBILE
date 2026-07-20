/**
 * VideoHighlightCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Card premium de destaque de vídeo (estilo YouTube Premium / Apple TV+),
 * construído 100% em cima do `PremiumGlassCard` original — sem alterar
 * NENHUMA camada da sua arquitetura (glow, sombras, blur, shimmer, bordas,
 * refração cromática, anéis).
 *
 * O que este arquivo faz:
 *   - Usa <PremiumGlassCard tint="dark" .../> como casca de vidro líquido
 *     (mesmas 8 camadas, mesmo shimmer, mesmo glow, mesmas bordas).
 *   - Injeta como `children` uma composição de thumbnail estilo streaming:
 *       ImageBackground → overlay gradiente escuro → badge "ÚLTIMO JOGO"
 *       → botão Play (círculo Liquid Glass) → duração do vídeo
 *       → título + subtítulo na base.
 *   - contentPadding={0} é passado ao PremiumGlassCard para que a thumbnail
 *     ocupe 100% da área interna do vidro (a moldura de vidro continua
 *     intacta ao redor — glow, bordas, shimmer por cima da imagem).
 *
 * Nenhuma lógica de navegação foi alterada — o card recebe `onPress` e
 * repassa diretamente para o PremiumGlassCard original.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PremiumGlassCard from './PremiumGlassCard';

// Placeholder — substitua pela URL real da thumbnail do vídeo/partida.
const PLACEHOLDER_THUMB =
  'https://img.youtube.com/vi/K1qcPok3kjQ/maxresdefault.jpg';

const VideoHighlightCard = ({
  onPress,
  thumbnail = PLACEHOLDER_THUMB,
  badgeLabel = 'ÚLTIMO JOGO',
  duration = '06:42',
  title = 'Assista aos melhores momentos',
  subtitle = 'Drakos FC 1 × 0 Internacional',
  width = 340,
  height = 220,
  borderRadius = 26,
  style,
}) => {
  return (
    <PremiumGlassCard
      onPress={onPress}
      width={width}
      height={height}
      borderRadius={borderRadius}
      blurIntensity={55}
      tint="dark"
      enableShimmer={true}
      enableBreathing={true}
      enableFloat={false}
      glowColor="rgba(224, 20, 35, 0.85)"
      contentPadding={0}
      style={style}
    >
      {/* ══════════════════════════════════════════════════════════════════
          THUMBNAIL — ocupa toda a área interna do vidro
      ══════════════════════════════════════════════════════════════════ */}
      <ImageBackground
        source={{ uri: thumbnail }}
        style={styles.thumb}
        imageStyle={{ borderRadius }}
        resizeMode="cover"
      >
        {/* Overlay gradiente escuro — legibilidade + clima cinematic */}
        <LinearGradient
          colors={[
            'rgba(5, 2, 3, 0.55)',
            'rgba(5, 2, 3, 0.05)',
            'rgba(5, 2, 3, 0.15)',
            'rgba(4, 1, 2, 0.72)',
            'rgba(3, 1, 1, 0.94)',
          ]}
          locations={[0, 0.28, 0.5, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Vinheta radial sutil vermelho/preto — profundidade extra */}
        <LinearGradient
          colors={['transparent', 'rgba(20, 0, 3, 0.35)']}
          start={{ x: 0.5, y: 0.3 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* ── Badge "ÚLTIMO JOGO" — canto superior esquerdo ─────────────── */}
        <View style={styles.badgeWrap}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>

        {/* ── Duração do vídeo — canto inferior direito ─────────────────── */}
        <View style={styles.durationWrap}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>

        {/* ── Botão Play — círculo Liquid Glass central ─────────────────── */}
        <View style={styles.playCenter} pointerEvents="none">
          <View style={styles.playRing}>
            <BlurView intensity={45} tint="dark" style={styles.playBlur}>
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.22)',
                  'rgba(255, 255, 255, 0.04)',
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
              />
              <View style={styles.playIconWrap}>
                <Ionicons
                  name="play"
                  size={26}
                  color="#fff"
                  style={{ marginLeft: 3 }}
                />
              </View>
            </BlurView>
            {/* aro externo fino */}
            <View style={styles.playRingBorder} pointerEvents="none" />
          </View>
        </View>

        {/* ── Título + subtítulo — base da thumbnail ────────────────────── */}
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.subtitleRow}>
            <View style={styles.scoreDash} />
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </PremiumGlassCard>
  );
};

export default VideoHighlightCard;

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  thumb: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  // Badge "ÚLTIMO JOGO"
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 14,
    marginLeft: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(224, 8, 22, 0.14)',
    borderWidth: 0.75,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#fff',
    marginRight: 6,
    opacity: 0.95,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#fff',
    textTransform: 'uppercase',
  },

  // Duração
  durationWrap: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginTop: 12,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  durationText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
    fontVariant: ['tabular-nums'],
  },

  // Play button
  playCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  playBlur: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 4, 6, 0.28)',
  },
  playIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playRingBorder: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },

  // Título / subtítulo
  textBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 6,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.1,
    ...Platform.select({
      ios: { fontFamily: 'SF Pro Display' },
      default: {},
    }),
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  scoreDash: {
    width: 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#e8000f',
    marginRight: 7,
  },
  subtitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.78)',
    letterSpacing: 0.2,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// USO
// ─────────────────────────────────────────────────────────────────────────────
//
//  import VideoHighlightCard from './VideoHighlightCard';
//
//  <VideoHighlightCard
//    onPress={() => navigation.navigate('VideoPlayer', { id: highlight.id })}
//    thumbnail={highlight.thumbnailUrl}
//    duration={highlight.durationLabel}
//    title="Assista aos melhores momentos"
//    subtitle="Drakos FC 3 × 1 Rivais"
//  />
//
// ─────────────────────────────────────────────────────────────────────────────