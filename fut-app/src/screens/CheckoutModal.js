/**
 * CheckoutModal
 * ─────────────────────────────────────────────────────────────────────────
 * Modal de checkout premium "Liquid Glass" para o Drakos FC.
 *
 * Substitui o Alert.alert de confirmação de compra da CarrinhosScreen por
 * um fluxo completo dentro do próprio app:
 *
 *   1. RESUMO   → lista os itens do carrinho (reaproveita cartItems/subtotal)
 *   2. PAGAMENTO → {resolveCopyValue(checkoutCopy.paymentMethodCard, { purchaseType })} (com cartão 3D ao vivo) ou PIX (QR simulado)
 *   3. SUCESSO   → estado de confirmação após addToPurchaseHistory + clearCart
 *
 * Este componente é AUTÔNOMO: não depende de nenhum arquivo de estilo/tema
 * externo além do que é passado via props, para não acoplar em arquivos que
 * não foram fornecidos (styleCarrinhos.js, dataCarrinhos.js). Os tokens de
 * cor abaixo replicam a identidade visual já estabelecida no projeto
 * (fundo #070707–#0a0a0a, crimson #c0000a/#e8000f, vidro líquido).
 *
 * Props:
 *   visible              – boolean, controla a visibilidade do modal
 *   onClose              – () => void, fecha o modal (X / voltar / backdrop)
 *   cartItems             – itens do carrinho (mesmo formato usado em CarrinhosScreen)
 *   total                 – valor total (subtotal) já calculado
 *   onConfirmPurchase     – () => void — chamado quando o pagamento é confirmado.
 *                           Deve encapsular addToPurchaseHistory(cartItems, total)
 *                           + clearCart(), mantendo essa lógica na screen/contexto,
 *                           não dentro deste componente.
 *   onGoToShop            – () => void — navega para a Loja a partir da tela de sucesso
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

let Clipboard = null;
try {
  // Dependência opcional: se expo-clipboard já estiver instalado no projeto,
  // o botão "copiar código PIX" funciona de verdade. Caso contrário, cai
  // graciosamente para um feedback visual sem crashar o app.
  // eslint-disable-next-line global-require
  Clipboard = require('expo-clipboard');
} catch (e) {
  Clipboard = null;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Tokens visuais (espelham a identidade Drakos FC já estabelecida) ──────
const DS = {
  bg0: '#070707',
  bg1: '#0a0a0a',
  crimson: '#c0000a',
  crimsonBright: '#e8000f',
  crimsonVivid: '#E23A2E',
  white: '#ffffff',
  textPrimary: 'rgba(255,255,255,0.94)',
  textSecondary: 'rgba(255,255,255,0.58)',
  textTertiary: 'rgba(255,255,255,0.38)',
  glassFillTop: 'rgba(255,255,255,0.12)',
  glassFillBottom: 'rgba(255,255,255,0.04)',
  borderOuter: 'rgba(255,255,255,0.14)',
  borderInner: 'rgba(255,255,255,0.07)',
  success: '#3ddc84',
};

// ─── Helpers de máscara ─────────────────────────────────────────────────────
const maskCardNumber = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const maskValidade = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const maskCVV = (raw) => raw.replace(/\D/g, '').slice(0, 4);

const detectBrand = (digits) => {
  if (/^4/.test(digits)) return 'VISA';
  if (/^5[1-5]/.test(digits)) return 'MASTERCARD';
  if (/^3[47]/.test(digits)) return 'AMEX';
  if (/^6(?:011|5)/.test(digits)) return 'ELO';
  return 'DRAKOS PAY';
};

const formatBRL = (v) =>
  (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const generatePixCode = (total) => {
  // Código "copia e cola" simulado — formato similar ao EMV do Pix, apenas
  // para fins visuais/estruturais. Não é um payload Pix real.
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const amount = (Number(total) || 0).toFixed(2).replace('.', '');
  return `00020126580014BR.GOV.BCB.PIX0136DRAKOSFC-${rand}5204000053039865406${amount}5802BR5913DRAKOS FC LTDA6009SAOPAULO62070503***6304${rand.slice(0, 4)}`;
};

// ─── Sub-componente: Superfície de vidro genérica ──────────────────────────
// Segue a regra crítica do projeto: container externo (sombra) sem
// overflow:hidden + container interno (clip) só para BlurView/gradientes.
const DEFAULT_CHECKOUT_COPY = {
  product: {
    headerTitleResumo: 'RESUMO DO PEDIDO',
    headerTitlePagamento: 'PAGAMENTO',
    headerTitleSucesso: 'PEDIDO CONFIRMADO',
    summaryCta: 'Ir para pagamento',
    paymentMethodCard: 'Cartão de crédito',
    paymentMethodPix: 'PIX',
    confirmBtnText: 'Confirmar pagamento',
    successTitle: 'Pagamento confirmado',
    successSubtitle: ({ checkoutResult }) =>
      `Pedido #${checkoutResult?.pedido_id ?? '-'} - ${checkoutResult?.status || 'a caminho'}\nSeu pedido foi enviado ao Drakos FC e já estã sendo preparado.`,
    successTotalLabel: 'Total pago',
    successActionText: 'Voltar para a loja',
    successGhostText: 'Fechar',
    summaryItemsLabel: 'Itens',
    summaryShippingLabel: 'Frete',
    summaryShippingValue: 'Grátis',
    summaryTotalLabel: 'Total',
    summaryPlaceholderName: 'Produto sem nome',
    summaryQuantityPrefix: 'Qtd',
    summarySizePrefix: 'Tam',
    confirmationErrorTitle: 'Não foi possível concluir a compra',
    genericErrorTitle: 'Erro no checkout',
  },
  subscription: {
    headerTitleResumo: 'RESUMO DA ASSINATURA',
    headerTitlePagamento: 'PAGAMENTO',
    headerTitleSucesso: 'ASSINATURA CONFIRMADA',
    summaryCta: 'Ir para pagamento',
    paymentMethodCard: 'Cartão de crédito',
    paymentMethodPix: 'PIX',
    confirmBtnText: 'Confirmar assinatura',
    successTitle: 'Assinatura confirmada',
    successSubtitle: ({ checkoutResult }) =>
      `Plano #${checkoutResult?.plano_id ?? '-'} - ${checkoutResult?.status || 'ativa'}\nSua assinatura foi ativada com sucesso.`,
    successTotalLabel: 'Total pago',
    successActionText: 'Voltar para os sócios',
    successGhostText: 'Fechar',
    summaryItemsLabel: 'Itens',
    summaryShippingLabel: 'Taxa',
    summaryShippingValue: 'Inclusa',
    summaryTotalLabel: 'Total',
    summaryPlaceholderName: 'Plano sem nome',
    summaryQuantityPrefix: 'Qtd',
    summarySizePrefix: 'Tam',
    confirmationErrorTitle: 'Não foi possível concluir a assinatura',
    genericErrorTitle: 'Erro no checkout',
  },
};

const resolveCheckoutCopy = (purchaseType, overrides = {}) => ({
  ...(DEFAULT_CHECKOUT_COPY[purchaseType] || DEFAULT_CHECKOUT_COPY.product),
  ...(overrides || {}),
});

const resolveCopyValue = (value, context) => (typeof value === 'function' ? value(context) : value);

const GlassSurface = ({ style, innerStyle, intensity = 42, tint = 'dark', children }) => (
  <View style={[stylesGlass.outer, style]}>
    <View style={[stylesGlass.inner, innerStyle]}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <BlurView
        intensity={Math.max(10, intensity - 26)}
        tint="dark"
        style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
      />
      <LinearGradient
        colors={[DS.glassFillTop, 'rgba(255,255,255,0.02)', DS.glassFillBottom]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={stylesGlass.borderInner} />
      </View>
      {children}
    </View>
    <View style={stylesGlass.borderOuter} pointerEvents="none" />
  </View>
);

const stylesGlass = StyleSheet.create({
  outer: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  inner: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  borderOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 0.75,
    borderColor: DS.borderOuter,
  },
  borderInner: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 23,
    borderWidth: 0.5,
    borderColor: DS.borderInner,
  },
});

// ─── Sub-componente: Step indicator ─────────────────────────────────────────
const StepDots = ({ step }) => {
  const steps = ['resumo', 'pagamento', 'sucesso'];
  const safeSteps = Array.isArray(steps) ? steps : [];
  return (
    <View style={s.stepRow} pointerEvents="none">
      {safeSteps.map((key, idx) => {
        const active = safeSteps.indexOf(step) >= idx;
        return (
          <React.Fragment key={key}>
            <View style={[s.stepDot, active && s.stepDotActive]} />
            {idx < safeSteps.length - 1 && (
              <View style={[s.stepLine, safeSteps.indexOf(step) > idx && s.stepLineActive]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ─── Sub-componente: Cartão 3D ao vivo ──────────────────────────────────────
const LiveCreditCard = ({ number, name, validade, cvv, flipped }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 1 : 0,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [flipped]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const digits = number.replace(/\D/g, '');
  const brand = detectBrand(digits);
  const displayNumber = number.length > 0 ? number.padEnd(19, '•') : '•••• •••• •••• ••••';
  const displayName = name.trim().length > 0 ? name.toUpperCase() : 'NOME NO CARTÃO';
  const displayValidade = validade.length > 0 ? validade.padEnd(5, '•') : 'MM/AA';
  const displayCvv = cvv.length > 0 ? cvv.padEnd(3, '•') : '•••';

  return (
    <View style={s.cardStage}>
      {/* FRENTE */}
      <Animated.View
        style={[
          s.cardFace,
          {
            opacity: frontOpacity,
            transform: [{ perspective: 1200 }, { rotateY: frontRotate }],
          },
        ]}
      >
        <LinearGradient
          colors={['#1a1a1c', DS.bg1, '#050505']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
        <LinearGradient
          colors={['rgba(224,0,15,0.22)', 'transparent']}
          style={[StyleSheet.absoluteFill, { opacity: 0.7 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.6 }}
        />
        <View style={s.cardTopRow}>
          <View style={s.chip}>
            <LinearGradient
              colors={['#e8c976', '#b5924a']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
          <Text style={s.cardBrand}>{brand}</Text>
        </View>
        <Text style={s.cardNumber} numberOfLines={1} adjustsFontSizeToFit>
          {displayNumber}
        </Text>
        <View style={s.cardBottomRow}>
          <View>
            <Text style={s.cardLabel}>TITULAR</Text>
            <Text style={s.cardValue} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
          <View>
            <Text style={s.cardLabel}>VALIDADE</Text>
            <Text style={s.cardValue}>{displayValidade}</Text>
          </View>
        </View>
        <View style={s.cardCrestWrap} pointerEvents="none">
          <Text style={s.cardCrestText}>DRAKOS FC</Text>
        </View>
      </Animated.View>

      {/* VERSO */}
      <Animated.View
        style={[
          s.cardFace,
          s.cardFaceBack,
          {
            opacity: backOpacity,
            transform: [{ perspective: 1200 }, { rotateY: backRotate }],
          },
        ]}
      >
        <LinearGradient
          colors={['#1a1a1c', DS.bg1, '#050505']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
        <View style={s.magStripe} />
        <View style={s.cvvStripRow}>
          <View style={s.cvvSignature}>
            <Text style={s.cvvSignatureText}>Assinatura do titular</Text>
          </View>
          <View style={s.cvvBox}>
            <Text style={s.cvvBoxText}>{displayCvv}</Text>
          </View>
        </View>
        <Text style={s.cardBackNote}>
          Cartão de uso exclusivo Drakos FC · Pagamento simulado
        </Text>
      </Animated.View>
    </View>
  );
};

// ─── Sub-componente: QR Code simulado ──────────────────────────────────────
// Gera um padrão determinístico (não é um QR real/escaneável) só para dar
// a sensação visual correta sem adicionar dependências novas ao projeto.
const SimulatedQRCode = ({ seed = 'drakos' }) => {
  const GRID = 11;
  const cells = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const rand = () => {
      h = (h * 1664525 + 1013904223) >>> 0;
      return h / 4294967295;
    };
    const grid = Array.from({ length: GRID }, () =>
      Array.from({ length: GRID }, () => rand() > 0.52)
    );
    // "Olhos" de QR nos três cantos, para parecer autêntico
    const drawEye = (r0, c0) => {
      for (let r = 0; r < 5; r += 1) {
        for (let c = 0; c < 5; c += 1) {
          const isBorder = r === 0 || r === 4 || c === 0 || c === 4;
          const isCore = r >= 1 && r <= 3 && c >= 1 && c <= 3 && !(r === 2 && c === 2 ? false : false);
          grid[r0 + r][c0 + c] = isBorder || (r === 2 && c === 2);
        }
      }
    };
    drawEye(0, 0);
    drawEye(0, GRID - 5);
    drawEye(GRID - 5, 0);
    return grid;
  }, [seed]);
  const safeCells = Array.isArray(cells) ? cells : [];

  const cellSize = 168 / GRID;

  return (
    <View style={s.qrWrap}>
      <View style={{ width: 168, height: 168 }}>
        {safeCells.map((row, r) => (
          <View key={r} style={{ flexDirection: 'row' }}>
            {(Array.isArray(row) ? row : []).map((on, c) => (
              <View
                key={c}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: on ? '#0a0a0a' : 'transparent',
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Componente principal ───────────────────────────────────────────────────
const CheckoutModal = ({
  visible,
  onClose,
  cartItems = [],
  items,
  total = 0,
  pricingSummary = null,
  planBenefits = [],
  onConfirmPurchase,
  onConfirm,
  onGoToShop,
  onSuccessAction,
  purchaseType = 'product',
  texts = {},
}) => {
  const resolvedItems = Array.isArray(items) ? items : cartItems;
  const safeResolvedItems = Array.isArray(resolvedItems) ? resolvedItems : [];
  const checkoutCopy = resolveCheckoutCopy(purchaseType, texts);
  const confirmAction = onConfirm || onConfirmPurchase;
  const successAction = onSuccessAction || onGoToShop;
  const [step, setStep] = useState('resumo'); // 'resumo' | 'pagamento' | 'sucesso'
  const [method, setMethod] = useState('cartao'); // 'cartao' | 'pix'
  const [processing, setProcessing] = useState(false);

  // Campos do cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardValidade, setCardValidade] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cvvFocused, setCvvFocused] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const previewItems = Array.isArray(pricingSummary?.itens) ? pricingSummary.itens : [];
  const hasPricingPreview = previewItems.length > 0;
  const payableTotal = pricingSummary?.total_final ?? total;
  const subtotalOriginal = pricingSummary?.subtotal_original ?? payableTotal;
  const economiaTotal = pricingSummary?.economia_total ?? 0;

  const pixCode = useMemo(() => generatePixCode(payableTotal), [payableTotal, visible]);
  const [pixCopied, setPixCopied] = useState(false);
  const [pixWaiting, setPixWaiting] = useState(false);

  // ── Animações de entrada/saída do modal (instâncias compartilhadas) ──────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
  const successPop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setStep('resumo');
      setMethod('cartao');
      setProcessing(false);
      setCheckoutResult(null);
      setPixCopied(false);
      setPixWaiting(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(SCREEN_H);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 68,
          friction: 14,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (step === 'sucesso') {
      successPop.setValue(0);
      Animated.spring(successPop, {
        toValue: 1,
        tension: 120,
        friction: 9,
        useNativeDriver: true,
      }).start();
    }
  }, [step]);

  const handleRequestClose = useCallback(() => {
    if (processing) return;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_H,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose && onClose();
    });
  }, [processing, onClose]);

  const cardValid =
    cardNumber.replace(/\D/g, '').length >= 13 &&
    cardName.trim().length > 2 &&
    cardValidade.length === 5 &&
    cardCvv.length >= 3;

  const handleCopyPix = useCallback(async () => {
    try {
      if (Clipboard && Clipboard.setStringAsync) {
        await Clipboard.setStringAsync(pixCode);
      }
    } catch (e) {
      // Silencioso: se o módulo de clipboard não existir, ainda damos feedback visual
    }
    setPixCopied(true);
    setPixWaiting(true);
    setTimeout(() => setPixCopied(false), 2200);
  }, [pixCode]);

  const handleConfirm = useCallback(async () => {
    if (processing) return;
    if (method === 'cartao' && !cardValid) return;

    setProcessing(true);
    try {
      const response = confirmAction ? await confirmAction() : null;
      setCheckoutResult(response || null);
      setProcessing(false);
      setStep('sucesso');
    } catch (error) {
      setProcessing(false);
      if (error?.status === 400 || error?.status === 404) {
        Alert.alert(resolveCopyValue(checkoutCopy.confirmationErrorTitle, { purchaseType }), error.message);
      } else if (error?.message) {
        Alert.alert(resolveCopyValue(checkoutCopy.genericErrorTitle, { purchaseType }), error.message);
      }
    }
  }, [processing, method, cardValid, confirmAction, checkoutCopy, purchaseType]);

  const itemsCount = safeResolvedItems.reduce((acc, it) => acc + (it.quantity || it.quantidade || 1), 0);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleRequestClose} statusBarTranslucent>
      <View style={s.root}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleRequestClose}>
          <Animated.View style={[StyleSheet.absoluteFill, s.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        {/* Painel */}
        <Animated.View
          style={[
            s.panel,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <GlassSurface style={s.panelGlassOuter} innerStyle={s.panelGlassInner} intensity={46}>
            {/* Header */}
            <View style={s.header}>
              <View style={s.headerHandle} />
              <View style={s.headerRow}>
                <View style={{ width: 34 }} />
                <Text style={s.headerTitle}>
                  {step === 'resumo' && resolveCopyValue(checkoutCopy.headerTitleResumo, { purchaseType })}
                  {step === 'pagamento' && resolveCopyValue(checkoutCopy.headerTitlePagamento, { purchaseType })}
                  {step === 'sucesso' && resolveCopyValue(checkoutCopy.headerTitleSucesso, { purchaseType })}
                </Text>
                <TouchableOpacity
                  onPress={handleRequestClose}
                  style={s.closeBtn}
                  disabled={processing}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={18} color={DS.textPrimary} />
                </TouchableOpacity>
              </View>
              {step !== 'sucesso' && <StepDots step={step} />}
            </View>

            {/* ── STEP: RESUMO ─────────────────────────────────────────── */}
            {step === 'resumo' && (
              <View style={s.stepBody}>
                <ScrollView
                  style={{ maxHeight: SCREEN_H * 0.42 }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 6 }}
                >
                  {(hasPricingPreview ? previewItems : safeResolvedItems).map((item) => {
                    const img = Array.isArray(item.imagens) && item.imagens.length > 0
                      ? item.imagens[0]
                      : item.imagem_produtos || item.imagem || item.image || item.capa || item.foto || item.imagem_plano || null;
                    const imgSource = typeof img === 'string' ? { uri: img } : img;
                    return (
                      <View key={`${item.id || item.plano_id || item.nome}-${item.tamanho || item.size || item.quantidade || item.quantity || 0}`} style={s.summaryRow}>
                        <View style={s.summaryImgWrap}>
                          {imgSource ? (
                            <Image source={imgSource} style={s.summaryImg} resizeMode="cover" />
                          ) : (
                            <View style={[s.summaryImg, s.summaryImgPlaceholder]}>
                              <Ionicons name="shirt-outline" size={18} color="rgba(255,255,255,0.3)" />
                            </View>
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.summaryName} numberOfLines={1}>
                            {item.nome_produtos || item.nome || item.nome_plano || item.title || checkoutCopy.summaryPlaceholderName}
                          </Text>
                          <Text style={s.summaryMeta}>
                            {(item.tamanho || item.size) ? `${checkoutCopy.summarySizePrefix} ${item.tamanho || item.size} ? ` : ""}{checkoutCopy.summaryQuantityPrefix} {item.quantity || item.quantidade || 1}
                          </Text>
                          {hasPricingPreview ? (
                            <View style={s.summaryPricingMeta}>
                              <Text style={s.summaryPriceLine}>
                                Original: {formatBRL(item.preco_original_total ?? item.preco_original_unitario ?? item.preco_original ?? 0)}
                              </Text>
                              <Text style={s.summaryPriceLine}>
                                Final: {formatBRL(item.preco_final_total ?? item.preco_final_unitario ?? item.preco_final ?? 0)}
                              </Text>
                              {item.economia_total != null ? (
                                <Text style={s.summaryPriceLine}>
                                  Economia: {formatBRL(item.economia_total)}
                                </Text>
                              ) : null}
                              {Number(item.desconto_percent || 0) > 0 ? (
                                <Text style={s.summaryPriceBadge}>{item.desconto_percent}% OFF</Text>
                              ) : null}
                            </View>
                          ) : null}
                        </View>
                        <Text style={s.summaryPrice}>
                          {formatBRL(item.preco_final_total ?? item.total ?? item.preco ?? item.valor ?? 0)}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={s.divider} />

                <View style={s.totalsBlock}>
                  <View style={s.totalsLine}>
                    <Text style={s.totalsLabel}>{checkoutCopy.summaryItemsLabel} ({itemsCount})</Text>
                    <Text style={s.totalsValue}>{formatBRL(payableTotal)}</Text>
                  </View>
                  <View style={s.totalsLine}>
                    <Text style={s.totalsLabel}>{checkoutCopy.summaryShippingLabel}</Text>
                    <Text style={[s.totalsValue, { color: DS.success }]}>{checkoutCopy.summaryShippingValue}</Text>
                  </View>
                  {pricingSummary?.subtotal_original != null ? (
                    <View style={s.totalsLine}>
                      <Text style={s.totalsLabel}>Subtotal original</Text>
                      <Text style={s.totalsValueMuted}>{formatBRL(subtotalOriginal)}</Text>
                    </View>
                  ) : null}
                  {pricingSummary?.desconto_total != null ? (
                    <View style={s.totalsLine}>
                      <Text style={s.totalsLabel}>Desconto aplicado</Text>
                      <Text style={s.totalsValueSavings}>{formatBRL(pricingSummary.desconto_total)}</Text>
                    </View>
                  ) : null}
                  {pricingSummary?.economia_total != null ? (
                    <View style={s.totalsLine}>
                      <Text style={s.totalsLabel}>Economia total</Text>
                      <Text style={s.totalsValueSavings}>{formatBRL(economiaTotal)}</Text>
                    </View>
                  ) : null}
                <View style={[s.totalsLine, { marginTop: 6 }]}>
                    <Text style={s.grandLabel}>{checkoutCopy.summaryTotalLabel}</Text>
                    <Text style={s.grandValue}>{formatBRL(payableTotal)}</Text>
                  </View>
                </View>

                {Array.isArray(planBenefits) && planBenefits.length > 0 ? (
                  <View style={s.planBenefitsCard}>
                    <Text style={s.planBenefitsTitle}>Benefícios do plano</Text>
                    {planBenefits.map((benefit, index) => (
                      <View key={`${String(benefit)}-${index}`} style={s.planBenefitLine}>
                        <Ionicons name="checkmark-circle" size={14} color={DS.success} />
                        <Text style={s.planBenefitText}>{String(benefit)}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                <TouchableOpacity
                  style={s.primaryBtn}
                  activeOpacity={0.88}
                  onPress={() => setStep('pagamento')}
                >
                  <LinearGradient
                    colors={[DS.crimsonBright, DS.crimson]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Text style={s.primaryBtnText}>{resolveCopyValue(checkoutCopy.summaryCta, { purchaseType })}</Text>
                  <Ionicons name="arrow-forward" size={17} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* ── STEP: PAGAMENTO ──────────────────────────────────────── */}
            {step === 'pagamento' && (
              <ScrollView
                style={{ maxHeight: SCREEN_H * 0.62 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.stepBody}
                keyboardShouldPersistTaps="handled"
              >
                {/* Seletor de método */}
                <View style={s.methodSwitch}>
                  <TouchableOpacity
                    style={[s.methodBtn, method === 'cartao' && s.methodBtnActive]}
                    onPress={() => setMethod('cartao')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="card-outline"
                      size={16}
                      color={method === 'cartao' ? '#fff' : DS.textSecondary}
                    />
                    <Text style={[s.methodBtnText, method === 'cartao' && s.methodBtnTextActive]}>
                      {resolveCopyValue(checkoutCopy.paymentMethodCard, { purchaseType })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.methodBtn, method === 'pix' && s.methodBtnActive]}
                    onPress={() => setMethod('pix')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="qr-code-outline"
                      size={16}
                      color={method === 'pix' ? '#fff' : DS.textSecondary}
                    />
                    <Text style={[s.methodBtnText, method === 'pix' && s.methodBtnTextActive]}>
                      {resolveCopyValue(checkoutCopy.paymentMethodPix, { purchaseType })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {method === 'cartao' ? (
                  <View>
                    <LiveCreditCard
                      number={cardNumber}
                      name={cardName}
                      validade={cardValidade}
                      cvv={cardCvv}
                      flipped={cvvFocused}
                    />

                    <View style={s.fieldGroup}>
                      <Text style={s.fieldLabel}>Número do cartão</Text>
                      <TextInput
                        style={s.input}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor={DS.textTertiary}
                        keyboardType="number-pad"
                        value={cardNumber}
                        onChangeText={(t) => setCardNumber(maskCardNumber(t))}
                        maxLength={19}
                      />
                    </View>

                    <View style={s.fieldGroup}>
                      <Text style={s.fieldLabel}>Nome impresso no cartão</Text>
                      <TextInput
                        style={s.input}
                        placeholder="Como está no cartão"
                        placeholderTextColor={DS.textTertiary}
                        autoCapitalize="characters"
                        value={cardName}
                        onChangeText={setCardName}
                      />
                    </View>

                    <View style={s.fieldRow}>
                      <View style={[s.fieldGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={s.fieldLabel}>Validade</Text>
                        <TextInput
                          style={s.input}
                          placeholder="MM/AA"
                          placeholderTextColor={DS.textTertiary}
                          keyboardType="number-pad"
                          value={cardValidade}
                          onChangeText={(t) => setCardValidade(maskValidade(t))}
                          maxLength={5}
                        />
                      </View>
                      <View style={[s.fieldGroup, { flex: 1 }]}>
                        <Text style={s.fieldLabel}>CVV</Text>
                        <TextInput
                          style={s.input}
                          placeholder="•••"
                          placeholderTextColor={DS.textTertiary}
                          keyboardType="number-pad"
                          secureTextEntry
                          value={cardCvv}
                          onChangeText={(t) => setCardCvv(maskCVV(t))}
                          onFocus={() => setCvvFocused(true)}
                          onBlur={() => setCvvFocused(false)}
                          maxLength={4}
                        />
                      </View>
                    </View>

                    <View style={s.secureNote}>
                      <Ionicons name="lock-closed-outline" size={13} color={DS.textTertiary} />
                      <Text style={s.secureNoteText}>
                        Pagamento simulado. Nenhum dado de cartão é armazenado.
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={s.pixWrap}>
                    <SimulatedQRCode seed={pixCode} />

                    <Text style={s.pixHint}>
                      Escaneie o QR Code no app do seu banco ou copie o código abaixo.
                    </Text>

                    <View style={s.pixCodeBox}>
                      <Text style={s.pixCodeText} numberOfLines={2}>
                        {pixCode}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={s.pixCopyBtn}
                      activeOpacity={0.85}
                      onPress={handleCopyPix}
                    >
                      <Ionicons
                        name={pixCopied ? 'checkmark' : 'copy-outline'}
                        size={16}
                        color={DS.textPrimary}
                      />
                      <Text style={s.pixCopyText}>
                        {pixCopied ? 'Código copiado!' : 'Copiar código PIX'}
                      </Text>
                    </TouchableOpacity>

                    {pixWaiting && (
                      <View style={s.pixWaitingRow}>
                        <View style={s.pixWaitingDot} />
                        <Text style={s.pixWaitingText}>Aguardando pagamento…</Text>
                      </View>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    s.primaryBtn,
                    { marginTop: 22 },
                    method === 'cartao' && !cardValid && s.primaryBtnDisabled,
                  ]}
                  activeOpacity={0.88}
                  onPress={handleConfirm}
                  disabled={processing || (method === 'cartao' && !cardValid)}
                >
                  {!(method === 'cartao' && !cardValid) && (
                    <LinearGradient
                      colors={[DS.crimsonBright, DS.crimson]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  {processing ? (
                    <Text style={s.primaryBtnText}>
                      {purchaseType === 'subscription' ? 'Atualizando assinatura…' : 'Processando…'}
                    </Text>
                  ) : (
                    <>
                      <Text style={s.primaryBtnText}>{resolveCopyValue(checkoutCopy.confirmBtnText, { purchaseType })}</Text>
                      <Text style={s.primaryBtnTotal}>{formatBRL(payableTotal)}</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.backLink}
                  onPress={() => setStep('resumo')}
                  disabled={processing}
                >
                  <Ionicons name="chevron-back" size={14} color={DS.textSecondary} />
                  <Text style={s.backLinkText}>Voltar ao resumo</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {/* ── STEP: SUCESSO ────────────────────────────────────────── */}
            {step === 'sucesso' && (
              <View style={[s.stepBody, s.successBody]}>
                <Animated.View
                  style={[
                    s.successIconWrap,
                    {
                      transform: [
                        {
                          scale: successPop.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.4, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(61,220,132,0.28)', 'rgba(61,220,132,0.06)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0.2, y: 0 }}
                    end={{ x: 0.8, y: 1 }}
                  />
                  <Ionicons name="checkmark" size={40} color={DS.success} />
                </Animated.View>

                <Text style={s.successTitle}>{resolveCopyValue(checkoutCopy.successTitle, { purchaseType })}</Text>
                <Text style={s.successSubtitle}>
                  {resolveCopyValue(checkoutCopy.successSubtitle, {
                    purchaseType,
                    checkoutResult,
                    total,
                    items: safeResolvedItems,
                    itemsCount,
                  })}
                </Text>

                <View style={s.successTotalPill}>
                  <Text style={s.successTotalLabel}>{resolveCopyValue(checkoutCopy.successTotalLabel, { purchaseType })}</Text>
                  <Text style={s.successTotalValue}>
                    {formatBRL(checkoutResult?.total ?? payableTotal)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[s.primaryBtn, { marginTop: 28 }]}
                  activeOpacity={0.88}
                  onPress={() => {
                    handleRequestClose();
                    successAction && successAction();
                  }}
                >
                  <LinearGradient
                    colors={[DS.crimsonBright, DS.crimson]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Text style={s.primaryBtnText}>{resolveCopyValue(checkoutCopy.successActionText, { purchaseType })}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.ghostBtn} onPress={handleRequestClose} activeOpacity={0.7}>
                  <Text style={s.ghostBtnText}>{resolveCopyValue(checkoutCopy.successGhostText, { purchaseType })}</Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassSurface>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CheckoutModal;

// ─── Estilos ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  panel: {
    width: '100%',
    maxHeight: SCREEN_H * 0.9,
  },
  panelGlassOuter: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  panelGlassInner: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: DS.bg0,
  },

  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: DS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 14,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  stepDotActive: {
    backgroundColor: DS.crimsonVivid,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepLine: {
    width: 26,
    height: 1,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  stepLineActive: {
    backgroundColor: DS.crimsonVivid,
  },

  stepBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 22,
  },

  // Resumo
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryImgWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  summaryImg: {
    width: '100%',
    height: '100%',
  },
  summaryImgPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryName: {
    color: DS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryMeta: {
    color: DS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  summaryPrice: {
    color: DS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
  },
  summaryPricingMeta: {
    marginTop: 6,
  },
  summaryPriceLine: {
    color: DS.textSecondary,
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
  },
  summaryPriceBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(224,0,15,0.12)',
    color: DS.discountText,
    fontSize: 10.5,
    fontWeight: '700',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
  },

  totalsBlock: {
    marginTop: 12,
  },
  totalsLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalsLabel: {
    color: DS.textSecondary,
    fontSize: 13,
  },
  totalsValue: {
    color: DS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  totalsValueMuted: {
    color: DS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  totalsValueSavings: {
    color: DS.success,
    fontSize: 13,
    fontWeight: '700',
  },
  grandLabel: {
    color: DS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  grandValue: {
    color: DS.crimsonVivid,
    fontSize: 19,
    fontWeight: '800',
  },
  planBenefitsCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  planBenefitsTitle: {
    color: DS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  planBenefitLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  planBenefitText: {
    flex: 1,
    color: DS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
  },

  primaryBtn: {
    height: 54,
    borderRadius: 16,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
  },
  primaryBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryBtnTotal: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  backLinkText: {
    color: DS.textSecondary,
    fontSize: 13,
  },

  // Método de pagamento
  methodSwitch: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  methodBtnActive: {
    backgroundColor: DS.crimson,
  },
  methodBtnText: {
    color: DS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  methodBtnTextActive: {
    color: '#fff',
  },

  // Cartão 3D
  cardStage: {
    height: 196,
    marginBottom: 22,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 18,
    padding: 20,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardFaceBack: {
    justifyContent: 'flex-start',
    paddingTop: 22,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardBrand: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 26,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    maxWidth: 150,
  },
  cardCrestWrap: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cardCrestText: {
    color: 'rgba(224,0,15,0.55)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  magStripe: {
    height: 40,
    marginHorizontal: -20,
    backgroundColor: '#111113',
    marginTop: 4,
  },
  cvvStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    gap: 10,
  },
  cvvSignature: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  cvvSignatureText: {
    color: 'rgba(0,0,0,0.35)',
    fontSize: 10,
    fontStyle: 'italic',
  },
  cvvBox: {
    width: 48,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cvvBoxText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cardBackNote: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 10,
    marginTop: 18,
  },

  // Campos
  fieldGroup: {
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: 'row',
  },
  fieldLabel: {
    color: DS.textSecondary,
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 7,
    letterSpacing: 0.3,
  },
  input: {
    height: 50,
    borderRadius: 13,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.1)',
    color: DS.textPrimary,
    fontSize: 14.5,
  },

  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 6,
  },
  secureNoteText: {
    color: DS.textTertiary,
    fontSize: 11,
  },

  // PIX
  pixWrap: {
    alignItems: 'center',
  },
  qrWrap: {
    width: 190,
    height: 190,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pixHint: {
    color: DS.textSecondary,
    fontSize: 12.5,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  pixCodeBox: {
    width: '100%',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    marginBottom: 14,
  },
  pixCodeText: {
    color: DS.textSecondary,
    fontSize: 11.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pixCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    width: '100%',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.09)',
    gap: 8,
  },
  pixCopyText: {
    color: DS.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  pixWaitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 8,
  },
  pixWaitingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#f5a623',
  },
  pixWaitingText: {
    color: '#f5a623',
    fontSize: 12.5,
    fontWeight: '600',
  },

  // Sucesso
  successBody: {
    alignItems: 'center',
    paddingTop: 12,
  },
  successIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: 'rgba(61,220,132,0.4)',
    marginBottom: 20,
  },
  successTitle: {
    color: DS.textPrimary,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  successSubtitle: {
    color: DS.textSecondary,
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 19,
  },
  successTotalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  successTotalLabel: {
    color: DS.textSecondary,
    fontSize: 12,
  },
  successTotalValue: {
    color: DS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  ghostBtn: {
    marginTop: 14,
    paddingVertical: 10,
  },
  ghostBtnText: {
    color: DS.textTertiary,
    fontSize: 13,
  },
});
