import { StyleSheet, Dimensions, Platform } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — Light / Dark
// A tela original era light-only (fundo #F5F5F5, texto preto, cartão de imagem
// #EFEFEF). LIGHT_DS preserva exatamente essa identidade. DARK_DS é um par
// tonal novo: cinzas neutros profundos (não preto puro), preservando o mesmo
// acento vermelho (#A52A2A / #D00) e todo o layout (paddings, radius,
// tamanhos, sombras, gaps) idêntico ao original — só cor muda.
// ─────────────────────────────────────────────────────────────────────────────
export const DARK_DS = {
  scheme: 'dark',
  statusBarStyle: 'light-content',

  bg: '#121212',
  headerIconBg: '#1E1E1E',
  headerIconShadow: '#000',
  headerTitle: '#F5F5F5',
  headerIconColor: '#EDEDED',

  imageCardBg: '#1C1C1E',
  dotInactive: '#5A5A5C',
  dotActive: '#E0463F',

  thumbnailBg: '#1C1C1E',
  thumbnailBorder: '#2C2C2E',
  thumbnailBorderActive: '#F5F5F5',
  thumbnailPlaceholderBg: '#161616',
  thumbnailPlaceholderIcon: '#7A7A7C',

  navButtonBg: 'rgba(28, 28, 30, 0.9)',
  navButtonShadow: '#000',
  navButtonIcon: '#F5F5F5',

  currentPrice: '#F5F5F5',
  oldPrice: '#6E6E70',
  discountBadgeBg: 'rgba(224, 70, 63, 0.14)',
  discountText: '#FF6B63',
  productName: '#A6A6A8',

  sizeLabelTitle: '#E4E4E5',
  sizeBoxBg: '#1C1C1E',
  sizeBoxBorder: '#2C2C2E',
  sizeBoxActiveBg: '#F5F5F5',
  sizeBoxActiveBorder: '#F5F5F5',
  sizeLabel: '#F5F5F5',
  sizeLabelActive: '#121212',

  descriptionHeader: '#F5F5F5',
  descLine: '#2C2C2E',
  descriptionText: '#A6A6A8',

  cartButtonBg: '#F5F5F5',
  cartButtonBorder: '#F5F5F5',
  cartButtonShadow: '#000',
  cartButtonText: '#121212',
  cartButtonIcon: '#121212',
};

export const LIGHT_DS = {
  scheme: 'light',
  statusBarStyle: 'dark-content',

  bg: '#F5F5F5',
  headerIconBg: '#FFF',
  headerIconShadow: '#000',
  headerTitle: '#000',
  headerIconColor: '#333',

  imageCardBg: '#EFEFEF',
  dotInactive: '#999',
  dotActive: '#A52A2A',

  thumbnailBg: '#FFF',
  thumbnailBorder: '#E5E5E5',
  thumbnailBorderActive: '#000',
  thumbnailPlaceholderBg: '#F5F5F5',
  thumbnailPlaceholderIcon: '#999',

  navButtonBg: 'rgba(255, 255, 255, 0.9)',
  navButtonShadow: '#000',
  navButtonIcon: '#333',

  currentPrice: '#000',
  oldPrice: '#BBB',
  discountBadgeBg: '#FFF1F1',
  discountText: '#D00',
  productName: '#666',

  sizeLabelTitle: '#333',
  sizeBoxBg: '#FFF',
  sizeBoxBorder: '#EEE',
  sizeBoxActiveBg: '#000',
  sizeBoxActiveBorder: '#000',
  sizeLabel: '#000',
  sizeLabelActive: '#FFF',

  descriptionHeader: '#000',
  descLine: '#EEE',
  descriptionText: '#666',

  cartButtonBg: '#000',
  cartButtonBorder: '#333',
  cartButtonShadow: '#000',
  cartButtonText: '#FFF',
  cartButtonIcon: '#FFF',
};

// ─────────────────────────────────────────────────────────────────────────────
// makeStyles(DS) — Mesma estrutura, mesmos valores de layout do StyleSheet
// original (paddings, tamanhos, radius, gaps, elevation, shadowRadius,
// shadowOffset). Apenas backgroundColor/color/borderColor/shadowColor
// passam a vir de DS.
// ─────────────────────────────────────────────────────────────────────────────
export const makeStyles = (DS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: DS.bg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      height: 60,
    },
    headerTitle: {
      fontSize: scaleFont(17),
      fontWeight: 'bold',
      color: DS.headerTitle,
    },
    iconButton: {
      width: 45,
      height: 45,
      borderRadius: 25,
      backgroundColor: DS.headerIconBg,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: DS.headerIconShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    imageCard: {
      backgroundColor: DS.imageCardBg,
      margin: 20,
      height: 280,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    imageSlide: {
      width: width - 40,
      height: 280,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productImage: {
      width: '85%',
      height: '85%',
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 15,
      gap: 6,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: DS.dotInactive,
    },
    dotActive: {
      backgroundColor: DS.dotActive,
      width: 20,
    },
    thumbnailRow: {
      marginTop: 4,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    thumbnailContent: {
      gap: 10,
      paddingRight: 4,
    },
    thumbnailButton: {
      width: 58,
      height: 58,
      borderRadius: 14,
      backgroundColor: DS.thumbnailBg,
      borderWidth: 1,
      borderColor: DS.thumbnailBorder,
      overflow: 'hidden',
    },
    thumbnailButtonActive: {
      borderColor: DS.thumbnailBorderActive,
      borderWidth: 2,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    thumbnailPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: DS.thumbnailPlaceholderBg,
    },
    navButton: {
      position: 'absolute',
      top: '45%',
      transform: [{ translateY: -30 }],
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: DS.navButtonBg,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: DS.navButtonShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    navButtonLeft: { left: 8 },
    navButtonRight: { right: 8 },
    infoSection: { paddingHorizontal: 20 },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    currentPrice: { fontSize: scaleFont(28), fontWeight: 'bold', color: DS.currentPrice },
    oldPrice: { fontSize: scaleFont(16), color: DS.oldPrice, textDecorationLine: 'line-through', marginLeft: 10 },
    discountBadge: { backgroundColor: DS.discountBadgeBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginLeft: 'auto' },
    discountText: { color: DS.discountText, fontWeight: 'bold', fontSize: scaleFont(12) },
    productName: { fontSize: scaleFont(16), color: DS.productName, marginBottom: 20 },
    sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30, gap: 12 },
    sizeLabelTitle: { fontSize: scaleFont(16), fontWeight: '700', color: DS.sizeLabelTitle, marginBottom: 10, width: '100%' },
    sizeBox: { width: width * 0.2, height: 50, backgroundColor: DS.sizeBoxBg, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: DS.sizeBoxBorder },
    sizeBoxActive: { backgroundColor: DS.sizeBoxActiveBg, borderColor: DS.sizeBoxActiveBorder },
    sizeLabel: { fontSize: scaleFont(16), fontWeight: 'bold', color: DS.sizeLabel },
    sizeLabelActive: { color: DS.sizeLabelActive },
    descriptionContainer: { marginTop: 10 },
    descriptionHeader: { fontSize: scaleFont(20), fontWeight: 'bold', color: DS.descriptionHeader },
    descLine: { width: 100, height: 2, backgroundColor: DS.descLine, marginVertical: 10 },
    descriptionText: { fontSize: scaleFont(16), color: DS.descriptionText, lineHeight: scaleFont(20), textAlign: 'left' },
    cartButton: { backgroundColor: DS.cartButtonBg, paddingVertical: 18, paddingHorizontal: 40, borderRadius: 35, alignSelf: 'center', marginTop: 30, elevation: 8, shadowColor: DS.cartButtonShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, borderWidth: 1, borderColor: DS.cartButtonBorder },
    cartButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    cartButtonText: { color: DS.cartButtonText, fontSize: scaleFont(18), fontWeight: '600', marginLeft: 10, letterSpacing: 0.5 },
  });

export default makeStyles;