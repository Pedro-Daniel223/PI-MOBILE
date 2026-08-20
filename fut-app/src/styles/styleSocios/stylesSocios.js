import { StyleSheet, Dimensions, Platform } from 'react-native';
import { platformPick } from '../platformUiTokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Tokens Light/Dark (Liquid Glass) — SociosScreen
// Segue o mesmo padrão adotado em PerfilScreen: useColorScheme() + makeStyles(DS)
// via useMemo. DARK_DS mantém EXATAMENTE os valores originais já usados nesta
// tela (o objeto DS previamente hardcoded no componente). LIGHT_DS é um
// conjunto de tokens novo e paralelo, inspirado na paleta que já existia em
// stylesSocio.js (fundo #f5f5f5, título serifado #8b0000/#000 etc.), adaptado
// ao mesmo shape de tokens do DARK_DS para que os três StyleSheet.create
// (cardStyles, sheetStyles, mainStyles) funcionem identicamente em ambos os
// temas.
// ─────────────────────────────────────────────────────────────────────────────
export const DARK_DS = {
  scheme: 'dark',
  blurTint: 'dark',
  statusBarStyle: 'light-content',

  bg: '#0a0a0a',
  bgElevated: '#121212',
  accent: '#c0000a',
  accentBright: '#e8000f',
  text: '#f4f4f4',
  textDim: 'rgba(244,244,244,0.58)',
  textFaint: 'rgba(244,244,244,0.30)',
  glassBorder: 'rgba(255,255,255,0.18)',
  radius: 22,
  spacing: { sm: 12, md: 16, lg: 20, xl: 24 },

  // Card (PlanGlassCard)
  cardGlassBg: 'rgba(255,255,255,0.025)',
  cardReflectionColors: ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.05)', 'transparent'],
  cardVignetteColors: ['transparent', 'transparent', 'rgba(0,5,18,0.06)', 'rgba(0,5,18,0.16)'],
  cardShimmerColors: [
    'transparent',
    'rgba(255,255,255,0.04)',
    'rgba(255,255,255,0.12)',
    'rgba(255,255,255,0.18)',
    'rgba(255,255,255,0.12)',
    'rgba(255,255,255,0.04)',
    'transparent',
  ],
  badgeBg: 'rgba(255,255,255,0.08)',
  buttonSpecularColor: 'rgba(255,255,255,0.6)',
  buttonBorderColor: 'rgba(255,255,255,0.30)',
  imageGlowColor: 'rgba(255,255,255,0.04)',
  specularTopColors: [
    'transparent', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0.92)',
    'rgba(255,255,255,0.95)', 'rgba(255,255,255,0.92)', 'rgba(255,255,255,0.55)', 'transparent',
  ],
  rimLeftColors: ['transparent', 'rgba(255,255,255,0.48)', 'rgba(255,255,255,0.30)', 'rgba(255,255,255,0.10)', 'transparent'],
  chromaBottomColors: ['transparent', 'rgba(160,185,255,0.28)', 'rgba(180,200,255,0.40)', 'rgba(160,185,255,0.28)', 'transparent'],
  borderOuterColor: 'rgba(255,255,255,0.45)',
  borderInnerColor: 'rgba(255,255,255,0.18)',
  cardShadowColor: '#000000',
  cardShadowOpacity: 0.30,

  // Bottom sheet (GlassBottomSheet)
  backdropTintColor: platformPick('rgba(0,0,0,0.30)', 'rgba(0,0,0,0.72)'),
  sheetBorderColor: platformPick('rgba(255,255,255,0.16)', 'rgba(255,255,255,0.10)'),
  sheetGradientColors: platformPick(
    ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)', 'rgba(0,0,0,0.12)'],
    ['rgba(8,8,8,0.96)', 'rgba(8,8,8,0.90)', 'rgba(0,0,0,0.94)'],
  ),
  handleColor: 'rgba(255,255,255,0.25)',
  beneficioDotColor: '#e8000f',
  footerBg: platformPick('rgba(10,10,10,0.55)', 'rgba(6,6,6,0.92)'),
  footerTopLineColor: 'rgba(255,255,255,0.10)',
  fecharBorderColor: 'rgba(255,255,255,0.25)',
  assinarSpecularColor: 'rgba(255,255,255,0.45)',
  assinarBorderColor: 'rgba(255,255,255,0.25)',
  sheetSpecularColors: [
    'transparent', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.85)',
    'rgba(255,255,255,0.5)', 'transparent',
  ],

  // Tela principal (mainStyles)
  bgGlowColor: '#c0000a',
  backButtonBorderColor: 'rgba(255,255,255,0.20)',
  footerLineColor: '#c0000a',
};

export const LIGHT_DS = {
  scheme: 'light',
  blurTint: 'light',
  statusBarStyle: 'dark-content',

  bg: '#f3f2f0',
  bgElevated: '#ffffff',
  accent: '#8b0000',
  accentBright: '#a3000a',
  text: '#1a1414',
  textDim: 'rgba(26,20,20,0.62)',
  textFaint: 'rgba(26,20,20,0.38)',
  glassBorder: 'rgba(20,10,10,0.12)',
  radius: 22,
  spacing: { sm: 12, md: 16, lg: 20, xl: 24 },

  // Card (PlanGlassCard)
  cardGlassBg: 'transparent',
  cardReflectionColors: ['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.25)', 'transparent'],
  cardVignetteColors: ['transparent', 'transparent', 'rgba(20,10,10,0.03)', 'rgba(20,10,10,0.07)'],
  cardShimmerColors: [
    'transparent',
    'rgba(255,255,255,0.10)',
    'rgba(255,255,255,0.35)',
    'rgba(255,255,255,0.55)',
    'rgba(255,255,255,0.35)',
    'rgba(255,255,255,0.10)',
    'transparent',
  ],
  badgeBg: 'rgba(20,10,10,0.05)',
  buttonSpecularColor: 'rgba(255,255,255,0.9)',
  buttonBorderColor: 'rgba(20,10,10,0.14)',
  imageGlowColor: 'rgba(139,0,0,0.05)',
  specularTopColors: [
    'transparent', 'rgba(255,255,255,0.75)', 'rgba(255,255,255,0.95)',
    'rgba(255,255,255,0.98)', 'rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)', 'transparent',
  ],
  rimLeftColors: ['transparent', 'rgba(255,255,255,0.75)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.15)', 'transparent'],
  chromaBottomColors: ['transparent', 'rgba(139,0,0,0.16)', 'rgba(160,20,20,0.24)', 'rgba(139,0,0,0.16)', 'transparent'],
  borderOuterColor: 'rgba(20,10,10,0.14)',
  borderInnerColor: 'rgba(255,255,255,0.55)',
  cardShadowColor: '#402020',
  cardShadowOpacity: 0.12,

  // Bottom sheet (GlassBottomSheet)
  backdropTintColor: platformPick('rgba(30,15,15,0.28)', 'rgba(0,0,0,0.72)'),
  sheetBorderColor: platformPick('rgba(20,10,10,0.10)', 'rgba(20,10,10,0.10)'),
  sheetGradientColors: platformPick(
    ['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.35)', 'rgba(20,10,10,0.04)'],
    ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.78)', 'rgba(245,239,237,0.96)'],
  ),
  handleColor: 'rgba(20,10,10,0.18)',
  beneficioDotColor: '#a3000a',
  footerBg: platformPick('rgba(255,251,250,0.75)', 'rgba(255,251,250,0.96)'),
  footerTopLineColor: 'rgba(20,10,10,0.08)',
  fecharBorderColor: 'rgba(20,10,10,0.14)',
  assinarSpecularColor: 'rgba(255,255,255,0.55)',
  assinarBorderColor: 'rgba(20,10,10,0.10)',
  sheetSpecularColors: [
    'transparent', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.95)',
    'rgba(255,255,255,0.7)', 'transparent',
  ],

  // Tela principal (mainStyles)
  bgGlowColor: '#9b0000',
  backButtonBorderColor: 'rgba(223, 0, 0, 0.12)',
  footerLineColor: '#8b0000',
};

// ─────────────────────────────────────────────────────────────────────────────
// cardStyles — PlanGlassCard. Mesma estrutura/valores de layout do
// StyleSheet.create original — apenas cores/tokens passam a vir de DS.
// ─────────────────────────────────────────────────────────────────────────────
export const makeCardStyles = (DS) =>
  StyleSheet.create({
    outerContainer: {
      borderRadius: DS.radius,
      marginHorizontal: DS.spacing.lg,
      marginBottom: 18,
      shadowColor: DS.cardShadowColor,
      shadowOpacity: DS.cardShadowOpacity,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
    glassBody: {
      borderRadius: DS.radius,
      overflow: 'hidden',
      backgroundColor: DS.cardGlassBg,
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
      backgroundColor: DS.badgeBg,
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
      marginTop: 10,
    },
    buttonSpecular: {
      position: 'absolute',
      top: 0,
      left: '12%',
      right: '12%',
      height: 0.5,
      backgroundColor: DS.buttonSpecularColor,
      borderRadius: 0.5,
    },
    buttonBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 18,
      borderWidth: 0.75,
      borderColor: DS.buttonBorderColor,
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
      backgroundColor: DS.imageGlowColor,
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
      borderColor: DS.borderOuterColor,
    },
    borderInner: {
      position: 'absolute',
      top: 1.5,
      left: 1.5,
      right: 1.5,
      bottom: 1.5,
      borderRadius: DS.radius - 1.5,
      borderWidth: 0.5,
      borderColor: DS.borderInnerColor,
    },
  });

// ─────────────────────────────────────────────────────────────────────────────
// sheetStyles — GlassBottomSheet. Mesma estrutura/valores de layout do
// StyleSheet.create original — apenas cores/tokens passam a vir de DS.
// ─────────────────────────────────────────────────────────────────────────────
export const makeSheetStyles = (DS) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    backdropTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: DS.backdropTintColor,
    },
    sheetWrap: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      ...Platform.select({
        ios: {
          bottom: 10,
          maxHeight: SCREEN_HEIGHT * 0.9,
        },
        android: {
          height: SCREEN_HEIGHT * 0.88,
          maxHeight: SCREEN_HEIGHT * 0.88,
        },
      }),
    },
    sheetBody: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      overflow: 'hidden',
      paddingHorizontal: DS.spacing.xl,
      paddingTop: 14,
      paddingBottom: 0,
      borderWidth: 0.75,
      borderBottomWidth: 0,
      borderColor: DS.sheetBorderColor,
      ...Platform.select({
        ios: {
          minHeight: SCREEN_HEIGHT * 0.6,
        },
        android: {
          flex: 1,
          minHeight: 0,
        },
      }),
    },
    handle: {
      alignSelf: 'center',
      width: 38,
      height: 4,
      borderRadius: 2,
      backgroundColor: DS.handleColor,
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
      backgroundColor: DS.imageGlowColor,
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
      backgroundColor: DS.beneficioDotColor,
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
      backgroundColor: DS.footerBg,
      flexShrink: 0,
    },
    footerTopLine: {
      height: 0.5,
      backgroundColor: DS.footerTopLineColor,
      marginBottom: 14,
      marginHorizontal: -DS.spacing.xl,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalPrice: {
      fontSize: 22,
      fontWeight: '900',
      color: DS.text,
      letterSpacing: -0.5,
      flexShrink: 1,
      maxWidth: '44%',
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 10,
      flexShrink: 0,
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
      borderColor: DS.fecharBorderColor,
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
      backgroundColor: DS.assinarSpecularColor,
      borderRadius: 0.75,
    },
    assinarBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 21,
      borderWidth: 0.75,
      borderColor: DS.assinarBorderColor,
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

// ─────────────────────────────────────────────────────────────────────────────
// mainStyles — Tela principal (SociosScreen). Mesma estrutura/valores de
// layout do StyleSheet.create original — apenas cores/tokens passam a vir
// de DS.
// ─────────────────────────────────────────────────────────────────────────────
export const makeMainStyles = (DS) =>
  StyleSheet.create({
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
      backgroundColor: DS.bgGlowColor,
      opacity: 0.05,
      shadowColor: DS.bgGlowColor,
      shadowOpacity: 1,
      shadowRadius: 120,
    },
    drakosBackground: {
      position: 'absolute',
      width: SCREEN_WIDTH * 1.4,
      height: SCREEN_WIDTH * 1.4,
      top: SCREEN_HEIGHT * 0.18,
      left: -SCREEN_WIDTH * 0.3,
      opacity: DS.scheme === 'dark' ? 0.035 : 0.03,
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
      borderColor: DS.backButtonBorderColor,
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
      backgroundColor: DS.footerLineColor,
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

export default makeMainStyles;
