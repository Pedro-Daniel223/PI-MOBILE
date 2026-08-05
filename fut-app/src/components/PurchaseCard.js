import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

const PurchaseCard = React.memo(function PurchaseCard({
  purchase,
  onPress,
  style,
  textPrimary,
  textSecondary,
  textMuted,
  accent,
  glassBorder,
  glassIconBg,
}) {
  if (!purchase) {
    return null;
  }

  const primeiroItem = Array.isArray(purchase.items) && purchase.items.length > 0
    ? purchase.items[0]
    : {};

  const pedidoNome =
    purchase.productName ||
    primeiroItem.produto_nome ||
    "Pedido";

  const pedidoData = purchase.date || formatHistoryDate(purchase.date);
  const pedidoStatus = purchase.status || "";
  const pedidoValor = purchase.price || "";
  const pedidoQtd = purchase.quantity ?? 0;
  const itemImages = Array.isArray(purchase.itemImages) ? purchase.itemImages : [];
  const imagem = itemImages[0] || purchase.productImage || null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(purchase)}
      style={[styles.card, style]}
    >
      <View style={styles.imageStage}>
        {imagem ? (
          <Image source={imagem} style={styles.productImage} />
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" }]}>
            <Ionicons name="bag-outline" size={18} color={accent || "#e8000f"} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.plan, { color: textPrimary || "#fff" }]} numberOfLines={1}>
          {pedidoNome}
        </Text>
        <Text style={[styles.date, { color: textMuted || "rgba(255,255,255,0.45)" }]} numberOfLines={1}>
          {`${pedidoData}${pedidoStatus ? ` • ${pedidoStatus}` : ""}`}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.price, { color: textPrimary || "#fff" }]}>
          {pedidoValor}
        </Text>
        {pedidoQtd > 0 && (
          <Text style={[styles.qty, { color: textSecondary || "rgba(255,255,255,0.7)" }]}>
            {pedidoQtd} {pedidoQtd === 1 ? "item" : "itens"}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  imageStage: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  plan: {
    fontSize: 13.5,
    fontWeight: "600",
  },
  date: {
    fontSize: 11,
    marginTop: 1,
  },
  meta: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  qty: {
    fontSize: 11,
    marginTop: 1,
  },
});

export default PurchaseCard;
