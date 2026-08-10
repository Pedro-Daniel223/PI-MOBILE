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
import { platformPick } from "../styles/platformUiTokens";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PurchaseCard from "./PurchaseCard";

const { height: SCREEN_H } = Dimensions.get("window");

const PurchaseHistoryModal = React.memo(function PurchaseHistoryModal({
  visible,
  onClose,
  purchases = [],
  onSelectPurchase,
  loading = false,
  textPrimary,
  textSecondary,
  textMuted,
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
  glassBorder,
  glassIconBg,
  dividerColor,
  textFaint,
}) {
  // ── Animação de entrada: overlay fade + sheet slide-up com spring suave ───
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

  const handleRequestClose = () => {
    onClose?.();
  };

  const totalPurchases = purchases.length;

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={handleRequestClose}
      statusBarTranslucent
    >
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.overlay,
          {
            backgroundColor: modalOverlay || platformPick("rgba(0,0,0,0.55)", "rgba(0,0,0,0.80)"),
            opacity: overlayAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleRequestClose}
        />

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.modalCard,
            {
              backgroundColor:
                platformPick("transparent", modalBg || "rgba(6,6,6,0.94)"),
            },
            { transform: [{ translateY: sheetAnim }] },
          ]}
        >
          <BlurView
            intensity={platformPick(60, 52)}
            tint={modalBlurTint || "dark"}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <LinearGradient
            colors={modalFillGradient || platformPick(
              ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"],
              ["rgba(10,10,10,0.96)", "rgba(6,6,6,0.90)"],
            )}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View
            style={[
              styles.modalBorder,
              { borderColor: modalBorder || platformPick("rgba(255,255,255,0.16)", "rgba(255,255,255,0.10)") },
            ]}
            pointerEvents="none"
          />
          <View style={[styles.specularTop, { backgroundColor: modalBorder ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.5)" }]} pointerEvents="none" />

          {/* Drag handle — indicador de bottom sheet arrastável (visual) */}
          <View style={styles.handleWrap}>
            <View
              style={[
                styles.handle,
                { backgroundColor: closeBtnBg ? closeBtnBg.replace(/0\.\d+\)/, "0.55)") : "rgba(255,255,255,0.28)" },
              ]}
            />
          </View>

          <View style={styles.headerRow}>
            <View style={styles.headerIconWrap}>
              <View
                style={[
                  styles.headerIconBg,
                  { backgroundColor: accent ? `${accent}1f` : "rgba(232,0,15,0.12)" },
                ]}
              >
                <Ionicons name="receipt-outline" size={18} color={accent || "#e8000f"} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: modalTitleColor || "#fff" }]}>
                Minhas Compras
              </Text>
              <Text style={[styles.modalSubtitle, { color: modalSubtitleColor || "rgba(255,255,255,0.5)" }]}>
                {totalPurchases > 0
                  ? `${totalPurchases} pedido${totalPurchases === 1 ? "" : "s"} • toque para ver detalhes`
                  : "Selecione um pedido para ver os detalhes"}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeIconBtn, { backgroundColor: closeBtnBg || "rgba(255,255,255,0.10)", borderColor: closeBtnBorder || "rgba(255,255,255,0.16)" }]}
              onPress={handleRequestClose}
              activeOpacity={0.75}
            >
              <Ionicons name="close" size={17} color={closeBtnIcon || "#fff"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={purchases.length > 0}
          >
            {loading ? (
              <View style={styles.loadingWrap}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={`skeleton-${i}`}
                    style={[
                      styles.skeletonRow,
                      { backgroundColor: glassIconBg || "rgba(255,255,255,0.045)" },
                    ]}
                  >
                    <View style={[styles.skeletonThumb, { backgroundColor: glassIconBg || "rgba(255,255,255,0.08)" }]} />
                    <View style={styles.skeletonLines}>
                      <View style={[styles.skeletonLine, { width: "62%", backgroundColor: glassIconBg || "rgba(255,255,255,0.08)" }]} />
                      <View style={[styles.skeletonLine, { width: "38%", backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" }]} />
                    </View>
                  </View>
                ))}
                <Text style={[styles.loadingLabel, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Carregando pedidos...
                </Text>
              </View>
            ) : purchases.length === 0 ? (
              <View style={styles.empty}>
                <View
                  style={[
                    styles.emptyIconWrap,
                    { backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" },
                  ]}
                >
                  <Ionicons
                    name="bag-handle-outline"
                    size={30}
                    color={textFaint || "rgba(255,255,255,0.28)"}
                  />
                </View>
                <Text style={[styles.emptyTitle, { color: textSecondary || "rgba(255,255,255,0.75)" }]}>
                  Nenhuma compra ainda
                </Text>
                <Text style={[styles.emptyText, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Seus pedidos aparecerão aqui assim que você fizer sua primeira compra na loja Drakos.
                </Text>
              </View>
            ) : (
              purchases.map((purchase, idx) => (
                <View key={purchase.id || purchase.id_pedido || `purchase-${idx}`}>
                  <PurchaseCard
                    purchase={purchase}
                    onPress={onSelectPurchase}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                    textMuted={textMuted}
                    accent={accent}
                    glassBorder={glassBorder}
                    glassIconBg={glassIconBg}
                  />
                  {idx < purchases.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: dividerColor || "rgba(255,255,255,0.07)" }]} />
                  )}
                </View>
              ))
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
    maxHeight: "85%",
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
  },
  headerIconBg: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
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
  divider: {
    height: 1,
    marginLeft: 56,
  },

  // ── Loading skeleton ────────────────────────────────────────────────────
  loadingWrap: {
    paddingTop: 4,
    gap: 10,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 10,
    gap: 12,
  },
  skeletonThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
    paddingVertical: 36,
    paddingHorizontal: 24,
    gap: 4,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12.5,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default PurchaseHistoryModal;
