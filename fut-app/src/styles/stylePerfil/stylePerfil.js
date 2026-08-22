import { StyleSheet } from "react-native";
import { platformPick } from "../platformUiTokens";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Tokens Light/Dark (Liquid Glass) — PerfilScreen
// Segue o mesmo padrão adotado em LojaScreens: ThemeContext + makeStyles(DS)
// via useMemo. Dark Mode mantém EXATAMENTE os valores originais já usados
// nesta tela; Light Mode é um conjunto de tokens novo e paralelo.
// ─────────────────────────────────────────────────────────────────────────────
export const DARK_DS = {
  scheme: "dark",
  bgGradient: ["#160000", "#0a0a0a", "#050505"],
  screenBg: "#050505",

  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.45)",
  textFaint: "rgba(255,255,255,0.35)",

  glassBlurIntensity: 32,
  glassBlurTint: "dark",
  glassFillGradient: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.015)"],
  glassBorder: "rgba(255,255,255,0.10)",
  glassBorderSoft: "rgba(255,255,255,0.09)",
  glassIconBg: "rgba(255,255,255,0.06)",
  glassChipBg: "rgba(255,255,255,0.08)",

  specularTop: "rgba(255,255,255,0.35)",
  specularTopStrong: "rgba(255,255,255,0.55)",

  shadowColor: "#000",
  shadowOpacityCard: 0.35,
  shadowOpacityPromo: 0.3,
  shadowOpacityModal: 0.4,

  accent: "#e8000f",
  accentSoft: "rgba(232,0,15,0.12)",
  accentBorder: "rgba(232,0,15,0.42)",
  accentGradient: ["#e8000f", "#a3000a"],

  dividerColor: "rgba(255,255,255,0.10)",
  dividerColorSoft: "rgba(255,255,255,0.07)",

  logoutText: "#ff6b6b",
  logoutBorder: "rgba(255,107,107,0.25)",

  notifDotBorder: "#0a0a0a",

  // Modal (Editar Perfil)
  modalOverlay: platformPick("rgba(4,0,0,0.55)", "rgba(0,0,0,0.78)"),
  modalBg: platformPick("rgba(18,10,10,0.4)", "rgba(7,7,8,0.94)"),
  modalBlurTint: "dark",
  modalBorder: platformPick("rgba(255,255,255,0.16)", "rgba(255,255,255,0.10)"),
  modalFillGradient: platformPick(
    ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"],
    ["rgba(18,18,18,0.96)", "rgba(8,8,8,0.88)"],
  ),
  modalTitleColor: "#ffffff",
  modalSubtitleColor: platformPick("rgba(255,255,255,0.5)", "rgba(255,255,255,0.68)"),
  closeBtnBg: platformPick("rgba(255,255,255,0.10)", "rgba(255,255,255,0.08)"),
  closeBtnBorder: platformPick("rgba(255,255,255,0.16)", "rgba(255,255,255,0.12)"),
  closeBtnIcon: "#ffffff",

  fieldLabelColor: platformPick("rgba(255,255,255,0.62)", "rgba(255,255,255,0.72)"),
  fieldBorder: platformPick("rgba(255,255,255,0.14)", "rgba(255,255,255,0.12)"),
  fieldIconColor: platformPick("rgba(255,255,255,0.55)", "rgba(255,255,255,0.68)"),
  fieldTextColor: "#ffffff",
  fieldPlaceholder: platformPick("rgba(255,255,255,0.32)", "rgba(255,255,255,0.38)"),
  fieldReadOnlyBorder: platformPick("rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"),
  fieldReadOnlyText: platformPick("rgba(255,255,255,0.45)", "rgba(255,255,255,0.48)"),
  fieldReadOnlyIcon: platformPick("rgba(255,255,255,0.32)", "rgba(255,255,255,0.42)"),
  fieldLockIcon: platformPick("rgba(255,255,255,0.28)", "rgba(255,255,255,0.38)"),
  fieldValidBorder: platformPick("rgba(78,224,138,0.55)", "rgba(78,224,138,0.62)"),
  fieldErrorBorder: platformPick("rgba(255,107,107,0.55)", "rgba(255,107,107,0.62)"),

  sexoOptionBorder: platformPick("rgba(255,255,255,0.14)", "rgba(255,255,255,0.12)"),
  sexoOptionBg: platformPick("rgba(255,255,255,0.05)", "rgba(255,255,255,0.06)"),
  sexoOptionSelectedBorder: platformPick("rgba(232,0,15,0.65)", "rgba(232,0,15,0.72)"),
  sexoOptionText: platformPick("rgba(255,255,255,0.6)", "rgba(255,255,255,0.72)"),
  sexoOptionTextSelected: "#ffffff",

  footerBorder: platformPick("rgba(255,255,255,0.10)", "rgba(255,255,255,0.10)"),
  cancelBtnBg: platformPick("rgba(255,255,255,0.08)", "rgba(255,255,255,0.08)"),
  cancelBtnBorder: platformPick("rgba(255,255,255,0.16)", "rgba(255,255,255,0.12)"),
  cancelTextColor: platformPick("rgba(255,255,255,0.75)", "rgba(255,255,255,0.82)"),
  saveBtnBorder: platformPick("rgba(255,255,255,0.18)", "rgba(255,255,255,0.14)"),
  saveTextColor: "#ffffff",
  saveTextDisabledColor: platformPick("rgba(255,255,255,0.35)", "rgba(255,255,255,0.44)"),
  saveDisabledGradient: platformPick(
    ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.05)"],
    ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.08)"],
  ),
};

export const LIGHT_DS = {
  scheme: "light",
  // Fundo levemente rosado/crimson-neutro para preservar a identidade Drakos
  // sem cair em branco puro (regra do design system: evitar fundos puros).
  bgGradient: ["#fbeceb", "#f6f1ef", "#f3f2f0"],
  screenBg: "#f3f2f0",

  textPrimary: "#1a1414",
  textSecondary: "rgba(26,20,20,0.68)",
  textMuted: "rgba(26,20,20,0.48)",
  textFaint: "rgba(26,20,20,0.38)",

  glassBlurIntensity: 40,
  glassBlurTint: "light",
  glassFillGradient: ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.22)"],
  glassBorder: "rgba(20,10,10,0.08)",
  glassBorderSoft: "rgba(20,10,10,0.07)",
  glassIconBg: "rgba(20,10,10,0.05)",
  glassChipBg: "rgba(255,255,255,0.6)",

  specularTop: "rgba(255,255,255,0.85)",
  specularTopStrong: "rgba(255,255,255,0.95)",

  shadowColor: "#402020",
  shadowOpacityCard: 0.14,
  shadowOpacityPromo: 0.10,
  shadowOpacityModal: 0.16,

  accent: "#c0000a",
  accentSoft: "rgba(192,0,10,0.08)",
  accentBorder: "rgba(192,0,10,0.30)",
  accentGradient: ["#e8000f", "#a3000a"],

  dividerColor: "rgba(20,10,10,0.08)",
  dividerColorSoft: "rgba(20,10,10,0.06)",

  logoutText: "#c0392b",
  logoutBorder: "rgba(192,57,43,0.22)",

  notifDotBorder: "#f3f2f0",

  // Modal (Editar Perfil)
  modalOverlay: platformPick("rgba(30,15,15,0.32)", "rgba(0,0,0,0.78)"),
  modalBg: platformPick("rgba(255,251,250,0.55)", "rgba(7,7,8,0.94)"),
  modalBlurTint: "light",
  modalBorder: platformPick("rgba(20,10,10,0.10)", "rgba(255,255,255,0.10)"),
  modalFillGradient: platformPick(
    ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.20)"],
    ["rgba(18,18,18,0.96)", "rgba(8,8,8,0.88)"],
  ),
  modalTitleColor: platformPick("#1a1414", "#ffffff"),
  modalSubtitleColor: platformPick("rgba(26,20,20,0.55)", "rgba(255,255,255,0.68)"),
  closeBtnBg: platformPick("rgba(20,10,10,0.06)", "rgba(255,255,255,0.08)"),
  closeBtnBorder: platformPick("rgba(20,10,10,0.10)", "rgba(255,255,255,0.12)"),
  closeBtnIcon: platformPick("#1a1414", "#ffffff"),

  fieldLabelColor: platformPick("rgba(26,20,20,0.62)", "rgba(255,255,255,0.72)"),
  fieldBorder: platformPick("rgba(20,10,10,0.12)", "rgba(255,255,255,0.12)"),
  fieldIconColor: platformPick("rgba(26,20,20,0.5)", "rgba(255,255,255,0.68)"),
  fieldTextColor: platformPick("#1a1414", "#ffffff"),
  fieldPlaceholder: platformPick("rgba(26,20,20,0.32)", "rgba(255,255,255,0.38)"),
  fieldReadOnlyBorder: platformPick("rgba(20,10,10,0.06)", "rgba(255,255,255,0.08)"),
  fieldReadOnlyText: platformPick("rgba(26,20,20,0.45)", "rgba(255,255,255,0.48)"),
  fieldReadOnlyIcon: platformPick("rgba(26,20,20,0.30)", "rgba(255,255,255,0.42)"),
  fieldLockIcon: platformPick("rgba(26,20,20,0.28)", "rgba(255,255,255,0.38)"),
  fieldValidBorder: platformPick("rgba(36,158,90,0.55)", "rgba(78,224,138,0.62)"),
  fieldErrorBorder: platformPick("rgba(214,68,58,0.55)", "rgba(255,107,107,0.62)"),

  sexoOptionBorder: platformPick("rgba(20,10,10,0.12)", "rgba(255,255,255,0.12)"),
  sexoOptionBg: platformPick("rgba(20,10,10,0.03)", "rgba(255,255,255,0.06)"),
  sexoOptionSelectedBorder: platformPick("rgba(192,0,10,0.55)", "rgba(232,0,15,0.72)"),
  sexoOptionText: platformPick("rgba(26,20,20,0.55)", "rgba(255,255,255,0.72)"),
  sexoOptionTextSelected: "#ffffff",

  footerBorder: platformPick("rgba(20,10,10,0.08)", "rgba(255,255,255,0.10)"),
  cancelBtnBg: platformPick("rgba(20,10,10,0.05)", "rgba(255,255,255,0.08)"),
  cancelBtnBorder: platformPick("rgba(20,10,10,0.10)", "rgba(255,255,255,0.12)"),
  cancelTextColor: platformPick("rgba(26,20,20,0.72)", "rgba(255,255,255,0.82)"),
  saveBtnBorder: platformPick("rgba(20,10,10,0.10)", "rgba(255,255,255,0.14)"),
  saveTextColor: "#ffffff",
  saveTextDisabledColor: platformPick("rgba(26,20,20,0.32)", "rgba(255,255,255,0.44)"),
  saveDisabledGradient: platformPick(
    ["rgba(20,10,10,0.08)", "rgba(20,10,10,0.04)"],
    ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.08)"],
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS — PerfilScreen (Liquid Glass Premium)
// Hero cinematográfico + Membership Card + cartões renovados.
// Regra de sombra iOS: containers com shadow* NÃO usam overflow:'hidden';
// um wrapper interno separado faz o clip de blur/gradiente.
//
// Factory makePs(DS) para suportar Light/Dark Mode mantendo a mesma
// estrutura/valores de layout já existentes — apenas cores/tokens passam a
// vir de DS. Nenhuma prop, nome de chave ou valor de layout (paddings,
// tamanhos, radius, gaps) foi alterado.
// ─────────────────────────────────────────────────────────────────────────────
export const makePs = (DS) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 120,
      gap: 18,
    },

    // ── HERO ──────────────────────────────────────────────────────────────
    hero: {
      alignItems: "center",
      paddingBottom: 6,
      position: "relative",
    },
    heroWatermark: {
      position: "absolute",
      width: 260,
      height: 260,
      top: -70,
      alignSelf: "center",
      opacity: DS.scheme === "dark" ? 0.05 : 0.045,
    },
    heroFade: {
      position: "absolute",
      top: -40,
      left: -20,
      right: -20,
      height: 180,
    },
    avatarStage: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    avatarGlow: {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 70,
    },
    avatarRing: {
      width: 108,
      height: 108,
      borderRadius: 54,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      padding: 4,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    editAvatarBtn: {
      position: "absolute",
      bottom: 0,
      right: 4,
      width: 30,
      height: 30,
      borderRadius: 15,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.scheme === "dark" ? "rgba(232,0,15,0.9)" : "rgba(192,0,10,0.92)",
    },
    editAvatarBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: DS.scheme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
    },
    username: {
      color: DS.textPrimary,
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: -0.3,
      textAlign: "center",
    },
    categoryText: {
      color: DS.textMuted,
      fontSize: 12.5,
      fontWeight: "500",
      marginTop: 3,
      textAlign: "center",
    },

    statusChip: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      borderRadius: 30,
      overflow: "hidden",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 7,
      marginTop: 14,
    },
    statusChipBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 30,
      borderWidth: 1,
    },
    statusChipEmoji: {
      fontSize: 13,
    },
    statusChipText: {
      fontSize: 12.5,
      fontWeight: "700",
      letterSpacing: 0.3,
    },

    savePhotoBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      height: 40,
      paddingHorizontal: 20,
      borderRadius: 20,
      overflow: "hidden",
      gap: 7,
      marginTop: 14,
    },
    savePhotoBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.25)",
    },
    savePhotoText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "700",
    },

    // ── MEMBERSHIP CARD ───────────────────────────────────────────────────
    membershipCard: {
      borderRadius: 22,
      overflow: "hidden",
      padding: 18,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: DS.shadowOpacityCard,
      shadowRadius: 20,
      elevation: 12,
    },
    membershipBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: DS.accentBorder,
    },
    membershipSpecularTop: {
      position: "absolute",
      top: 0,
      left: "14%",
      right: "14%",
      height: 1,
      backgroundColor: DS.specularTop,
    },
    membershipTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    membershipBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    membershipBadgeText: {
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
    },
    membershipEmoji: {
      fontSize: 22,
    },
    membershipTitle: {
      color: DS.textPrimary,
      fontSize: 21,
      fontWeight: "900",
      letterSpacing: -0.4,
      marginTop: 14,
    },
    membershipSubtitle: {
      color: DS.textMuted,
      fontSize: 12,
      fontWeight: "500",
      marginTop: 3,
    },
    membershipDivider: {
      height: 1,
      backgroundColor: DS.dividerColor,
      marginVertical: 16,
    },
    membershipFooterRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    membershipBenefits: {
      gap: 7,
      flex: 1,
    },
    membershipBenefitsTitle: {
      color: DS.textPrimary,
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    membershipBenefitsSubtitle: {
      color: DS.textMuted,
      fontSize: 11.5,
      fontWeight: "500",
      lineHeight: 16,
      marginBottom: 3,
    },
    membershipBenefitItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    membershipBenefitDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: DS.textMuted,
    },
    membershipBenefitText: {
      color: DS.textSecondary,
      fontSize: 12,
      fontWeight: "500",
    },
    membershipPrice: {
      color: DS.textPrimary,
      fontSize: 16,
      fontWeight: "800",
    },
    membershipManageBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 42,
      borderRadius: 13,
      overflow: "hidden",
      gap: 6,
      marginTop: 16,
    },
    membershipManageBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: DS.scheme === "dark" ? "rgba(255,255,255,0.16)" : "rgba(20,10,10,0.10)",
    },
    membershipManageBtnText: {
      color: DS.textPrimary,
      fontSize: 13,
      fontWeight: "700",
    },

    membershipPromo: {
      borderRadius: 22,
      overflow: "hidden",
      padding: 18,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: DS.shadowOpacityPromo,
      shadowRadius: 16,
      elevation: 8,
    },
    membershipPromoIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: DS.accentSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    membershipPromoTextGroup: {
      marginBottom: 16,
    },
    membershipPromoTitle: {
      color: DS.textPrimary,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 6,
    },
    membershipPromoBody: {
      color: DS.textSecondary,
      fontSize: 12.5,
      lineHeight: 18,
      fontWeight: "400",
    },
    membershipPromoCta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    membershipPromoCtaText: {
      color: DS.accent,
      fontSize: 13.5,
      fontWeight: "800",
    },

    // ── BOAS-VINDAS ───────────────────────────────────────────────────────
    welcomeCard: {
      borderRadius: 18,
      overflow: "hidden",
      padding: 16,
      paddingRight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    welcomeBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: DS.glassBorder,
    },
    welcomeIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: DS.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    welcomeBody: {
      flex: 1,
      color: DS.textSecondary,
      fontSize: 12.5,
      lineHeight: 18,
      fontWeight: "400",
    },
    notifBadge: {
      position: "absolute",
      top: 14,
      right: 14,
      padding: 4,
    },
    notifDot: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: "#ff2b2b",
      borderWidth: 1.5,
      borderColor: DS.notifDotBorder,
    },

    // ── AÇÕES RÁPIDAS ─────────────────────────────────────────────────────
    groupLabel: {
      color: DS.textFaint,
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: -6,
    },
    actionsRow: {
      flexDirection: "row",
      gap: 10,
    },
    actionCard: {
      flex: 1,
      borderRadius: 16,
      overflow: "hidden",
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    actionBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: DS.glassBorderSoft,
    },
    actionIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    actionLabel: {
      color: DS.textPrimary,
      fontSize: 11.5,
      fontWeight: "600",
      textAlign: "center",
    },
    actionCardWide: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 16,
      overflow: "hidden",
      paddingVertical: 16,
      paddingHorizontal: 16,
      gap: 12,
    },
    actionWideInner: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    actionWideTextGroup: {
      flex: 1,
      gap: 2,
    },
    actionWideLabel: {
      color: DS.textPrimary,
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: -0.1,
    },
    actionWideSubtitle: {
      color: DS.textMuted,
      fontSize: 11.5,
      fontWeight: "500",
      lineHeight: 16,
    },
    actionWideTrailing: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.glassIconBg,
    },

    // ── HISTÓRICO ─────────────────────────────────────────────────────────
    historySection: {
      borderRadius: 18,
      overflow: "hidden",
      padding: 16,
    },
    historyBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: DS.glassBorder,
    },
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    historyTitle: {
      color: DS.textPrimary,
      fontSize: 15,
      fontWeight: "700",
    },
    historyCloseBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    historySubBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: DS.accentSoft,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: DS.scheme === "dark" ? "rgba(232,0,15,0.20)" : "rgba(192,0,10,0.16)",
      marginBottom: 14,
      gap: 8,
    },
    historySubEmoji: {
      fontSize: 13,
    },
    historySubText: {
      color: DS.textPrimary,
      fontSize: 12.5,
      fontWeight: "600",
      flex: 1,
    },
    historySubPrice: {
      color: DS.textPrimary,
      fontSize: 12.5,
      fontWeight: "700",
    },
    historyListTitle: {
      color: DS.textMuted,
      fontSize: 11.5,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 8,
    },
    historyRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    historyIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: DS.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    historyInfo: {
      flex: 1,
      marginLeft: 10,
    },
    historyPlan: {
      color: DS.textPrimary,
      fontSize: 13.5,
      fontWeight: "600",
    },
    historyDate: {
      color: DS.textMuted,
      fontSize: 11,
      marginTop: 1,
    },
    historyPrice: {
      color: DS.textPrimary,
      fontSize: 13.5,
      fontWeight: "700",
    },
    historyDivider: {
      height: 1,
      backgroundColor: DS.dividerColorSoft,
    },
    historyProductImage: {
      width: 32,
      height: 32,
      borderRadius: 8,
    },
    historyEmpty: {
      alignItems: "center",
      paddingVertical: 22,
      gap: 8,
    },
    historyEmptyText: {
      color: DS.textFaint,
      fontSize: 12.5,
      textAlign: "center",
    },

    // ── DADOS PESSOAIS ────────────────────────────────────────────────────
    sectionHeaderCustom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sectionTitle: {
      color: DS.textPrimary,
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    sectionEditBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    infoCard: {
      borderRadius: 18,
      overflow: "hidden",
    },
    infoBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: DS.glassBorder,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    infoLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },
    infoIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    infoTextGroup: {
      flex: 1,
    },
    infoLabel: {
      color: DS.textFaint,
      fontSize: 10.5,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    infoValue: {
      color: DS.textPrimary,
      fontSize: 14.5,
      fontWeight: "600",
    },
    infoDivider: {
      height: 1,
      backgroundColor: DS.dividerColorSoft,
      marginHorizontal: 16,
    },

    // ── GERENCIAR ASSINATURA (Bottom Sheet) ─────────────────────────────────
    manageSheetCard: {
      maxHeight: "82%",
    },
    manageScrollContent: {
      paddingHorizontal: 22,
      paddingBottom: 22,
    },
    manageInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    manageInfoLabel: {
      fontSize: 12.5,
      fontWeight: "600",
      color: DS.textMuted,
    },
    manageInfoValue: {
      fontSize: 14.5,
      fontWeight: "700",
      color: DS.textPrimary,
    },
    managePlanValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    managePlanEmoji: {
      fontSize: 15,
    },
    manageStatusValue: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },
    manageStatusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    manageDivider: {
      height: 1,
      backgroundColor: DS.dividerColorSoft,
    },
    manageBenefitsBlock: {
      paddingVertical: 14,
      gap: 10,
    },
    manageBenefitsList: {
      gap: 9,
    },
    manageBenefitItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    manageBenefitText: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
      color: DS.textSecondary,
    },
    manageBenefitsEmpty: {
      fontSize: 12.5,
      color: DS.textFaint,
      fontStyle: "italic",
    },
    manageActionsDivider: {
      height: 1,
      backgroundColor: DS.footerBorder,
      marginTop: 6,
      marginBottom: 18,
    },
    manageSecondaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      borderRadius: 14,
      gap: 8,
      backgroundColor: DS.cancelBtnBg,
      borderWidth: 0.75,
      borderColor: DS.cancelBtnBorder,
      marginBottom: 10,
    },
    manageSecondaryBtnText: {
      fontSize: 14,
      fontWeight: "700",
      color: DS.textPrimary,
    },
    manageDangerBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      borderRadius: 14,
      gap: 8,
      backgroundColor: DS.scheme === "dark" ? "rgba(255,107,107,0.08)" : "rgba(192,57,43,0.06)",
      borderWidth: 0.75,
      borderColor: DS.logoutBorder,
    },
    manageDangerBtnText: {
      fontSize: 14,
      fontWeight: "700",
      color: DS.logoutText,
    },

    // ── CONFIRMAR CANCELAMENTO (Modal) ──────────────────────────────────────
    cancelOverlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
      backgroundColor: DS.modalOverlay,
      position: "relative",
    },
    cancelCard: {
      width: "100%",
      maxWidth: 380,
      borderRadius: 26,
      overflow: "hidden",
      position: "relative",
      zIndex: 1,
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 26,
      paddingBottom: 22,
      backgroundColor: DS.modalBg,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: DS.shadowOpacityModal,
      shadowRadius: 30,
      elevation: 20,
    },
    cancelBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 26,
      borderWidth: 0.75,
      borderColor: DS.modalBorder,
    },
    cancelSpecularTop: {
      position: "absolute",
      top: 0,
      left: "18%",
      right: "18%",
      height: 1,
      backgroundColor: DS.specularTopStrong,
    },
    cancelIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.scheme === "dark" ? "rgba(255,107,107,0.12)" : "rgba(192,57,43,0.08)",
      marginBottom: 14,
    },
    cancelTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: DS.modalTitleColor,
      letterSpacing: 0.1,
      marginBottom: 8,
      textAlign: "center",
    },
    cancelBody: {
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "500",
      color: DS.modalSubtitleColor,
      textAlign: "center",
      marginBottom: 22,
    },
    cancelActionsRow: {
      flexDirection: "row",
      width: "100%",
      gap: 10,
    },
    cancelBackBtn: {
      flex: 1,
      height: 46,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.cancelBtnBg,
      borderWidth: 0.75,
      borderColor: DS.cancelBtnBorder,
    },
    cancelBackBtnText: {
      fontSize: 13.5,
      fontWeight: "700",
      color: DS.cancelTextColor,
    },
    cancelConfirmBtn: {
      flex: 1.3,
      height: 46,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      backgroundColor: DS.logoutText,
    },
    cancelConfirmBtnText: {
      fontSize: 13.5,
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center",
    },

    // ── SAIR ──────────────────────────────────────────────────────────────
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
      paddingVertical: 15,
      gap: 10,
      overflow: "hidden",
    },
    logoutBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: DS.logoutBorder,
    },
    logoutText: {
      color: DS.logoutText,
      fontSize: 14.5,
      fontWeight: "600",
      letterSpacing: 0.3,
    },
  });

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS — Popup "Editar Perfil" (Liquid Glass)
// Factory makeEditStyles(DS). O popup mantém a MESMA estrutura, mesmo layout
// e mesmo comportamento — apenas os tokens de cor mudam com o tema.
// ─────────────────────────────────────────────────────────────────────────────
export const makeEditStyles = (DS) => {
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: DS.modalOverlay,
      justifyContent: "flex-end",
    },
    kav: {
      width: "100%",
    },
    modalCard: {
      maxHeight: "88%",
      marginHorizontal: 12,
      marginBottom: 12,
      borderRadius: 28,
      overflow: "hidden",
      backgroundColor: DS.modalBg,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: DS.shadowOpacityModal,
      shadowRadius: 30,
      elevation: 20,
    },
    specularTop: {
      position: "absolute",
      top: 0,
      left: "12%",
      right: "12%",
      height: 1,
      backgroundColor: DS.specularTopStrong,
    },
    modalBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
      borderWidth: 0.75,
      borderColor: DS.modalBorder,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 22,
      paddingHorizontal: 22,
      paddingBottom: 14,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: DS.modalTitleColor,
      letterSpacing: 0.2,
    },
    modalSubtitle: {
      fontSize: 12.5,
      color: DS.modalSubtitleColor,
      marginTop: 2,
    },
    closeIconBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.closeBtnBg,
      borderWidth: 0.75,
      borderColor: DS.closeBtnBorder,
    },
    scrollContent: {
      paddingHorizontal: 22,
      paddingBottom: 18,
    },
    sectionLabel: {
      fontSize: 11.5,
      fontWeight: "700",
      color: DS.textFaint,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 18,
      marginBottom: 10,
    },
    fieldWrap: {
      marginBottom: 12,
    },
    fieldLabel: {
      fontSize: 12.5,
      color: DS.fieldLabelColor,
      marginBottom: 6,
      fontWeight: "500",
    },
    inputShell: {
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      borderRadius: 14,
      overflow: "hidden",
      paddingHorizontal: 14,
      borderWidth: 0.75,
      borderColor: DS.fieldBorder,
    },
    inputShellValid: {
      borderColor: DS.fieldValidBorder,
    },
    inputShellError: {
      borderColor: DS.fieldErrorBorder,
    },
    inputShellReadOnly: {
      borderColor: DS.fieldReadOnlyBorder,
    },
    fieldIcon: {
      marginRight: 10,
    },
    fieldInput: {
      flex: 1,
      fontSize: 15,
      color: DS.fieldTextColor,
      padding: 0,
    },
    readOnlyText: {
      flex: 1,
      fontSize: 15,
      color: DS.fieldReadOnlyText,
    },
    validIcon: {
      marginLeft: 8,
    },
    sexoRow: {
      flexDirection: "row",
      gap: 10,
    },
    sexoOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 46,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 0.75,
      borderColor: DS.sexoOptionBorder,
      backgroundColor: DS.sexoOptionBg,
    },
    sexoOptionSelected: {
      borderColor: DS.sexoOptionSelectedBorder,
    },
    sexoOptionText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "600",
      color: DS.sexoOptionText,
    },
    sexoOptionTextSelected: {
      color: DS.sexoOptionTextSelected,
    },
    rowTwo: {
      flexDirection: "row",
    },
    footerRow: {
      flexDirection: "row",
      paddingHorizontal: 22,
      paddingTop: 14,
      paddingBottom: 20,
      gap: 12,
      borderTopWidth: 0.75,
      borderTopColor: DS.footerBorder,
    },
    cancelBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.cancelBtnBg,
      borderWidth: 0.75,
      borderColor: DS.cancelBtnBorder,
    },
    cancelText: {
      color: DS.cancelTextColor,
      fontSize: 15,
      fontWeight: "600",
    },
    saveBtn: {
      flex: 1.4,
      height: 48,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      gap: 6,
      borderWidth: 0.75,
      borderColor: DS.saveBtnBorder,
    },
    saveText: {
      color: DS.saveTextColor,
      fontSize: 15,
      fontWeight: "700",
    },
    saveTextDisabled: {
      color: DS.saveTextDisabledColor,
    },
  });

  // Valor auxiliar não-estilo (cor do ícone do seletor Sexo quando não
  // selecionado), consumido pelo SexoSelector. Mantido fora do objeto de
  // estilos do StyleSheet.create para não quebrar validação de estilos RN,
  // mas anexado ao mesmo objeto retornado por conveniência de uso local.
  styles.sexoOptionIconColor = DS.sexoOptionText;

  return styles;
};

export default makePs;
