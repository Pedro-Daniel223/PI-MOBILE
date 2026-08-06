import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PurchaseItemCard from "./PurchaseItemCard";

const { height: SCREEN_H } = Dimensions.get("window");

const formatHistoryDate = (value) => {
  if (!value) {
    return "";
  }

  try {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

const STATUS_TONE = {
  entregue: "#3ecf7a",
  concluido: "#3ecf7a",
  concluído: "#3ecf7a",
  pago: "#3ecf7a",
  enviado: null,
  "em transito": null,
  "em trânsito": null,
  processando: null,
  pendente: "#e0a530",
  cancelado: "#ff6b6b",
};

const getStatusColor = (status, fallback) => {
  const key = String(status || "").toLowerCase().trim();
  return STATUS_TONE[key] || fallback;
};

const PurchaseDetailsModal = React.memo(function PurchaseDetailsModal({
  visible,
  onClose,
  purchase = null,
  onBack,
  loading = false,
  textPrimary,
  textSecondary,
  textMuted,
  textFaint,
  accent,
  modalOverlay,
  modalBg,
  modalBlurTint,
  modalBorder,
  modalFillGradient,
  modalTitleColor,
  modalSubtitleColor,
  closeBtnBg,
  closeBtnBorder,
  closeBtnIcon,
  dividerColor,
  glassIconBg,
}) {
  const pedidoData = purchase?.date || formatHistoryDate(purchase?.date);
  const pedidoStatus = purchase?.status || "";
  const pedidoValor = purchase?.price || "";
  const pedidoQtd = purchase?.quantity ?? 0;
  const itens = Array.isArray(purchase?.items) ? purchase.items : [];

  const statusColor = getStatusColor(pedidoStatus, accent || "#e8000f");

  // ── Animação de entrada: overlay fade + sheet slide-up ────────────────────
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (visible) {
      overlayAnim.setValue(0);
      sheetAnim.setValue(SCREEN_H);
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(sheetAnim, {
          toValue: 0,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: modalOverlay || "rgba(0,0,0,0.55)", opacity: overlayAnim },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalCard,
            { transform: [{ translateY: sheetAnim }] },
          ]}
        >
          <BlurView
            intensity={60}
            tint={modalBlurTint || "dark"}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={modalFillGradient || ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.modalBorder, { borderColor: modalBorder || "rgba(255,255,255,0.16)" }]} />
          <View style={styles.specularTop} />

          <View style={styles.handleWrap}>
            <View
              style={[
                styles.handle,
                { backgroundColor: closeBtnBg ? closeBtnBg.replace(/0\.\d+\)/, "0.55)") : "rgba(255,255,255,0.28)" },
              ]}
            />
          </View>

          <View style={styles.headerRow}>
            {onBack && (
              <TouchableOpacity
                style={[styles.backBtn, { backgroundColor: closeBtnBg || "rgba(255,255,255,0.10)", borderColor: closeBtnBorder || "rgba(255,255,255,0.16)" }]}
                onPress={onBack}
                activeOpacity={0.75}
              >
                <Ionicons name="chevron-back" size={18} color={closeBtnIcon || "#fff"} />
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: modalTitleColor || "#fff" }]}>
                Detalhes do Pedido
              </Text>
              <View style={styles.subtitleRow}>
                <Text style={[styles.modalSubtitle, { color: modalSubtitleColor || "rgba(255,255,255,0.5)" }]}>
                  {pedidoData}
                </Text>
                {pedidoStatus ? (
                  <>
                    <View style={[styles.subtitleDot, { backgroundColor: modalSubtitleColor || "rgba(255,255,255,0.3)" }]} />
                    <View style={[styles.statusPulse, { backgroundColor: statusColor }]} />
                    <Text style={[styles.subtitleStatus, { color: statusColor }]}>
                      {pedidoStatus}
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeIconBtn, { backgroundColor: closeBtnBg || "rgba(255,255,255,0.10)", borderColor: closeBtnBorder || "rgba(255,255,255,0.16)" }]}
              onPress={onClose}
              activeOpacity={0.75}
            >
              <Ionicons name="close" size={17} color={closeBtnIcon || "#fff"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── Cartão de resumo destacado ─────────────────────────────── */}
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[
                  accent ? `${accent}26` : "rgba(232,0,15,0.15)",
                  "transparent",
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View
                style={[
                  styles.summaryBorder,
                  { borderColor: accent ? `${accent}42` : "rgba(232,0,15,0.26)" },
                ]}
              />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
                  Total do pedido
                </Text>
                <Text style={[styles.summaryValue, { color: textPrimary || "#fff" }]}>
                  {pedidoValor}
                </Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: dividerColor || "rgba(255,255,255,0.10)" }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
                  Itens
                </Text>
                <Text style={[styles.summaryValue, { color: textPrimary || "#fff" }]}>
                  {pedidoQtd}
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
              Produtos
            </Text>

            {loading ? (
              <View style={styles.loadingWrap}>
                {[0, 1].map((i) => (
                  <View
                    key={`item-skel-${i}`}
                    style={[
                      styles.skeletonRow,
                      { backgroundColor: glassIconBg || "rgba(255,255,255,0.045)" },
                    ]}
                  >
                    <View style={[styles.skeletonThumb, { backgroundColor: glassIconBg || "rgba(255,255,255,0.08)" }]} />
                    <View style={styles.skeletonLines}>
                      <View style={[styles.skeletonLine, { width: "70%", backgroundColor: glassIconBg || "rgba(255,255,255,0.08)" }]} />
                      <View style={[styles.skeletonLine, { width: "40%", backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" }]} />
                    </View>
                  </View>
                ))}
                <Text style={[styles.loadingLabel, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Carregando itens...
                </Text>
              </View>
            ) : itens.length === 0 ? (
              <View style={styles.empty}>
                <View
                  style={[
                    styles.emptyIconWrap,
                    { backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={26}
                    color={textFaint || "rgba(255,255,255,0.28)"}
                  />
                </View>
                <Text style={[styles.emptyText, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Nenhum item encontrado
                </Text>
              </View>
            ) : (
              <View style={styles.itemsCard}>
                <View style={[styles.itemsBorder, { borderColor: dividerColor || "rgba(255,255,255,0.09)" }]} />
                {itens.map((item, idx) => (
                  <View key={item.id_compra || `item-${idx}`}>
                    <PurchaseItemCard
                      item={item}
                      index={idx}
                      textPrimary={textPrimary}
                      textSecondary={textSecondary}
                      textMuted={textMuted}
                      textFaint={textFaint}
                      accent={accent}
                      glassIconBg={glassIconBg}
                    />
                    {idx < itens.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: dividerColor || "rgba(255,255,255,0.07)" }]} />
                    )}
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 8 }} />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "90%",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  modalBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    borderWidth: 0.75,
  },
  specularTop: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
    opacity: 0.5,
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 2,
  },
  handle: {
    width: 36,
    height: 4.5,
    borderRadius: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.75,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  subtitleDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
  },
  statusPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  subtitleStatus: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.75,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // ── Cartão de resumo ────────────────────────────────────────────────────
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    overflow: "hidden",
    paddingVertical: 16,
    marginBottom: 20,
  },
  summaryBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
    borderWidth: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  summaryDivider: {
    width: 1,
    height: 34,
  },
  summaryLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  itemsCard: {
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  itemsBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 0.75,
  },
  divider: {
    height: 1,
    marginLeft: 59,
  },

  // ── Loading skeleton ────────────────────────────────────────────────────
  loadingWrap: {
    gap: 10,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
    gap: 13,
  },
  skeletonThumb: {
    width: 46,
    height: 46,
    borderRadius: 13,
  },
  skeletonLines: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 10,
    borderRadius: 5,
  },
  loadingLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 6,
  },

  // ── Empty state ─────────────────────────────────────────────────────────
  empty: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 4,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 12.5,
    textAlign: "center",
  },
});

export default PurchaseDetailsModal;