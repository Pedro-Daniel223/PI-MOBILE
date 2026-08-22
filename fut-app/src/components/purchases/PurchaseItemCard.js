import React, { useRef } from "react";
import { View, Text, StyleSheet, Image, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PurchaseItemCard = React.memo(function PurchaseItemCard({
  item,
  index,
  textPrimary,
  textSecondary,
  textMuted,
  textFaint,
  accent,
  glassIconBg,
}) {
  if (!item) {
    return null;
  }

  const produtoNome = item.produto_nome || "Produto";
  const quantidade = Number(item.quantidade || 1);
  const valor = Number(item.valor || 0);
  const subtotal = Number(item.subtotal || 0);
  const tamanho = item.tamanho || "";
  const imagem = item.produto_imagem || null;

  const formatBRL = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // ── Microanimação de entrada (fade + slide sutil), ~260ms ─────────────────
  const enterAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 260,
      delay: Math.min(index || 0, 6) * 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── Feedback de pressão (apenas visual, sem onPress funcional) ────────────
  const pressAnim = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };
  const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] });

  const badgeBg = accent ? `${accent}1f` : "rgba(232,0,15,0.12)";

  return (
    <Animated.View
      style={{
        opacity: enterAnim,
        transform: [
          { scale },
          {
            translateY: enterAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={styles.row}>
          <View style={[styles.imageStage, { backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" }]}>
            {imagem ? (
              <Image source={imagem} style={styles.productImage} />
            ) : (
              <Ionicons name="cube-outline" size={18} color={accent || "#e8000f"} />
            )}
          </View>

          <View style={styles.info}>
            <Text style={[styles.name, { color: textPrimary || "#fff" }]} numberOfLines={2}>
              {produtoNome}
            </Text>
            <View style={styles.metaRow}>
              {tamanho ? (
                <View style={[styles.metaChip, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.metaChipText, { color: accent || "#e8000f" }]}>
                    Tam. {tamanho}
                  </Text>
                </View>
              ) : null}
              <Text style={[styles.meta, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
                {`${String(quantidade).padStart(2, "0")}× unidade${quantidade === 1 ? "" : "s"}`}
              </Text>
            </View>
          </View>

          <View style={styles.values}>
            <Text style={[styles.subtotal, { color: textPrimary || "#fff" }]}>
              {formatBRL(subtotal)}
            </Text>
            {quantidade > 1 && (
              <Text style={[styles.unit, { color: textFaint || "rgba(255,255,255,0.35)" }]}>
                {formatBRL(valor)} un.
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 13,
  },
  imageStage: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: 46,
    height: 46,
    borderRadius: 13,
  },
  info: {
    flex: 1,
    marginRight: 10,
    gap: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.1,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaChip: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  metaChipText: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  meta: {
    fontSize: 11.5,
    fontWeight: "500",
  },
  values: {
    alignItems: "flex-end",
    gap: 2,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
  unit: {
    fontSize: 10.5,
    fontWeight: "500",
  },
});

export default PurchaseItemCard;