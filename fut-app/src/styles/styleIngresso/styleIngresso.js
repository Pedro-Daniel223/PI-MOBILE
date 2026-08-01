import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — IngressosScreen (Liquid Glass, Light/Dark)
// ─────────────────────────────────────────────────────────────────────────
// DARK_DS reproduz EXATAMENTE o design system original desta tela — nenhuma
// cor foi alterada.
//
// LIGHT_DS não é uma inversão mecânica de opacidades. O problema de um
// "glass" claro genérico é que blur + branco translúcido sobre fundo branco
// simplesmente desaparece — vira uma tela cinza-chapada sem profundidade.
// Para evitar isso:
//
//   1. Fundo NUNCA é branco puro: um marfim frio levemente azulado
//      (#EEF1F6 → #E4E9F2), para o vidro ter algo visível para refratar.
//   2. O vidro em si puxa para um cinza-ardósia com leve tinta azul
//      (não branco-sobre-branco), então BlurView tint="light" continua
//      gerando separação de camada real.
//   3. Sombras ganham peso (blur maior, opacidade mais alta) porque no
//      light mode a sombra é o principal sinal de elevação — no dark o
//      próprio contraste de luminância já fazia esse trabalho.
//   4. O crimson vira o ponto cromático dominante: mais saturado e mais
//      escuro (bordô) para não lavar contra um fundo claro, e cada
//      superfície de texto crítico (preço, CTA) usa esse acento em vez de
//      preto neutro, criando identidade visual própria.
//   5. Bordas e specular highlights ficam mais escuros que claros — em
//      light mode o brilho "de vidro" vem do contraste da borda inferior
//      escura + reflexo superior sutil, não de branco puro por toda a
//      borda.
// ─────────────────────────────────────────────────────────────────────────

export const DARK_DS = {
  scheme: 'dark',
  bg: '#050607',
  overlay: 'rgba(4, 6, 10, 0.62)',
  crimson: '#c0000a',
  crimsonSoft: 'rgba(192, 0, 10, 0.35)',
  crimsonText: 'rgba(255,150,150,0.9)',
  glassBorder: 'rgba(255, 255, 255, 0.30)',
  glassBorderInner: 'rgba(255, 255, 255, 0.16)',
  textPrimary: 'rgba(255, 255, 255, 0.96)',
  textSecondary: 'rgba(255, 255, 255, 0.62)',
  textTertiary: 'rgba(255, 255, 255, 0.40)',

  // GlassSurface
  surfaceShadowColor: '#000',
  surfaceShadowOpacity: 0.38,
  surfaceShadowRadius: 26,
  surfaceShadowOffset: { width: 0, height: 14 },
  blurTintPrimary: 'dark',
  blurTintSecondary: 'light',
  surfaceBaseTone: [
    'rgba(255,255,255,0.10)',
    'rgba(255,255,255,0.04)',
    'rgba(255,255,255,0.06)',
  ],
  surfaceReflection: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.03)', 'transparent'],
  surfaceVolume: ['transparent', 'rgba(255,255,255,0.05)', 'transparent'],
  surfaceVignette: ['transparent', 'rgba(0,0,0,0.16)'],
  surfaceShimmer: [
    'transparent',
    'rgba(255,255,255,0.05)',
    'rgba(255,255,255,0.12)',
    'rgba(255,255,255,0.05)',
    'transparent',
  ],
  surfaceSpecularTop: [
    'transparent',
    'rgba(255,255,255,0.55)',
    'rgba(255,255,255,0.85)',
    'rgba(255,255,255,0.55)',
    'transparent',
  ],
  surfaceRimLeft: ['transparent', 'rgba(255,255,255,0.42)', 'transparent'],

  // Chips
  chipActiveGradient: ['rgba(192,0,10,0.35)', 'rgba(192,0,10,0.08)'],
  chipBaseGradient: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.02)'],
  chipTextActive: '#fff',
  chipBorderActive: 'rgba(255,120,120,0.55)',

  // Capsule selector
  capsuleGradient: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.03)'],
  capsuleSpecular: 'rgba(255,255,255,0.6)',

  // Buy button
  buyButtonGradient: ['#9c0009', '#9c0009'],
  buyButtonHighlight: ['rgba(255,255,255,0.30)', 'transparent'],
  buyButtonShimmer: ['transparent', 'rgba(255,255,255,0.30)', 'transparent'],
  buyButtonBorder: 'rgba(255,255,255,0.35)',
  buyButtonBorderInner: 'rgba(255,255,255,0.18)',
  buyButtonText: '#fff',

  // Stepper
  stepperGradient: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)'],

  // Divider
  dividerColor: 'rgba(255,255,255,0.10)',
  dividerColorSoft: 'rgba(255,255,255,0.08)',

  // Modal
  modalBackdrop: 'rgba(0,0,0,0.55)',
  successBackdrop: 'rgba(0,0,0,0.6)',
  successIconColor: 'rgba(120,255,170,0.9)',
  cancelTextColor: 'rgba(255,120,120,0.9)',
  okButtonBg: 'rgba(255,255,255,0.12)',
};

export const LIGHT_DS = {
  scheme: 'light',
  bg: '#e9edf4',
  overlay: 'rgba(233, 237, 244, 0.66)',
  crimson: '#8b0009',
  crimsonSoft: 'rgba(139, 0, 9, 0.16)',
  crimsonText: '#9c0016',
  glassBorder: 'rgba(30, 36, 54, 0.14)',
  glassBorderInner: 'rgba(255, 255, 255, 0.65)',
  textPrimary: 'rgba(20, 24, 36, 0.92)',
  textSecondary: 'rgba(30, 36, 54, 0.60)',
  textTertiary: 'rgba(30, 36, 54, 0.42)',

  // GlassSurface — vidro com tinta azul-ardósia sutil, não branco puro,
  // e sombra mais pesada/quente para carregar a elevação sozinha.
  surfaceShadowColor: '#1b2233',
  surfaceShadowOpacity: 0.16,
  surfaceShadowRadius: 22,
  surfaceShadowOffset: { width: 0, height: 10 },
  blurTintPrimary: 'light',
  blurTintSecondary: 'default',
  surfaceBaseTone: [
    'rgba(255,255,255,0.55)',
    'rgba(219,225,238,0.45)',
    'rgba(203,211,228,0.35)',
  ],
  surfaceReflection: ['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.15)', 'transparent'],
  surfaceVolume: ['transparent', 'rgba(255,255,255,0.30)', 'transparent'],
  surfaceVignette: ['transparent', 'rgba(30,38,58,0.07)'],
  surfaceShimmer: [
    'transparent',
    'rgba(255,255,255,0.20)',
    'rgba(255,255,255,0.45)',
    'rgba(255,255,255,0.20)',
    'transparent',
  ],
  surfaceSpecularTop: [
    'transparent',
    'rgba(255,255,255,0.9)',
    'rgba(255,255,255,1)',
    'rgba(255,255,255,0.9)',
    'transparent',
  ],
  surfaceRimLeft: ['transparent', 'rgba(255,255,255,0.8)', 'transparent'],

  // Chips
  chipActiveGradient: ['rgba(139,0,9,0.16)', 'rgba(139,0,9,0.05)'],
  chipBaseGradient: ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.10)'],
  chipTextActive: '#7a0008',
  chipBorderActive: 'rgba(139,0,9,0.45)',

  // Capsule selector
  capsuleGradient: ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.15)'],
  capsuleSpecular: 'rgba(255,255,255,0.95)',

  // Buy button — mesmo bordô do dark, ligeiramente mais quente para
  // funcionar como âncora cromática sobre fundo claro
  buyButtonGradient: ['#a3000d', '#7a0009'],
  buyButtonHighlight: ['rgba(255,255,255,0.35)', 'transparent'],
  buyButtonShimmer: ['transparent', 'rgba(255,255,255,0.40)', 'transparent'],
  buyButtonBorder: 'rgba(255,255,255,0.45)',
  buyButtonBorderInner: 'rgba(255,255,255,0.25)',
  buyButtonText: '#fff',

  // Stepper
  stepperGradient: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.2)'],

  // Divider
  dividerColor: 'rgba(30,38,58,0.10)',
  dividerColorSoft: 'rgba(30,38,58,0.08)',

  // Modal
  modalBackdrop: 'rgba(20,24,36,0.42)',
  successBackdrop: 'rgba(20,24,36,0.46)',
  successIconColor: '#1f8a4c',
  cancelTextColor: '#8b0009',
  okButtonBg: 'rgba(30,38,58,0.06)',
};

// ─────────────────────────────────────────────────────────────────────────
// makeStyles(DS) — mesma estrutura/valores de layout do StyleSheet.create
// original (fontSize, letterSpacing, margins) — apenas a cor passa a vir
// de DS.textTertiary.
// ─────────────────────────────────────────────────────────────────────────
export const makeStyles = (DS) =>
  StyleSheet.create({
    sectionLabel: {
      color: DS.textTertiary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginBottom: 10,
      marginLeft: 4,
    },
  });

export default makeStyles;