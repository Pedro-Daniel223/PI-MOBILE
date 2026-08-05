import React from "react";
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PurchaseCard from "./PurchaseCard";

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
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: modalTitleColor || "#fff" }]}>
                Minhas Compras
              </Text>
              <Text style={[styles.modalSubtitle, { color: modalSubtitleColor || "rgba(255,255,255,0.5)" }]}>
                Selecione um pedido para ver os detalhes
              </Text>
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
            {loading ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Carregando...
                </Text>
              </View>
            ) : purchases.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons
                  name="document-text-outline"
                  size={30}
                  color={textFaint || "rgba(255,255,255,0.22)"}
                />
                <Text style={[styles.emptyText, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                  Nenhuma compra encontrada
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
    maxHeight: "85%",
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    marginLeft: 50,
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

export default PurchaseHistoryModal;
