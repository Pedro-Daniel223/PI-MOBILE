import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable, Image } from "react-native";
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

// ── Cor de status → chip semântico sutil (apenas apresentação) ──────────────
const STATUS_STYLE = {
  entregue: { icon: "checkmark-circle", tone: "positive" },
  concluido: { icon: "checkmark-circle", tone: "positive" },
  concluído: { icon: "checkmark-circle", tone: "positive" },
  pago: { icon: "checkmark-circle", tone: "positive" },
  enviado: { icon: "airplane-outline", tone: "neutral" },
  "em transito": { icon: "airplane-outline", tone: "neutral" },
  "em trânsito": { icon: "airplane-outline", tone: "neutral" },
  processando: { icon: "time-outline", tone: "neutral" },
  pendente: { icon: "time-outline", tone: "warning" },
  cancelado: { icon: "close-circle-outline", tone: "negative" },
};

const getStatusMeta = (status) => {
  const key = String(status || "").toLowerCase().trim();
  return STATUS_STYLE[key] || { icon: "ellipse-outline", tone: "neutral" };
};

const TONE_COLORS = {
  positive: "#3ecf7a",
  warning: "#e0a530",
  negative: "#ff6b6b",
  neutral: null, // usa accent do tema
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

  const statusMeta = getStatusMeta(pedidoStatus);
  const statusColor = TONE_COLORS[statusMeta.tone] || accent || "#e8000f";

  // ── Feedback tátil de pressão (200ms) ──────────────────────────────────────
  const pressAnim = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 110,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.978] });
  const bgOpacity = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Pressable
      onPress={() => onPress?.(purchase)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, style, { transform: [{ scale }] }]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pressOverlay,
            { opacity: bgOpacity, backgroundColor: glassIconBg || "rgba(255,255,255,0.05)" },
          ]}
        />

        <View style={styles.imageStage}>
          {imagem ? (
            <Image source={imagem} style={styles.productImage} />
          ) : (
            <View style={[styles.iconWrap, { backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" }]}>
              <Ionicons name="bag-outline" size={19} color={accent || "#e8000f"} />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.plan, { color: textPrimary || "#fff" }]} numberOfLines={1}>
            {pedidoNome}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.date, { color: textMuted || "rgba(255,255,255,0.45)" }]} numberOfLines={1}>
              {pedidoData}
            </Text>
            {pedidoStatus ? (
              <>
                <View style={[styles.dot, { backgroundColor: textMuted || "rgba(255,255,255,0.3)" }]} />
                <Ionicons name={statusMeta.icon} size={11} color={statusColor} />
                <Text style={[styles.statusText, { color: statusColor }]} numberOfLines={1}>
                  {pedidoStatus}
                </Text>
              </>
            ) : null}
          </View>
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

        <Ionicons
          name="chevron-forward"
          size={16}
          color={textMuted || "rgba(255,255,255,0.35)"}
          style={styles.chevron}
        />
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    gap: 12,
    overflow: "hidden",
  },
  pressOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  imageStage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginRight: 8,
    gap: 3,
  },
  plan: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  date: {
    fontSize: 11.5,
    fontWeight: "500",
  },
  dot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  meta: {
    alignItems: "flex-end",
    gap: 2,
  },
  price: {
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  qty: {
    fontSize: 11,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: 2,
  },
});

export default PurchaseCard;