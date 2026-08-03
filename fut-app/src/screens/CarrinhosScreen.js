import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useTheme } from "../contexts/ThemeContext";
import CheckoutModal from "./CheckoutModal";
import { makeStyles, DARK_DS, LIGHT_DS } from "../styles/styleCarrinhos/styleCarrinhos";
import { checkout, previewCheckout } from "../services/checkoutService";

const resolveImageSource = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return { uri: value };
  }

  return value;
};

const formatBRL = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const itemKey = (item) => `${item.id}::${item.tamanho || "__no-size__"}`;

const CartItem = ({
  item,
  pricing,
  onUpdateQuantity,
  onRemove,
  styles,
  DS,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const itemOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRemoveAnimation = () => {
    Animated.timing(itemOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onRemove(item.id, item.tamanho);
      itemOpacity.setValue(1);
    });
  };

  const handleIncrement = () =>
    onUpdateQuantity(item.id, item.tamanho, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1)
      onUpdateQuantity(item.id, item.tamanho, item.quantity - 1);
  };

  const getImageSource = () => {
    if (Array.isArray(item.imagens) && item.imagens.length > 0) {
      return item.imagens[0];
    }
    if (item.imagem) return item.imagem;
    if (item.image) return item.image;
    if (item.imageUrl) return item.imageUrl;
    if (item.url) return item.url;
    if (item.produto) {
      if (
        Array.isArray(item.produto.imagens) &&
        item.produto.imagens.length > 0
      ) {
        return item.produto.imagens[0];
      }
      if (item.produto.imagem) return item.produto.imagem;
      if (item.produto.image) return item.produto.image;
    }
    return null;
  };

  const imageSource = getImageSource();
  const resolvedImageSource = resolveImageSource(imageSource);

  console.log("[CarrinhosScreen] cart item image payload", {
    id: item.id,
    tamanho: item.tamanho ?? null,
    imagem: item.imagem ?? null,
    image: item.image ?? null,
    imagens: item.imagens ?? null,
    imageSource,
    resolvedImageSource,
  });

  return (
    <Animated.View
      style={[
        styles.cartItemContainer,
        { transform: [{ scale: scaleAnim }], opacity: itemOpacity },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cartItem}>
          <View style={styles.imageWrapper}>
            {resolvedImageSource ? (
              <Image
                source={resolvedImageSource}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="shirt-outline" size={28} color={DS.colors.imagePlaceholderIcon} />
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.sectionLabel}>DescriÃ§Ã£o do pedido</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.nome || "Produto sem nome"}
            </Text>

            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>
                Tamanho:{" "}
                <Text style={styles.detailValue}>{item.tamanho || "#"}</Text>
              </Text>
              <Text style={styles.detailText}>
                Qtd:{" "}
                <Text style={styles.detailValue}>
                  {item.quantity.toString().padStart(2, "0")}
                </Text>
              </Text>
            </View>

            <View style={styles.pricingBlock}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Preço original</Text>
                <Text style={styles.pricingValueMuted}>{formatBRL(pricing?.preco_original_unitario ?? item.precoOriginal ?? item.preco ?? item.price)}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Preço final</Text>
                <Text style={styles.pricingValue}>{formatBRL(pricing?.preco_final_unitario ?? item.precoFinal ?? item.preco ?? item.price)}</Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Economia</Text>
                <Text style={styles.economyText}>{formatBRL(pricing?.economia_total ?? item.economia_total ?? item.economia ?? 0)}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={[
                    styles.qtyBtn,
                    item.quantity <= 1 && styles.qtyBtnDisabled,
                  ]}
                  disabled={item.quantity <= 1}
                >
                  <Text
                    style={[
                      styles.qtySymbol,
                      item.quantity <= 1 && { color: DS.colors.qtySymbolDisabled },
                    ]}
                  >
                    -</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNumber}>
                  {item.quantity.toString().padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtySymbol}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleRemoveAnimation}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={DS.colors.accent}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


export default function CarrinhosScreen({ navigation }) {
  const { isDark } = useTheme();

  const DS = useMemo(
    () => (isDark ? DARK_DS : LIGHT_DS),
    [isDark],
  );

  const styles = useMemo(() => makeStyles(DS), [DS]);
  const { cartItems, updateQuantity, removeItem, clearCart, subtotal } =
    useCart();
  const { token } = useAuth();
  const { subscription } = useSubscription();
  const total = subtotal;
  const hasItems = cartItems.length > 0;
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [checkoutSnapshot, setCheckoutSnapshot] = useState({
    cartItems: [],
    total: 0,
  });
  const [pricingSummary, setPricingSummary] = useState(null);

  const pricingMap = useMemo(() => {
    const map = new Map();
    const items = Array.isArray(pricingSummary?.itens) ? pricingSummary.itens : [];

    items.forEach((item) => {
      map.set(`${String(item.produto_id)}::${String(item.tamanho || "__no-size__")}`, item);
    });

    return map;
  }, [pricingSummary]);

  useEffect(() => {
    let cancelled = false;

    const loadPricing = async () => {
      if (!token || !hasItems) {
        setPricingSummary(null);
        return;
      }

      try {
        const payload = {
          itens: cartItems.map((item) => ({
            produto_id: item.id,
            quantidade: item.quantity,
            ...(item.tamanho ? { tamanho: item.tamanho } : {}),
          })),
        };

        const response = await previewCheckout(payload, token);
        if (!cancelled) {
          setPricingSummary(response);
        }
      } catch (error) {
        if (!cancelled) {
          setPricingSummary(null);
        }
      }
    };

    loadPricing();

    return () => {
      cancelled = true;
    };
  }, [cartItems, hasItems, token]);

  // ==================== FRONT (CABEÃ‡ALHO) ====================
  // CabeÃ§alho superior com tÃ­tulo MEU CARRINHO e botÃ£o Limpar
  // =============================================================

  const handleCheckout = () => {
    if (!hasItems) {
      return;
    }

    setCheckoutSnapshot({
      cartItems: [...cartItems],
      total: pricingSummary?.total_final ?? total,
    });
    setCheckoutVisible(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutVisible(false);
    setCheckoutSnapshot({ cartItems: [], total: 0 });
  };

  const handleConfirmPurchase = async () => {
    if (!token) {
      const error = new Error(
        "Você precisa estar autenticado para finalizar a compra.",
      );
      error.status = 401;
      throw error;
    }

    const payload = {
      itens: checkoutSnapshot.cartItems.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantity,
        ...(item.tamanho ? { tamanho: item.tamanho } : {}),
      })),
    };

    try {
      const response = await checkout(payload, token);
      clearCart();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleGoToShop = () => {
    setCheckoutVisible(false);
    navigation.navigate('MainTabs', { screen: 'Loja' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={DS.statusBarStyle} />

      {/* ==================== FRONT (CABEÃ‡ALHO) ==================== */}
      {/* CabeÃ§alho superior com botÃ£o voltar, tÃ­tulo MEU CARRINHO e botÃ£o Limpar */}
      {/* ============================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={DS.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MEU CARRINHO</Text>
        <TouchableOpacity onPress={() => hasItems && clearCart()}>
          <Text
            style={[styles.clearText, !hasItems && styles.clearTextDisabled]}
          >
            Limpar
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==================== SCROLLVIEW (ITENS DO CARRINHO) ==================== */}
      {/* Lista rolÃ¡vel com os itens do carrinho ou estado vazio */}
      {/* ==================================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          hasItems ? styles.scrollContent : styles.emptyScrollContent
        }
      >
        {hasItems ? (
          cartItems.map((item) => (
          <CartItem
              key={`${item.id}-${item.tamanho}`}
              item={item}
              pricing={pricingMap.get(itemKey(item))}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              styles={styles}
              DS={DS}
          />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
                <Ionicons
                    name="cart-outline"
                    size={28}
                    color={DS.colors.accent}
                />
            </View>
            <Text style={styles.emptyTitle}>Sacola vazia</Text>
            <Text style={styles.emptySubtitle}>
              Parece que você ainda não escolheu seu manto.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate("Loja")}
            >
              <Text style={styles.shopButtonText}>Explorar Loja</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ==================== BOTTOM BAR (TOTAL + CHECKOUT) ==================== */}
      {/* Barra inferior fixa com total e botÃ£o de compra (apenas se houver itens) */}
      {/* ====================================================================== */}

      {hasItems && (
        <View style={styles.bottomBarContainer}>
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.totalLabel}>Total geral</Text>
              {pricingSummary?.subtotal_original != null ? (
                <Text style={styles.totalOldAmount}>{formatBRL(pricingSummary.subtotal_original)}</Text>
              ) : null}
              <Text style={styles.totalAmount}>
                {formatBRL(pricingSummary?.total_final ?? total)}
              </Text>
              {pricingSummary?.economia_total != null ? (
                <Text style={styles.totalSavings}>Economia {formatBRL(pricingSummary.economia_total)}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutText}>Comprar</Text>
              <View style={styles.checkoutIcon}>
                <Ionicons name="arrow-forward" size={18} color={DS.colors.checkoutIconColor} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CheckoutModal
        visible={checkoutVisible}
        cartItems={checkoutSnapshot.cartItems}
        total={checkoutSnapshot.total}
        pricingSummary={pricingSummary}
        planBenefits={subscription?.beneficios ?? []}
        onClose={handleCloseCheckout}
        onConfirmPurchase={handleConfirmPurchase}
        onGoToShop={handleGoToShop}
      />
    </SafeAreaView>
  );
}


