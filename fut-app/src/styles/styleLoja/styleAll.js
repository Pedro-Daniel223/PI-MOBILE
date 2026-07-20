/**
 * styleAll — Design System da Loja Drakos
 * ═══════════════════════════════════════════════════════════════════════════════
 * Direção: "Nike App Clean" — base off-white, tipografia editorial pesada,
 * espaço negativo generoso, crimson como único acento cirúrgico.
 * Vidro (glass) reservado só para o CampaignBanner — usado com intenção,
 * não como textura repetida em toda a tela.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { StyleSheet, Dimensions, Platform } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const DS = {
  // Base — off-white, não branco puro (evita o "papel" clínico)
  bg: '#F4F2EF',
  bgLayer: '#EDEAE5',
  bgCard: '#FFFFFF',

  // Texto
  text: '#141210',
  textDim: '#6B6863',
  textFaint: '#A7A39C',

  // Acento — crimson Drakos, usado com escassez
  accent: '#C0000A',
  accentDeep: '#7A0006',

  // Linhas / bordas
  line: 'rgba(20, 18, 16, 0.08)',
  lineStrong: 'rgba(20, 18, 16, 0.14)',

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 999,
  },

  font: {
    display: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-condensed', default: undefined }),
    body: Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: undefined }),
  },
};

export const CAMPAIGN_WIDTH = SCREEN_WIDTH - 40;
export const CAMPAIGN_HEIGHT = 168;
export const CARD_WIDTH = (SCREEN_WIDTH - 40 - 14) / 2;
export const CARD_HEIGHT = CARD_WIDTH * 1.32;
export const HERO_HEIGHT = 440;

// ═══════════════════════════════════════════════════════════════════════════════
// mainStyles — container raiz e fundo
// ═══════════════════════════════════════════════════════════════════════════════
export const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGlowRed: {
    display: 'none', // removido — direção clean não usa glow ambiente na base
  },
  bgDots: {
    display: 'none', // removido — textura de pontos entra em conflito com o clean
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// topStyles — TopBar
// ═══════════════════════════════════════════════════════════════════════════════
export const topStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 52,
  },
  logoContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: DS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: DS.bg,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.bgCard,
    borderWidth: 1,
    borderColor: DS.line,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// heroStyles — HeroCarousel
// Tipografia editorial gigante sobre foto, à la Nike App PDP hero.
// ═══════════════════════════════════════════════════════════════════════════════
export const heroStyles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    marginTop: 4,
  },
  slide: {
    height: HERO_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  accentGlow: {
    display: 'none', // removido — sem halo colorido na direção clean
  },
  decorLines: {
    display: 'none', // removido — linhas decorativas eram ruído
  },
  decorLine: {
    display: 'none',
  },
  textContainer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: DS.radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  titleDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '85%',
    marginBottom: 22,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: DS.radius.xl,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaText: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bgNumber: {
    display: 'none', // removido — número gigante de fundo era ruído visual
  },
  indicators: {
    position: 'absolute',
    bottom: 14,
    right: 24,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 16,
  },
  bottomFade: {
    display: 'none', // fundo já é sólido off-white, sem necessidade de fade
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// catStyles — CategoriasStrip
// Pílulas minimalistas — outline fino, preenchimento sólido só quando ativo.
// ═══════════════════════════════════════════════════════════════════════════════
export const catStyles = StyleSheet.create({
  strip: {
    marginTop: 20,
  },
  stripContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: DS.radius.xl,
    borderWidth: 1,
    borderColor: DS.lineStrong,
    backgroundColor: DS.bgCard,
    overflow: 'hidden',
    marginRight: 8,
  },
  pillActive: {
    borderColor: DS.text,
    backgroundColor: DS.text,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: DS.textDim,
  },
  pillTextActive: {
    color: DS.bg,
    fontWeight: '700',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// campStyles — CampaignBanner
// Único ponto de "glass" da tela — reservado para o momento de maior impacto.
// ═══════════════════════════════════════════════════════════════════════════════
export const campStyles = StyleSheet.create({
  outer: {
    marginTop: 28,
    alignItems: 'center',
  },
  glowLayer: {
    display: 'none', // removido — glow vermelho de fundo conflitava com o clean
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 24,
  },
  campaignTag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  campaignSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
  campaignCta: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bgMark: {
    display: 'none', // marca d'água tipográfica removida — reduz ruído
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// secStyles — SectionHeader
// Tipografia editorial, hierarquia clara, sem decoração excessiva.
// ═══════════════════════════════════════════════════════════════════════════════
export const secStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 36,
    marginBottom: 18,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagLine: {
    width: 16,
    height: 2,
    backgroundColor: DS.accent,
    marginRight: 8,
    borderRadius: 1,
  },
  tag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: DS.accent,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: DS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: DS.textDim,
    marginTop: 4,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// gridStyles — ProdutosGrid
// ═══════════════════════════════════════════════════════════════════════════════
export const gridStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// cardStyles — ProductCard
// Cards de produto brancos, sombra suave e rasa, badge crimson pontual.
// ═══════════════════════════════════════════════════════════════════════════════
export const cardStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: DS.bgCard,
    borderRadius: DS.radius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  borderLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.line,
    zIndex: 2,
  },
  imageContainer: {
    height: '62%',
    backgroundColor: DS.bgLayer,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageVignette: {
    display: 'none', // desnecessário sobre fundo claro sólido
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: DS.accent,
    borderRadius: DS.radius.xl,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  info: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  categoria: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: DS.textFaint,
    marginBottom: 4,
  },
  nome: {
    fontSize: 13,
    fontWeight: '600',
    color: DS.text,
    lineHeight: 17,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    gap: 6,
  },
  preco: {
    fontSize: 14.5,
    fontWeight: '800',
    color: DS.text,
  },
  precoAntigo: {
    fontSize: 11.5,
    color: DS.textFaint,
    textDecorationLine: 'line-through',
  },
  accentLine: {
    display: 'none', // linha de acento inferior removida — badge já sinaliza oferta
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// adStyles — mantido apenas para compatibilidade de import.
// EditorialAdBanner foi removido da composição da tela (LojaScreens.js),
// então estes estilos não são mais renderizados — preservados para não
// quebrar o import nomeado vindo de '../styles/styleLoja/styleAll'.
// ═══════════════════════════════════════════════════════════════════════════════
export const adStyles = StyleSheet.create({
  outer: { display: 'none' },
  topLine: { display: 'none' },
  inner: { display: 'none' },
  sideLabel: { display: 'none' },
  sideLabelText: { display: 'none' },
  content: { display: 'none' },
  eyebrow: { display: 'none' },
  headline: { display: 'none' },
  underline: { display: 'none' },
  body: { display: 'none' },
  graphicElement: { display: 'none' },
  watermark: { display: 'none' },
  bottomLine: { display: 'none' },
});