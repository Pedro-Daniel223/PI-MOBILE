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
 *
 * LIGHT/DARK MODE:
 *   – useColorScheme() + DARK_DS/LIGHT_DS + makeCardStyles/makeSheetStyles/
 *     makeMainStyles(DS), seguindo o mesmo padrão de PerfilScreen.
 *   – DARK_DS reproduz EXATAMENTE os valores que já existiam no DS estático
 *     original desta tela. LIGHT_DS é um conjunto de tokens novo e paralelo.
 *   – Nenhum valor de layout (paddings, tamanhos, radius, gaps, shadowOffset,
 *     shadowRadius, elevation) foi alterado — apenas cores/tokens.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
} from "react";
import {
  Alert,
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
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";

import CheckoutModal from "./CheckoutModal";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useTheme } from "../contexts/ThemeContext";
import { formatSocioPlanTitle } from "../utils/formatSocioPlanTitle";
import apiClient from "../services/api";
import { dadosPlano } from "../data/dataSocios/dataSocios";
import NavbarGlass from "../components/NavbarGlass";
import { assinarPlano, getPlanos } from "../services/subscriptionService";
import {
  DARK_DS,
  LIGHT_DS,
  makeCardStyles,
  makeSheetStyles,
  makeMainStyles,
} from "../styles/styleSocios/stylesSocios";

const escudoDrakos = require("../assets/img/Escudo_Drakos.png");
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const { BASE_URL } = apiClient;

const parsePlanoValor = (valor) => {
  if (typeof valor === "number") {
    return valor;
  }

  const texto = String(valor || "");
  const match = texto.match(/(\d[\d.]*(?:,\d{2})?)/);

  if (!match) {
    return 0;
  }

  return Number(match[1].replace(/\./g, "").replace(",", ".")) || 0;
};

const formatBRL = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const buildSubscriptionCheckoutItem = (plan) => ({
  id: plan?.id,
  plano_id: plan?.id,
  nome: plan?.title,
  nome_plano: plan?.title,
  title: plan?.title,
  quantidade: 1,
  quantity: 1,
  preco: parsePlanoValor(plan?.price),
  imagem_plano: plan?.cardImage,
  imagem: plan?.cardImage,
  image: plan?.cardImage,
});

const FALLBACK_PLANOS = dadosPlano;

const resolveRemoteImageUri = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedBase = String(BASE_URL || "").replace(/\/+$/, "");
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return normalizedBase ? `${normalizedBase}${normalizedPath}` : value;
};

const normalizePlano = (plan, fallback = {}) => {
  const id = Number(
    plan?.plano_id ??
      plan?.id ??
      plan?.id_categoria_cliente ??
      fallback.id ??
      fallback.plano_id,
  );
  const title = formatSocioPlanTitle(
    plan?.title ||
      plan?.nome_plano ||
      plan?.nome ||
      fallback.title ||
      fallback.nome ||
      "",
  );
  const price =
    plan?.price ??
    plan?.valor ??
    plan?.preco ??
    fallback.price ??
    fallback.preco ??
    0;
  const description =
    plan?.description ||
    plan?.descricao ||
    fallback.description ||
    fallback.descricao ||
    "";
  const benefits =
    Array.isArray(plan?.beneficios) && plan.beneficios.length > 0
      ? plan.beneficios
      : Array.isArray(fallback.beneficios)
        ? fallback.beneficios
        : [];
  const imageUri = resolveRemoteImageUri(
    plan?.card_image ||
      plan?.imagem_url ||
      plan?.imagem ||
      fallback.cardImage ||
      fallback.imagem ||
      null,
  );

  return {
    id: Number.isFinite(id)
      ? String(id)
      : String(plan?.id ?? fallback.id ?? title),
    title,
    description,
    price,
    vagas: plan?.vagas || fallback.vagas || "",
    textColor: plan?.textColor || fallback.textColor || "#fff",
    cardColor: plan?.cardColor || fallback.cardColor || "#000000",
    cardImage: imageUri
      ? typeof imageUri === "string"
        ? { uri: imageUri }
        : imageUri
      : fallback.cardImage || null,
    beneficios: benefits,
    tier: plan?.tier || fallback.tier || "nao-socio",
    raw: plan,
  };
};

const normalizeAssinaturaResponse = (payload, fallbackPlan = null) => {
  if (!payload) {
    return null;
  }

  const plano =
    payload.plano ||
    payload.plan ||
    payload.categoria_plano ||
    payload.categoria ||
    fallbackPlan ||
    null;
  const planoId =
    payload.plano_id ??
    payload.id_plano ??
    plano?.id ??
    fallbackPlan?.id ??
    null;
  const titulo =
    formatSocioPlanTitle(
      payload.title ||
        payload.nome ||
        payload.nome_plano ||
        plano?.title ||
        fallbackPlan?.title ||
        "",
    ) || null;
  const preco =
    payload.price ||
    payload.valor ||
    payload.preco ||
    plano?.price ||
    fallbackPlan?.price ||
    null;

  return {
    ...payload,
    plano_id: planoId,
    title: titulo,
    nome_plano: titulo,
    price: preco,
    status: payload.status || payload.situacao || "ativa",
    plan: plano,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: PlanGlassCard
// Card de plano com arquitetura de vidro líquido idêntica ao CardActionGlass,
// adaptada ao layout horizontal (texto à esquerda, imagem à direita).
// Recebe shimmerAnim e floatAnim COMPARTILHADOS do pai — evita N loops de
// animação simultâneos quando há múltiplos planos (otimização de performance).
// Recebe também DS e cardStyles do pai para refletir o tema ativo.
// ═══════════════════════════════════════════════════════════════════════════════
const PlanGlassCard = memo(
  ({ plan, onVerMais, shimmerAnim, floatAnim, DS, cardStyles }) => {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        friction: 7,
      }).start();
    };
    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    };

    const shimmerX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-(SCREEN_WIDTH * 1.1), SCREEN_WIDTH * 1.1],
    });

    return (
      <Animated.View
        style={[
          cardStyles.outerContainer,
          { transform: [{ scale: pressAnim }] },
        ]}
      >
        {/* ── Corpo de vidro (overflow:hidden) ────────────────────────────── */}
        <View style={cardStyles.glassBody}>
          {/* G1: BlurView primário */}
          <BlurView
            intensity={52}
            tint={DS.blurTint}
            style={StyleSheet.absoluteFill}
          />

          {/* G2: BlurView secundário — profundidade adicional */}
          <BlurView
            intensity={16}
            tint={DS.blurTint}
            style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
          />

          {/* G3: Tom base do vidro + tinta de identidade do plano (sutil) */}
          <LinearGradient
            colors={[
              `${plan.cardColor || DS.accent}1A`,
              "rgba(255,255,255,0.03)",
              "rgba(0,0,0,0.10)",
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* G4: Reflexo ambiental superior-esquerdo */}
          <LinearGradient
            colors={DS.cardReflectionColors}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 0.55 }}
          />

          {/* G5: Vignette inferior — espessura do vidro */}
          <LinearGradient
            colors={DS.cardVignetteColors}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
          />

          {/* G6: Shimmer diagonal — Animated.Value compartilhado */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -130,
              bottom: -130,
              width: SCREEN_WIDTH * 0.28,
              transform: [{ translateX: shimmerX }, { skewX: "-18deg" }],
            }}
          >
            <LinearGradient
              colors={DS.cardShimmerColors}
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
                <BlurView
                  intensity={20}
                  tint={DS.blurTint}
                  style={StyleSheet.absoluteFill}
                />
                <View style={cardStyles.buttonSpecular} />
                <View style={cardStyles.buttonBorder} />
                <Text style={cardStyles.verMaisText}>VER MAIS</Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={DS.text}
                  style={{ marginLeft: 6 }}
                />
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
            colors={DS.specularTopColors}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        {/* E2: Rim light esquerdo */}
        <View pointerEvents="none" style={cardStyles.rimLeftWrap}>
          <LinearGradient
            colors={DS.rimLeftColors}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>

        {/* E3: Franja cromática inferior */}
        <View pointerEvents="none" style={cardStyles.chromaBottomWrap}>
          <LinearGradient
            colors={DS.chromaBottomColors}
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
  },
);

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: GlassBottomSheet
// Modal de detalhes do plano transformado em bottom-sheet de vidro líquido.
// Recebe DS e sheetStyles do pai para refletir o tema ativo.
// ═══════════════════════════════════════════════════════════════════════════════
const GlassBottomSheet = memo(
  ({ visible, plan, onClose, onAssinar, DS, sheetStyles }) => {
    const benefitsCount = Array.isArray(plan?.beneficios)
      ? plan.beneficios.length
      : 0;
    const hasExtendedBenefits = benefitsCount > 7;

    return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      {/* ── Backdrop com blur escuro (não sólido) ─────────────────────────── */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={sheetStyles.backdrop}>
          <BlurView
            intensity={35}
            tint={DS.blurTint}
            style={StyleSheet.absoluteFill}
          />
          <View style={sheetStyles.backdropTint} />
        </View>
      </TouchableWithoutFeedback>

      {/* ── Painel translúcido (bottom sheet) ─────────────────────────────── */}
      <View style={sheetStyles.sheetWrap}>
        <View style={sheetStyles.sheetBody}>
          <BlurView
            intensity={55}
            tint={DS.blurTint}
            style={StyleSheet.absoluteFill}
          />
          <BlurView
            intensity={18}
            tint={DS.blurTint}
            style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
          />

          <LinearGradient
            colors={DS.sheetGradientColors}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Handle de arraste */}
          <View style={sheetStyles.handle} />

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Título */}
            <Text style={sheetStyles.modalPlanTitle}>{plan?.title}</Text>
            <Text style={sheetStyles.modalPlanDescription}>
              {plan?.description}
            </Text>

            {/* Imagem ilustrativa do cartão */}
            <View
              style={[
                sheetStyles.imageWrap,
                hasExtendedBenefits && {
                  height: 120,
                  marginVertical: 16,
                },
              ]}
            >
              <View style={sheetStyles.imageGlowModal} />
              <Image
                source={plan?.cardImage}
                style={sheetStyles.modalCardImage}
                resizeMode="contain"
              />
            </View>

            {/* Benefícios */}
            <Text style={sheetStyles.beneficiosTitle}>Benefícios</Text>
            <View
              style={[
                sheetStyles.beneficiosList,
                hasExtendedBenefits && {
                  maxHeight: 240,
                  marginBottom: 18,
                },
              ]}
            >
              {(Array.isArray(plan?.beneficios) ? plan.beneficios : []).map(
                (beneficio, index) => (
                  <View
                    key={index}
                    style={[
                      sheetStyles.beneficioItem,
                      index === (plan?.beneficios?.length || 0) - 1 && {
                        marginBottom: 8,
                      },
                    ]}
                  >
                    <View style={sheetStyles.bulletDot} />
                    <Text style={sheetStyles.beneficioText}>{beneficio}</Text>
                  </View>
                ),
              )}
            </View>

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* ── Rodapé fixo: preço + botões glass ───────────────────────── */}
          <View style={sheetStyles.modalFooter}>
            <View style={sheetStyles.footerTopLine} />
            <View style={sheetStyles.footerRow}>
              <Text style={sheetStyles.modalPrice}>
                {formatBRL(parsePlanoValor(plan?.price))}
              </Text>

              <View style={sheetStyles.modalButtons}>
                {/* Fechar — glass neutro */}
                <TouchableOpacity
                  style={sheetStyles.fecharButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <BlurView
                    intensity={20}
                    tint={DS.blurTint}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={sheetStyles.fecharBorder} />
                  <Text style={sheetStyles.fecharButtonText}>Fechar</Text>
                </TouchableOpacity>

                {/* Assinar — glass com acento crimson */}
                <TouchableOpacity
                  style={sheetStyles.assinarButton}
                  activeOpacity={0.85}
                  onPress={() => onAssinar && onAssinar(plan)}
                >
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
              colors={DS.sheetSpecularColors}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
        </View>
      </View>
    </Modal>
    );
  },
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: SociosScreen
// ═══════════════════════════════════════════════════════════════════════════════
export default function SociosScreen({ navigation }) {
  const { isDark } = useTheme();
  const DS = useMemo(() => (isDark ? DARK_DS : LIGHT_DS), [isDark]);
  const cardStyles = useMemo(() => makeCardStyles(DS), [DS]);
  const sheetStyles = useMemo(() => makeSheetStyles(DS), [DS]);
  const mainStyles = useMemo(() => makeMainStyles(DS), [DS]);

  // ── Lógica original — 100% preservada ────────────────────────────────────
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [planos, setPlanos] = useState(FALLBACK_PLANOS);

  const { token, demoMode } = useAuth();
  const { refreshProducts } = useProducts();
  const { syncSubscription, confirmSubscription } = useSubscription();

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlan(null);
  };
  const closeCheckout = useCallback(() => {
    setCheckoutVisible(false);
    setCheckoutPlan(null);
  }, []);

  const startSubscriptionCheckout = useCallback((plan) => {
    if (!plan) {
      return;
    }

    setCheckoutPlan(plan);
    setModalVisible(false);
    setSelectedPlan(null);
    setCheckoutVisible(true);
  }, []);

  const refreshMinhaAssinatura = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      return await syncSubscription({
        providedToken: token,
        retries: 2,
      });
    } catch (error) {
      if (error?.message) {
        Alert.alert("Não foi possível carregar sua assinatura", error.message);
      }

      return null;
    }
  }, [syncSubscription, token]);

  useEffect(() => {
    let cancelled = false;

    const loadPlanos = async () => {
      try {
        const response = await getPlanos();
        const list = Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
            ? response
            : [];

        if (!cancelled && list.length > 0) {
          const normalized = list.map((plan) => normalizePlano(plan));
          setPlanos(normalized);
        }
      } catch (error) {
        if (!cancelled) {
          setPlanos(FALLBACK_PLANOS);
        }
      }
    };

    loadPlanos();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleConfirmSubscription = useCallback(async () => {
    if (!checkoutPlan) {
      throw new Error("Nenhum plano selecionado.");
    }

    if (demoMode && !token) {
      confirmSubscription(checkoutPlan);
      await refreshProducts().catch(() => {});

      const checkoutResult = normalizeAssinaturaResponse(
        { plano_id: checkoutPlan.id, status: "ativa", demo: true },
        checkoutPlan,
      );

      return {
        ...checkoutResult,
        total: parsePlanoValor(checkoutPlan.price),
      };
    }

    if (!token) {
      const error = new Error("Usuário não autenticado.");
      error.status = 401;
      throw error;
    }

    const planoId = Number(checkoutPlan.id);

    if (!Number.isFinite(planoId)) {
      const error = new Error("Plano inválido.");
      error.status = 400;
      throw error;
    }

    await assinarPlano(planoId, token);
    const assinaturaFinal = await syncSubscription({
      providedToken: token,
      expectedPlanId: planoId,
      retries: 4,
    });

    await refreshProducts().catch(() => {});

    const checkoutResult = normalizeAssinaturaResponse(
      assinaturaFinal || { plano_id: planoId, status: "ativa" },
      checkoutPlan,
    );

    return {
      ...checkoutResult,
      total: parsePlanoValor(checkoutPlan.price),
    };
  }, [
    checkoutPlan,
    confirmSubscription,
    demoMode,
    refreshProducts,
    syncSubscription,
    token,
  ]);

  useFocusEffect(
    useCallback(() => {
      refreshMinhaAssinatura();
    }, [refreshMinhaAssinatura]),
  );
  // ── fim lógica original ───────────────────────────────────────────────────

  // ── Animações compartilhadas (otimização: 1 loop em vez de N) ────────────
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const visiblePlanos = useMemo(() => {
    const source =
      Array.isArray(planos) && planos.length > 0 ? planos : FALLBACK_PLANOS;
    return source.filter((plan) => {
      const tier = String(plan?.tier || "")
        .trim()
        .toLowerCase();
      const title = String(plan?.title || plan?.nome || "")
        .trim()
        .toLowerCase();
      return tier !== "nao-socio" && !/na[o?]\s*s[o?]cio/i.test(title);
    });
  }, [planos]);

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.delay(3800),
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
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
        {/* Título "PLANOS sócio-Torcedor" */}
        <View style={mainStyles.titleContainer}>
          <Text style={mainStyles.titleLine1}>PLANOS</Text>
          <View style={mainStyles.titleLine2}>
            <Text style={mainStyles.titleSocio}>sócio-</Text>
            <Text style={mainStyles.titleTorcedor}>Torcedor</Text>
          </View>
        </View>

        {/* ─────────── Lista de cards de planos (Liquid Glass) ─────────── */}
        {visiblePlanos.map((plan) => (
          <PlanGlassCard
            key={plan.id}
            plan={plan}
            onVerMais={() => openModal(plan)}
            shimmerAnim={shimmerAnim}
            floatAnim={floatAnim}
            DS={DS}
            cardStyles={cardStyles}
          />
        ))}

        {/* Rodapé informativo */}
        <View style={mainStyles.footerNote}>
          <View style={mainStyles.footerLine} />
          <Text style={mainStyles.footerText}>
            Torcer é mais que acompanhar um jogo.{"\n"}É fazer parte de uma
            torcida apaixonada.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ═══════════ MODAL / BOTTOM SHEET DE DETALHES DO PLANO ═══════════ */}
      <GlassBottomSheet
        visible={modalVisible}
        plan={selectedPlan}
        onClose={closeModal}
        onAssinar={startSubscriptionCheckout}
        DS={DS}
        sheetStyles={sheetStyles}
      />

      <CheckoutModal
        visible={checkoutVisible}
        onClose={closeCheckout}
        purchaseType="subscription"
        items={
          checkoutPlan ? [buildSubscriptionCheckoutItem(checkoutPlan)] : []
        }
        total={parsePlanoValor(checkoutPlan?.price)}
        onConfirm={handleConfirmSubscription}
        onSuccessAction={closeCheckout}
      />
    </View>
  );
}
