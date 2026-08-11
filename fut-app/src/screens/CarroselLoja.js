// src/components/FullScreenProductCarousel.js

import React, { memo, useCallback, useMemo, useRef, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProducts } from "../contexts/ProductContext";

// Estrutura pronta para campanhas locais.
// Amanhã, normalmente só precisamos trocar:
// 1. o `require(...)` da imagem
// 2. o `productId` que aponta para o produto real da API
const CAMPAIGNS = [
  {
    // image: require("../../assets/img/primerio_carrosel.png"),
    productId: 4,
    title: "Lançamento 24/25",
    description:
      "A camisa principal da temporada chega em destaque com visual editorial.",
  },
  {
    // image: require("../../assets/img/uniforme_segundo_casrrosel.png"),
    productId: 5,
    title: "Segunda Pele",
    description:
      "A campanha do uniforme visitante com imagem local e produto real da loja.",
  },
  {
    // image: require("../../assets/img/terceiro_uniforme.png"),
    productId: 6,
    title: "Terceiro Kit",
    description:
      "Terceira camisa em foco, pronta para receber outro `require(...)` depois.",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const DEFAULT_IMAGE = require("../../assets/img/icon_escudo_drakos.png");

const formatBRL = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

const getProductId = (product) =>
  product?.id_produtos ??
  product?.id ??
  product?.produto_id ??
  product?.idProduto;

const getProductName = (product) =>
  product?.nome_produtos ??
  product?.nome ??
  product?.titulo ??
  product?.name ??
  "Produto Drakos";

const getProductDescription = (product) =>
  product?.descricao_produtos ??
  product?.descricao ??
  product?.description ??
  product?.subtitulo ??
  "Conheça um dos destaques da coleção oficial Drakos FC.";

const getProductCategory = (product) =>
  product?.categoria?.nome_categoria ??
  product?.categoria?.nome ??
  product?.categoria_produto ??
  product?.categoria ??
  product?.tipo_produto ??
  "DRAKOS FC";

const getProductImage = (product) => {
  const directImage =
    product?.imagem_principal ??
    product?.imagem ??
    product?.image ??
    product?.url_imagem;

  if (typeof directImage === "string" && directImage.trim()) {
    return directImage;
  }

  const images =
    product?.imagens ??
    product?.images ??
    product?.fotos ??
    product?.produto_imagens;

  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];

    if (typeof first === "string") {
      return first;
    }

    return (
      first?.url ??
      first?.imagem ??
      first?.image ??
      first?.imagem_url ??
      DEFAULT_IMAGE
    );
  }

  return DEFAULT_IMAGE;
};

const getFinalPrice = (product) =>
  product?.preco_final ??
  product?.preco ??
  product?.valor ??
  product?.price ??
  null;

const getOriginalPrice = (product) =>
  product?.preco_original ?? product?.preco_bruto ?? product?.old_price ?? null;

const getDiscount = (product) =>
  Number(
    product?.desconto_percent ??
      product?.desconto_percentual ??
      product?.percentual_desconto ??
      0,
  ) || 0;

const getProductStock = (product) =>
  Number(
    product?.estoque_produtos ??
      product?.quantidade_estoque_produtos ??
      product?.estoque ??
      0,
  ) || 0;

const CarouselImage = memo(({ source, fallbackSource, style }) => {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    <View style={[style, styles.imageContainer]}>
      <Image
        source={failed ? fallbackSource : source}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
        fadeDuration={Platform.OS === "android" ? 180 : 0}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          if (!failed) {
            setFailed(true);
          }
          setLoading(false);
        }}
      />

      {loading && (
        <View style={styles.imageLoading}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
});

const ProductSlide = memo(
  ({
    campaign,
    product,
    source,
    width,
    height,
    bottomInset,
    onDetails,
    onBuy,
  }) => {
    const productName = getProductName(product);
    const description = campaign?.description ?? getProductDescription(product);
    const category = campaign?.title ?? getProductCategory(product);

    const finalPrice = getFinalPrice(product);
    const originalPrice = getOriginalPrice(product);
    const discount = getDiscount(product);
    const stock = getProductStock(product);

    const hasOriginalPrice =
      originalPrice && finalPrice && Number(originalPrice) > Number(finalPrice);

    return (
      <View
        style={[
          styles.slide,
          {
            width,
            height,
          },
        ]}
      >
        <CarouselImage
          source={source}
          fallbackSource={DEFAULT_IMAGE}
          style={{
            width,
            height,
          }}
        />

        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(0,0,0,0.12)",
            "rgba(0,0,0,0.00)",
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.42)",
            "rgba(0,0,0,0.88)",
            "#000000",
          ]}
          locations={[0, 0.22, 0.43, 0.63, 0.83, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,0,0,0.48)", "transparent"]}
          style={styles.topGradient}
        />

        <View
          style={[
            styles.content,
            {
              paddingBottom: Math.max(bottomInset + 26, 38),
            },
          ]}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>D</Text>
            </View>

            <Text style={styles.categoryText} numberOfLines={1}>
              {String(category).toUpperCase()}
            </Text>
          </View>

          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Ionicons name="flash" size={13} color="#FFFFFF" />

              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}

          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.76}
            style={styles.title}
          >
            {productName}
          </Text>

          <Text numberOfLines={3} style={styles.description}>
            {description}
          </Text>

          <View style={styles.stockBadge}>
            <Ionicons
              name={stock > 0 ? "cube-outline" : "alert-circle-outline"}
              size={12}
              color="rgba(255,255,255,0.92)"
            />
            <Text style={styles.stockText}>
              {stock > 0 ? `Estoque ${stock}` : "Estoque indisponível"}
            </Text>
          </View>

          {finalPrice != null && (
            <View style={styles.priceContainer}>
              {hasOriginalPrice && (
                <Text style={styles.originalPrice}>
                  {formatBRL(originalPrice)}
                </Text>
              )}

              <Text style={styles.finalPrice}>{formatBRL(finalPrice)}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={() =>
                onDetails({ product, productId: campaign?.productId })
              }
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Saiba Mais</Text>
            </Pressable>

            <Pressable
              onPress={() => onBuy({ product, productId: campaign?.productId })}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Comprar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  },
);

export default function FullScreenProductCarousel({
  navigation,
  products: receivedProducts,
  onSearchPress,
  onProductPress,
  onBuyPress,
  maxItems = 8,
  showSearch = true,
}) {
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const productContext = useProducts?.();

  const contextProducts =
    productContext?.products ??
    productContext?.produtos ??
    productContext?.data ??
    [];

  const isLoading =
    productContext?.loading ?? productContext?.isLoading ?? false;

  const [activeIndex, setActiveIndex] = useState(0);

  const productLookup = useMemo(() => {
    const lookup = new Map();
    const source = Array.isArray(contextProducts) ? contextProducts : [];

    source.forEach((product) => {
      const productId = getProductId(product);

      if (productId != null) {
        lookup.set(String(productId), product);
      }
    });

    return lookup;
  }, [contextProducts]);

  const slides = useMemo(
    () =>
      CAMPAIGNS.slice(0, maxItems).map((campaign, index) => {
        const product = productLookup.get(String(campaign.productId)) ?? null;

        return {
          key: `campaign-${String(campaign.productId)}-${index}`,
          campaign,
          product,
          productId: campaign.productId,
          source: campaign.image,
        };
      }),
    [maxItems, productLookup],
  );

  const handleDetails = useCallback(
    ({ product, productId }) => {
      if (onProductPress) {
        onProductPress(product ?? { id: productId, id_produtos: productId });
        return;
      }

      const resolvedProductId = productId ?? getProductId(product);
      const params = {
        produtoId: resolvedProductId,
        productId: resolvedProductId,
      };

      if (product) {
        params.produto = product;
        params.product = product;
      }

      navigation?.navigate?.("DetalhesProdutos", params);
    },
    [navigation, onProductPress],
  );

  const handleBuy = useCallback(
    ({ product, productId }) => {
      if (onBuyPress) {
        onBuyPress(product ?? { id: productId, id_produtos: productId });
        return;
      }

      const resolvedProductId = productId ?? getProductId(product);
      const params = {
        produtoId: resolvedProductId,
        productId: resolvedProductId,
        comprarAgora: true,
      };

      if (product) {
        params.produto = product;
        params.product = product;
      }

      navigation?.navigate?.("DetalhesProdutos", params);
    },
    [navigation, onBuyPress],
  );

  const handleSearch = useCallback(() => {
    if (onSearchPress) {
      onSearchPress();
      return;
    }

    navigation?.navigate?.("MainTabs", {
      screen: "Loja",
    });
  }, [navigation, onSearchPress]);

  const handleGoBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("MainTabs", {
      screen: "Loja",
    });
  }, [navigation]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 80,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems?.length) {
      return;
    }

    const index = viewableItems[0]?.index;

    if (typeof index === "number") {
      setActiveIndex(index);
    }
  });

  const renderItem = useCallback(
    ({ item }) => (
      <ProductSlide
        campaign={item.campaign}
        product={item.product}
        source={item.source}
        width={width}
        height={height}
        bottomInset={insets.bottom}
        onDetails={handleDetails}
        onBuy={handleBuy}
      />
    ),
    [width, height, insets.bottom, handleDetails, handleBuy],
  );

  const keyExtractor = useCallback((item, index) => {
    return item?.key ?? `featured-${index}`;
  }, []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width],
  );

  if (isLoading && slides.length === 0) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <ActivityIndicator size="large" color="#FFFFFF" />

        <Text style={styles.loadingText}>Carregando destaques...</Text>
      </View>
    );
  }

  if (!slides.length) {
    return (
      <View style={styles.emptyScreen}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <View style={styles.emptyIcon}>
          <Ionicons name="shirt-outline" size={34} color="#FFFFFF" />
        </View>

        <Text style={styles.emptyTitle}>Nenhum destaque disponível</Text>

        <Text style={styles.emptyDescription}>
          Os produtos em destaque aparecerão aqui.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        getItemLayout={getItemLayout}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={Platform.OS === "android"}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />

      <View
        pointerEvents="box-none"
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "android" ? 10 : 4),
          },
        ]}
      >
        <Pressable
          hitSlop={12}
          onPress={handleGoBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a loja"
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </Pressable>

        {showSearch && (
          <Pressable
            hitSlop={14}
            onPress={handleSearch}
            style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.searchButtonPressed,
            ]}
          >
            <Ionicons name="search-outline" size={30} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      {slides.length > 1 && (
        <View
          pointerEvents="none"
          style={[
            styles.pagination,
            {
              bottom: Math.max(insets.bottom + 202, 212),
            },
          ]}
        >
          {slides.map((slide, index) => {
            const isActive = activeIndex === index;

            return (
              <View
                key={`dot-${slide.key ?? index}-${index}`}
                style={[
                  styles.paginationDot,
                  isActive
                    ? styles.paginationDotActive
                    : styles.paginationDotInactive,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  slide: {
    backgroundColor: "#000000",
    overflow: "hidden",
  },

  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#080808",
  },

  imageLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080808",
  },

  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 190,
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    zIndex: 20,

    paddingHorizontal: 22,
    paddingBottom: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  searchButton: {
    width: 50,
    height: 50,

    borderRadius: 25,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(10,10,10,0.22)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  searchButtonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.75,
  },

  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 24,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  brandMark: {
    width: 29,
    height: 29,

    borderRadius: 15,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  brandMarkText: {
    color: "#000000",

    fontSize: 16,
    fontWeight: "900",
  },

  categoryText: {
    flexShrink: 1,

    color: "rgba(255,255,255,0.84)",

    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.6,
  },

  discountBadge: {
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 999,

    marginBottom: 11,

    backgroundColor: "rgba(255,255,255,0.14)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  discountText: {
    color: "#FFFFFF",

    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  title: {
    color: "#FFFFFF",

    fontSize: Math.min(SCREEN_WIDTH * 0.105, 46),

    lineHeight: Math.min(SCREEN_WIDTH * 0.115, 50),

    fontWeight: "900",
    letterSpacing: -1.25,

    maxWidth: "94%",
  },

  description: {
    color: "rgba(255,255,255,0.80)",

    fontSize: 16,
    lineHeight: 22,

    fontWeight: "600",

    marginTop: 9,

    maxWidth: "94%",
  },

  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    gap: 6,

    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  stockText: {
    color: "#FFFFFF",

    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  priceContainer: {
    marginTop: 14,

    flexDirection: "row",
    alignItems: "baseline",

    gap: 10,
  },

  originalPrice: {
    color: "rgba(255,255,255,0.52)",

    fontSize: 14,
    fontWeight: "600",

    textDecorationLine: "line-through",
  },

  finalPrice: {
    color: "#FFFFFF",

    fontSize: 21,
    fontWeight: "900",

    letterSpacing: -0.3,
  },

  actions: {
    flexDirection: "row",

    width: "100%",

    gap: 12,

    marginTop: 22,
  },

  primaryButton: {
    flex: 1,

    minHeight: 58,

    paddingHorizontal: 18,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#080808",

    fontSize: 15,
    fontWeight: "900",
  },

  secondaryButton: {
    flex: 1,

    minHeight: 58,

    paddingHorizontal: 18,

    borderRadius: 999,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(0,0,0,0.20)",

    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.88)",
  },

  secondaryButtonText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.975 }],
  },

  pagination: {
    position: "absolute",

    left: 24,

    zIndex: 12,

    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  paginationDot: {
    height: 4,
    borderRadius: 999,
  },

  paginationDotActive: {
    width: 26,
    backgroundColor: "#FFFFFF",
  },

  paginationDotInactive: {
    width: 7,
    backgroundColor: "rgba(255,255,255,0.38)",
  },

  loadingScreen: {
    flex: 1,

    backgroundColor: "#000000",

    alignItems: "center",
    justifyContent: "center",

    gap: 14,
  },

  loadingText: {
    color: "rgba(255,255,255,0.70)",

    fontSize: 14,
    fontWeight: "600",
  },

  emptyScreen: {
    flex: 1,

    backgroundColor: "#000000",

    paddingHorizontal: 30,

    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: {
    width: 72,
    height: 72,

    borderRadius: 36,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,

    backgroundColor: "rgba(255,255,255,0.08)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  emptyTitle: {
    color: "#FFFFFF",

    fontSize: 21,
    fontWeight: "900",

    textAlign: "center",
  },

  emptyDescription: {
    color: "rgba(255,255,255,0.60)",

    fontSize: 14,
    lineHeight: 20,

    textAlign: "center",

    marginTop: 7,
  },
});
