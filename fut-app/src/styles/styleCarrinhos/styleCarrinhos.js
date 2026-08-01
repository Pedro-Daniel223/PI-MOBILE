import { StyleSheet, Platform } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Tokens Light/Dark (Liquid Glass) — CarrinhosScreen
// Mesma paleta que já estava definida inline no componente original
// (DS.colors.*), agora promovida para DARK_DS/LIGHT_DS seguindo o padrão de
// PerfilScreen/LojaScreen (useColorScheme + makeStyles(DS) via useMemo).
// Nenhum valor de cor foi alterado em relação ao que já existia no
// componente — apenas movido para cá e organizado como DS.colors.
// ─────────────────────────────────────────────────────────────────────────────
export const DARK_DS = {
  scheme: 'dark',
  isDark: true,
  statusBarStyle: 'light-content',
  colors: {
    background: '#090909',
    surface: '#171717',

    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.65)',

    accent: '#E8000F',
    accentLight: 'rgba(232,0,15,0.18)',

    black: '#FFFFFF',

    card: '#141414',

    border: 'rgba(255,255,255,.08)',

    quantityBackground: '#232323',
    quantityButton: '#2C2C2E',

    bottomBar: 'rgba(18,18,18,.97)',

    // Tokens adicionais para elementos que antes usavam cores hardcoded
    // diretamente no StyleSheet (imagePlaceholderBg, qtyBtnBg, etc.) —
    // preservam a MESMA aparência do Light Mode original, com contraparte
    // dark coerente com a identidade Liquid Glass do projeto.
    imagePlaceholderBg: '#1E1E1E',
    imagePlaceholderIcon: '#4A4A4C',
    qtyBtnBg: '#2C2C2E',
    qtySymbolDisabled: '#5A5A5C',
    bottomBarBorder: 'rgba(255,255,255,0.08)',
    bottomBarShadow: '#000',
    checkoutIconBg: '#FFFFFF',
    checkoutIconColor: '#090909',
    checkoutTextColor: '#090909',
    shopButtonTextColor: '#090909',
    cardShadow: '#000',
    cardShadowOpacity: 0.35,
  },
};

export const LIGHT_DS = {
  scheme: 'light',
  isDark: false,
  statusBarStyle: 'dark-content',
  colors: {
    background: '#F7F4F2',
    surface: '#FFFFFF',

    text: '#111111',
    textSecondary: '#6B7280',

    accent: '#E8000F',
    accentLight: '#FFE8E8',

    black: '#111111',

    card: '#FFFFFF',

    border: 'rgba(0,0,0,.06)',

    quantityBackground: '#F2F2F7',
    quantityButton: '#FFFFFF',

    bottomBar: 'rgba(255,255,255,.95)',

    imagePlaceholderBg: '#F2F2F7',
    imagePlaceholderIcon: '#D1D1D6',
    qtyBtnBg: '#FFFFFF',
    qtySymbolDisabled: '#D1D1D6',
    bottomBarBorder: 'rgba(255,255,255,0.5)',
    bottomBarShadow: '#000',
    checkoutIconBg: '#FFFFFF',
    checkoutIconColor: '#111111',
    checkoutTextColor: '#FFFFFF',
    shopButtonTextColor: '#FFFFFF',
    cardShadow: '#000',
    cardShadowOpacity: 0.05,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// makeStyles(DS) — Mesma estrutura, mesmos valores de layout do StyleSheet
// original (paddings, tamanhos, radius, gaps, elevation, shadowRadius,
// shadowOffset). Apenas backgroundColor/color/borderColor/shadowColor
// passam a vir de DS.colors.
// ─────────────────────────────────────────────────────────────────────────────
export const makeStyles = (DS) => {
  const c = DS.colors;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    headerTitle: { fontSize: scaleFont(16), fontWeight: '800', color: c.black, letterSpacing: 1 },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    clearText: { color: c.accent, fontWeight: '600', fontSize: scaleFont(14) },
    clearTextDisabled: { opacity: 0 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 150 },
    emptyScrollContent: { flexGrow: 1, justifyContent: 'center' },
    cartItemContainer: { marginBottom: 15 },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderRadius: 24,
      padding: 12,
      ...Platform.select({
        ios: { shadowColor: c.cardShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: c.cardShadowOpacity, shadowRadius: 10 },
        android: { elevation: 3 },
      }),
    },
    imageWrapper: { width: 90, height: 110, borderRadius: 18, backgroundColor: c.imagePlaceholderBg, overflow: 'hidden' },
    productImage: { width: '100%', height: '100%' },
    imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 2 },
    sectionLabel: { fontSize: scaleFont(10), fontWeight: '700', color: c.accent, textTransform: 'uppercase', marginBottom: 4 },
    productName: { fontSize: scaleFont(16), fontWeight: '700', color: c.text, marginBottom: 8, lineHeight: scaleFont(20) },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    detailText: { fontSize: scaleFont(12), color: c.textSecondary, fontWeight: '500' },
    detailValue: { fontWeight: '700', color: c.black },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    priceLabel: { fontSize: scaleFont(12), color: c.textSecondary, fontWeight: '500' },
    priceValue: { fontSize: scaleFont(15), fontWeight: '700', color: c.black },
    priceOriginal: { fontSize: scaleFont(11.5), color: c.textSecondary, textDecorationLine: 'line-through' },
    economyText: { fontSize: scaleFont(11.5), color: c.accent, fontWeight: '700' },
    pricingBlock: { marginBottom: 12, paddingTop: 4 },
    pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    pricingLabel: { fontSize: scaleFont(11), color: c.textSecondary, fontWeight: '600' },
    pricingValue: { fontSize: scaleFont(13), color: c.text, fontWeight: '800' },
    pricingValueMuted: { fontSize: scaleFont(11.5), color: c.textSecondary, textDecorationLine: 'line-through' },
    benefitsCard: { marginTop: 14, padding: 14, borderRadius: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: c.bottomBarBorder },
    benefitsTitle: { fontSize: scaleFont(13), fontWeight: '800', color: c.black, marginBottom: 8 },
    benefitLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    benefitText: { flex: 1, fontSize: scaleFont(11.5), color: c.textSecondary, lineHeight: scaleFont(15) },
    summaryCard: { marginTop: 14, padding: 14, borderRadius: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: c.bottomBarBorder },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    summaryLabel: { fontSize: scaleFont(11.5), color: c.textSecondary, fontWeight: '600' },
    summaryValue: { fontSize: scaleFont(12.5), color: c.black, fontWeight: '800' },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.quantityBackground, borderRadius: 12, padding: 4 },
    qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: c.qtyBtnBg, borderRadius: 8 },
    qtyBtnDisabled: { opacity: 0.5 },
    qtySymbol: { fontSize: scaleFont(18), fontWeight: '600', color: c.text },
    qtyNumber: { fontSize: scaleFont(14), fontWeight: '800', marginHorizontal: 12, minWidth: 28, textAlign: 'center', color: c.text },
    deleteButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center' },
    bottomBarContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
    bottomBar: {
      backgroundColor: c.bottomBar,
      borderRadius: 30,
      padding: 15,
      paddingLeft: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: c.bottomBarShadow,
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 1,
      borderColor: c.bottomBarBorder,
    },
    totalLabel: { fontSize: scaleFont(12), color: c.textSecondary, fontWeight: '600' },
    totalAmount: { fontSize: scaleFont(24), fontWeight: '900', color: c.black, letterSpacing: -0.5 },
    totalOldAmount: { fontSize: scaleFont(11), color: c.textSecondary, textDecorationLine: 'line-through', marginBottom: 2 },
    totalSavings: { fontSize: scaleFont(11), color: c.accent, fontWeight: '700', marginTop: 2 },
    checkoutButton: { backgroundColor: c.black, flexDirection: 'row', height: 54, paddingLeft: 20, paddingRight: 6, borderRadius: 22, alignItems: 'center' },
    checkoutText: { color: c.checkoutTextColor, fontWeight: '700', fontSize: scaleFont(15), marginRight: 12 },
    checkoutIcon: { width: 42, height: 42, backgroundColor: c.checkoutIconBg, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    emptyState: { alignItems: 'center', paddingHorizontal: 40 },
    emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: c.accentLight, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: scaleFont(20), fontWeight: '800', color: c.text, marginBottom: 8 },
    emptySubtitle: { fontSize: scaleFont(14), color: c.textSecondary, textAlign: 'center', marginBottom: 30 },
    shopButton: { backgroundColor: c.black, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 18 },
    shopButtonText: { color: c.shopButtonTextColor, fontWeight: '700' },
  });
};

export default makeStyles;
