import React from "react";
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PurchaseItemCard from "./PurchaseItemCard";

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

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: modalOverlay || "rgba(0,0,0,0.55)" }]}>
        <View style={styles.modalCard}>
          <BlurView
            intensity={55}
            tint={modalBlurTint || "dark"}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={modalFillGradient || ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.modalBorder, { borderColor: modalBorder || "rgba(255,255,255,0.16)" }]} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
              {onBack && (
                <TouchableOpacity
                  style={[styles.backBtn, { backgroundColor: closeBtnBg || "rgba(255,255,255,0.10)", borderColor: closeBtnBorder || "rgba(255,255,255,0.16)" }]}
                  onPress={onBack}
                  activeOpacity={0.75}
                >
                  <Ionicons name="chevron-back" size={18} color={closeBtnIcon || "#fff"} />
                </TouchableOpacity>
              )}
              <View>
                <Text style={[styles.modalTitle, { color: modalTitleColor || "#fff" }]}>
                  Detalhes do Pedido
                </Text>
                <Text style={[styles.modalSubtitle, { color: modalSubtitleColor || "rgba(255,255,255,0.5)" }]}>
                  {pedidoData}
                  {pedidoStatus ? ` • ${pedidoStatus}` : ""}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.closeIconBtn, { backgroundColor: closeBtnBg || "rgba(255,255,255,0.10)", borderColor: closeBtnBorder || "rgba(255,255,255,0.16)" }]}
              onPress={onClose}
              activeOpacity={0.75}
            >
              <Ionicons name="close" size={18} color={closeBtnIcon || "#fff"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
                  Total
                </Text>
                <Text style={[styles.summaryValue, { color: textPrimary || "#fff" }]}>
                  {pedidoValor}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
                  Itens
                </Text>
                <Text style={[styles.summaryValue, { color: textPrimary || "#fff" }]}>
                  {pedidoQtd}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: dividerColor || "rgba(255,255,255,0.07)" }]} />

            {loading ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Carregando...
                </Text>
              </View>
            ) : itens.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons
                  name="cube-outline"
                  size={26}
                  color={textFaint || "rgba(255,255,255,0.22)"}
                />
                <Text style={[styles.emptyText, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Nenhum item encontrado
                </Text>
              </View>
            ) : (
              itens.map((item, idx) => (
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
              ))
            )}
          </ScrollView>
        </View>
      </View>
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
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 24,
    overflow: "hidden",
  },
  modalBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 0.75,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  modalSubtitle: {
    fontSize: 12,
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
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryItem: {
    alignItems: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "800",
  },
  divider: {
    height: 1,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 12.5,
    textAlign: "center",
  },
});

export default PurchaseDetailsModal;
