/**
 * SociosScreen — Liquid Glass Premium Edition
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Refatoração visual completa baseada na arquitetura de camadas do
 * CardActionGlass (iOS 26 Liquid Glass — tint dark).
 *
 * LÓGICA 100% PRESERVADA:
 *   – useState(selectedPlan), useState(modalVisible)
 *   – openModal(plan) / closeModal()
 *   – dadosPlano.map(...)  — fonte de dados inalterada
 *   – navigation.goBack()
 *   – Nenhuma alteração em imports de dados ou navegação
 *
 * Arquitetura de camadas por card (baixo → cima), espelhando CardActionGlass:
 *   [outerContainer]  sombras + scale, SEM overflow:hidden (iOS shadow fix)
 *    [glassBody]       overflow:hidden — clip de blur/shimmer
 *     G1. BlurView primário (tint dark, intensity 52)
 *     G2. BlurView secundário (profundidade)
 *     G3. Tom base do vidro + tinta de identidade do plano (cardColor a 6%)
 *     G4. Reflexo ambiental superior-esquerdo
 *     G5. Vignette inferior de espessura
 *     G6. Shimmer diagonal (Animated.Value COMPARTILHADO entre cards)
 *     G7. Conteúdo (badge, título, descrição, botão glass, imagem flutuante)
 *    [especulares fora do clip]
 *     E1. Barra especular superior · E2. Rim light esquerdo
 *     E3. Franja cromática inferior · E4. Anel externo · E5. Anel interno inset
 *
 * Modal → Bottom Sheet Glass:
 *   – Backdrop com BlurView escuro (não preto sólido)
 *   – Painel translúcido com mesma arquitetura especular do card
 *   – Botões "Fechar" (glass neutro) e "Assinar" (glass com glow de acento)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { useSubscription } from '../contexts/SubscriptionContext';
import { dadosPlano } from '../data/dataSocios/dataSocios';
import NavbarGlass from '../components/NavbarGlass';

const escudoDrakos = require('../assets/img/Escudo_Drakos.png');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Design System ────────────────────────────────────────────────────────────
const DS = {
  bg:           '#0a0a0a',
  bgElevated:   '#121212',
  accent:       '#c0000a',
  accentBright: '#e8000f',
  text:         '#f4f4f4',
  textDim:      'rgba(244,244,244,0.58)',
  textFaint:    'rgba(244,244,244,0.30)',
  glassBorder:  'rgba(255,255,255,0.18)',
  radius:       22,
  spacing:      { sm: 12, md: 16, lg: 20, xl: 24 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: PlanGlassCard
// Card de plano com arquitetura de vidro líquido idêntica ao CardActionGlass,
// adaptada ao layout horizontal (texto à esquerda, imagem à direita).
// Recebe shimmerAnim e floatAnim COMPARTILHADOS do pai — evita N loops de
// animação simultâneos quando há múltiplos planos (otimização de performance).
// ═══════════════════════════════════════════════════════════════════════════════
const PlanGlassCard = memo(({ plan, onVerMais, shimmerAnim, floatAnim }) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: true, friction: 7 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const shimmerX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-(SCREEN_WIDTH * 1.1), SCREEN_WIDTH * 1.1],
  });

  return (
    <Animated.View style={[cardStyles.outerContainer, { transform: [{ scale: pressAnim }] }]}>
      {/* ── Corpo de vidro (overflow:hidden) ────────────────────────────── */}
      <View style={cardStyles.glassBody}>
        {/* G1: BlurView primário */}
        <BlurView intensity={52} tint="dark" style={StyleSheet.absoluteFill} />

        {/* G2: BlurView secundário — profundidade adicional */}
        <BlurView intensity={16} tint="dark" style={[StyleSheet.absoluteFill, { opacity: 0.5 }]} />

        {/* G3: Tom base do vidro + tinta de identidade do plano (sutil) */}
        <LinearGradient
          colors={[
            `${plan.cardColor || DS.accent}1A`,
            'rgba(255,255,255,0.03)',
            'rgba(0,0,0,0.10)',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* G4: Reflexo ambiental superior-esquerdo */}
        <LinearGradient
          colors={['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.05)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.55 }}
        />

        {/* G5: Vignette inferior — espessura do vidro */}
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,5,18,0.06)', 'rgba(0,5,18,0.16)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.4 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* G6: Shimmer diagonal — Animated.Value compartilhado */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -130,
            bottom: -130,
            width: SCREEN_WIDTH * 0.28,
            transform: [{ translateX: shimmerX }, { skewX: '-18deg' }],
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.04)',
              'rgba(255,255,255,0.12)',
              'rgba(255,255,255,0.18)',
              'rgba(255,255,255,0.12)',
              'rgba(255,255,255,0.04)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>

        {/* ── G7: Conteúdo ────────────────────────────────────────────── */}
        <View style={cardStyles.content}>
          {/* Lado esquerdo: badge, título, descrição, botão */}
          <View style={cardStyles.cardLeft}>
            <View style={cardStyles.badge}>
              <View style={cardStyles.badgeDot} />
              <Text style={cardStyles.badgeText}>{plan.vagas}</Text>
            </View>

            <Text style={cardStyles.planTitle}>{plan.title}</Text>
            <Text style={cardStyles.planDescription} numberOfLines={3}>
              {plan.description}
            </Text>

            {/* Botão glass "VER MAIS" */}
            <TouchableOpacity
              style={cardStyles.verMaisButton}
              onPress={onVerMais}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.85}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={cardStyles.buttonSpecular} />
              <View style={cardStyles.buttonBorder} />
              <Text style={cardStyles.verMaisText}>VER MAIS</Text>
              <Ionicons name="arrow-forward" size={12} color={DS.text} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Lado direito: imagem flutuante do cartão */}
          <View style={cardStyles.cardRight}>
            <View style={cardStyles.imageGlow} />
            <Animated.Image
              source={plan.cardImage}
              style={[
                cardStyles.cardPlanImage,
                { transform: [{ translateY: floatAnim }] },
              ]}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      {/* ── fim glassBody ───────────────────────────────────────────────── */}

      {/* ── Camadas especulares (fora do clip) ──────────────────────────── */}
      {/* E1: Barra especular superior */}
      <View pointerEvents="none" style={cardStyles.specularTopWrap}>
        <LinearGradient
          colors={[
            'transparent', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.92)',
            'rgba(255,255,255,0.95)', 'rgba(255,255,255,0.92)', 'rgba(255,255,255,0.55)', 'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E2: Rim light esquerdo */}
      <View pointerEvents="none" style={cardStyles.rimLeftWrap}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.48)', 'rgba(255,255,255,0.30)', 'rgba(255,255,255,0.10)', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* E3: Franja cromática inferior */}
      <View pointerEvents="none" style={cardStyles.chromaBottomWrap}>
        <LinearGradient
          colors={['transparent', 'rgba(160,185,255,0.28)', 'rgba(180,200,255,0.40)', 'rgba(160,185,255,0.28)', 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E4: Anel externo */}
      <View pointerEvents="none" style={cardStyles.borderOuter} />

      {/* E5: Anel interno inset */}
      <View pointerEvents="none" style={cardStyles.borderInner} />
    </Animated.View>
  );
});

const cardStyles = StyleSheet.create({
  outerContainer: {
    borderRadius: DS.radius,
    marginHorizontal: DS.spacing.lg,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.30,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  glassBody: {
    borderRadius: DS.radius,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.025)',
    minHeight: 190,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: DS.spacing.lg,
  },
  cardLeft: {
    flex: 1.3,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DS.accentBright,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: DS.text,
    letterSpacing: 0.6,
  },
  planTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.5,
    marginTop: 12,
    lineHeight: 24,
  },
  planDescription: {
    fontSize: 11.5,
    color: DS.textDim,
    fontWeight: '400',
    lineHeight: 16,
    marginTop: 6,
  },
  verMaisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 14,
  },
  buttonSpecular: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 0.5,
  },
  buttonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.30)',
  },
  verMaisText: {
    fontSize: 11,
    fontWeight: '700',
    color: DS.text,
    letterSpacing: 1,
  },
  cardRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cardPlanImage: {
    width: '100%',
    height: 130,
  },
  specularTopWrap: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    borderRadius: 1,
    overflow: 'hidden',
  },
  rimLeftWrap: {
    position: 'absolute',
    left: 0,
    top: '12%',
    width: 1,
    height: '60%',
    borderRadius: 1,
    overflow: 'hidden',
  },
  chromaBottomWrap: {
    position: 'absolute',
    bottom: 0,
    left: '16%',
    right: '16%',
    height: 0.75,
    borderRadius: 0.75,
    overflow: 'hidden',
  },
  borderOuter: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DS.radius,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  borderInner: {
    position: 'absolute',
    top: 1.5,
    left: 1.5,
    right: 1.5,
    bottom: 1.5,
    borderRadius: DS.radius - 1.5,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: GlassBottomSheet
// Modal de detalhes do plano transformado em bottom-sheet de vidro líquido.
// ═══════════════════════════════════════════════════════════════════════════════
const GlassBottomSheet = memo(({ visible, plan, onClose }) => (
  <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    {/* ── Backdrop com blur escuro (não sólido) ─────────────────────────── */}
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={sheetStyles.backdrop}>
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={sheetStyles.backdropTint} />
      </View>
    </TouchableWithoutFeedback>

    {/* ── Painel translúcido (bottom sheet) ─────────────────────────────── */}
    <View style={sheetStyles.sheetWrap}>
      <View style={sheetStyles.sheetBody}>
        <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
        <BlurView intensity={18} tint="dark" style={[StyleSheet.absoluteFill, { opacity: 0.5 }]} />

        <LinearGradient
          colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)', 'rgba(0,0,0,0.12)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Handle de arraste */}
        <View style={sheetStyles.handle} />

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Título */}
          <Text style={sheetStyles.modalPlanTitle}>{plan?.title}</Text>
          <Text style={sheetStyles.modalPlanDescription}>{plan?.description}</Text>

          {/* Imagem ilustrativa do cartão */}
          <View style={sheetStyles.imageWrap}>
            <View style={sheetStyles.imageGlowModal} />
            <Image source={plan?.cardImage} style={sheetStyles.modalCardImage} resizeMode="contain" />
          </View>

          {/* Benefícios */}
          <Text style={sheetStyles.beneficiosTitle}>Benefícios</Text>
          <View style={sheetStyles.beneficiosList}>
            {plan?.beneficios?.map((beneficio, index) => (
              <View key={index} style={sheetStyles.beneficioItem}>
                <View style={sheetStyles.bulletDot} />
                <Text style={sheetStyles.beneficioText}>{beneficio}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Rodapé fixo: preço + botões glass ───────────────────────── */}
        <View style={sheetStyles.modalFooter}>
          <View style={sheetStyles.footerTopLine} />
          <View style={sheetStyles.footerRow}>
            <Text style={sheetStyles.modalPrice}>{plan?.price}</Text>

            <View style={sheetStyles.modalButtons}>
              {/* Fechar — glass neutro */}
              <TouchableOpacity style={sheetStyles.fecharButton} onPress={onClose} activeOpacity={0.8}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={sheetStyles.fecharBorder} />
                <Text style={sheetStyles.fecharButtonText}>Fechar</Text>
              </TouchableOpacity>

              {/* Assinar — glass com acento crimson */}
              <TouchableOpacity style={sheetStyles.assinarButton} activeOpacity={0.85}>
                <LinearGradient
                  colors={[DS.accentBright, DS.accent]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={sheetStyles.assinarSpecular} />
                <View style={sheetStyles.assinarBorder} />
                <Text style={sheetStyles.assinarButtonText}>Assinar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Especular superior do painel */}
        <View pointerEvents="none" style={sheetStyles.sheetSpecularTop}>
          <LinearGradient
            colors={[
              'transparent', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.85)',
              'rgba(255,255,255,0.5)', 'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>
      </View>
    </View>
  </Modal>
));

const sheetStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  sheetWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.82,
  },
  sheetBody: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    paddingHorizontal: DS.spacing.xl,
    paddingTop: 14,
    paddingBottom: 0,
    minHeight: SCREEN_HEIGHT * 0.6,
    borderWidth: 0.75,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 18,
  },
  modalPlanTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.6,
  },
  modalPlanDescription: {
    fontSize: 13,
    color: DS.textDim,
    lineHeight: 19,
    marginTop: 8,
    fontWeight: '400',
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 22,
    height: 140,
  },
  imageGlowModal: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modalCardImage: {
    width: '70%',
    height: '100%',
  },
  beneficiosTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: DS.accentBright,
    letterSpacing: 2,
    marginBottom: 12,
  },
  beneficiosList: {
    gap: 11,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: DS.accentBright,
    marginTop: 5,
  },
  beneficioText: {
    flex: 1,
    fontSize: 13,
    color: DS.text,
    lineHeight: 19,
    fontWeight: '400',
  },
  modalFooter: {
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: 'rgba(10,10,10,0.55)',
  },
  footerTopLine: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginBottom: 14,
    marginHorizontal: -DS.spacing.xl,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.5,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  fecharButton: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fecharBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 21,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  fecharButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.textDim,
  },
  assinarButton: {
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 21,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assinarSpecular: {
    position: 'absolute',
    top: 0,
    left: '14%',
    right: '14%',
    height: 0.75,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 0.75,
  },
  assinarBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 21,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  assinarButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: DS.text,
    letterSpacing: 0.3,
  },
  sheetSpecularTop: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 1,
    borderRadius: 1,
    overflow: 'hidden',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: SociosScreen
// ═══════════════════════════════════════════════════════════════════════════════
export default function SociosScreen({ navigation }) {
  // ── Lógica original — 100% preservada ────────────────────────────────────
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlan(null);
  };
  // ── fim lógica original ───────────────────────────────────────────────────

  // ── Animações compartilhadas (otimização: 1 loop em vez de N) ────────────
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.delay(3800),
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );
    float.start();
    return () => float.stop();
  }, []);

  return (
    <View style={mainStyles.container}>
      {/* ── Fundo cinematográfico ────────────────────────────────────────── */}
      <View style={mainStyles.background} pointerEvents="none">
        <View style={mainStyles.bgGlow} />
      </View>

      {/* Marca d'água do escudo Drakos */}
      <Image
        source={escudoDrakos}
        style={mainStyles.drakosBackground}
        resizeMode="contain"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={mainStyles.content}
      >
        {/* Botão voltar — glass */}
        <TouchableOpacity style={mainStyles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={mainStyles.backButtonBorder} />
          <Ionicons name="arrow-back" size={18} color={DS.text} />
        </TouchableOpacity>

        {/* Título "PLANOS sócio-Torcedor" */}
        <View style={mainStyles.titleContainer}>
          <Text style={mainStyles.titleLine1}>PLANOS</Text>
          <View style={mainStyles.titleLine2}>
            <Text style={mainStyles.titleSocio}>sócio-</Text>
            <Text style={mainStyles.titleTorcedor}>Torcedor</Text>
          </View>
        </View>

        {/* ─────────── Lista de cards de planos (Liquid Glass) ─────────── */}
        {dadosPlano.map((plan) => (
          <PlanGlassCard
            key={plan.id}
            plan={plan}
            onVerMais={() => openModal(plan)}
            shimmerAnim={shimmerAnim}
            floatAnim={floatAnim}
          />
        ))}

        {/* Rodapé informativo */}
        <View style={mainStyles.footerNote}>
          <View style={mainStyles.footerLine} />
          <Text style={mainStyles.footerText}>
            Torcer é mais que acompanhar um jogo.{'\n'}É fazer parte de uma torcida apaixonada.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ═══════════ MODAL / BOTTOM SHEET DE DETALHES DO PLANO ═══════════ */}
      <GlassBottomSheet
        visible={modalVisible}
        plan={selectedPlan}
        onClose={closeModal}
      />
    </View>
  );
}

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGlow: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: DS.accent,
    opacity: 0.05,
    shadowColor: DS.accent,
    shadowOpacity: 1,
    shadowRadius: 120,
  },
  drakosBackground: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.4,
    height: SCREEN_WIDTH * 1.4,
    top: SCREEN_HEIGHT * 0.18,
    left: -SCREEN_WIDTH * 0.3,
    opacity: 0.035,
  },
  content: {
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: DS.spacing.lg,
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backButtonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  titleContainer: {
    paddingHorizontal: DS.spacing.lg,
    marginBottom: 28,
  },
  titleLine1: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.textFaint,
    letterSpacing: 4,
  },
  titleLine2: {
    flexDirection: 'row',
    marginTop: 2,
  },
  titleSocio: {
    fontSize: 38,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -1,
  },
  titleTorcedor: {
    fontSize: 38,
    fontWeight: '900',
    color: DS.accentBright,
    letterSpacing: -1,
  },
  footerNote: {
    paddingHorizontal: DS.spacing.xl,
    marginTop: 16,
    alignItems: 'center',
  },
  footerLine: {
    width: 28,
    height: 2,
    backgroundColor: DS.accent,
    borderRadius: 1,
    marginBottom: 14,
  },
  footerText: {
    fontSize: 12,
    color: DS.textFaint,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
  },
});
