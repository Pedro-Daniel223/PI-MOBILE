import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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

  return (
    <View style={styles.row}>
      <View style={styles.imageStage}>
        {imagem ? (
          <Image source={imagem} style={styles.productImage} />
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: glassIconBg || "rgba(255,255,255,0.06)" }]}>
            <Ionicons name="cube-outline" size={16} color={accent || "#e8000f"} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: textPrimary || "#fff" }]} numberOfLines={2}>
          {produtoNome}
        </Text>
        <View style={styles.metaRow}>
          {tamanho ? (
            <Text style={[styles.meta, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
              Tam. {tamanho}
            </Text>
          ) : null}
          <Text style={[styles.meta, { color: textMuted || "rgba(255,255,255,0.45)" }]}>
            Qtd. {String(quantidade).padStart(2, "0")}
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
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  imageStage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 13.5,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
  },
  values: {
    alignItems: "flex-end",
  },
  subtotal: {
    fontSize: 13.5,
    fontWeight: "700",
  },
  unit: {
    fontSize: 11,
    marginTop: 1,
  },
});

export default PurchaseItemCard;
