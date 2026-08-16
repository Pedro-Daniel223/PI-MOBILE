// src/components/FullScreenProductCarousel.js

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Dimensions,
  Animated,
  FlatList,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProducts } from "../contexts/ProductContext";

// Estrutura pronta para campanhas locais.
// Amanhã, normalmente só precisamos trocar:
// 1. o `require(...)` da imagem
// 2. o `productId` que aponta para o produto real da API
const CAMPAIGNS = [
  {
    image: require("../../assets/img/PessoasModelos/Modelo3.png"),
    productId: 42,
    title: "Lançamento 24/25",
    description:
      "A camisa principal da temporada chega em destaque com visual editorial.",
  },
  {
    image: require("../../assets/img/PessoasModelos/Modelo2.png"),
    productId: 61,
    title: "Segunda Pele",
    description:
      "A campanha do uniforme visitante com imagem local e produto real da loja.",
  },
  {
    image: require("../../assets/img/PessoasModelos/Modelo1.png"),
    productId: 66,
    title: "Terceiro Kit",
    description:
      "Feito para clima de frio, o terceiro kit da temporada é destaque com modelo real.",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const IS_ANDROID = Platform.OS === "android";

const DEFAULT_IMAGE = require("../../assets/img/PessoasModelos/Modelo3.png");

const PAYMENT_INFO_ITEMS = [
  "Pix",
  "cartão de crédito",
  "parcelamento conforme condições exibidas no checkout",
];

const PAYMENT_INFO_NOTE =
  "As condições finais aparecem antes da confirmação da compra.";

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

const CarouselImage = memo(({ source, uri, style }) => {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const imageSource = source
    ? source
    : {
        uri: failed ? DEFAULT_IMAGE : uri,
      };

  return (
    <View style={[style, styles.imageContainer]}>
      <Image
        source={imageSource}
        resizeMode={IS_ANDROID ? "cover" : "contain"}
        style={[styles.heroImage, IS_ANDROID && styles.heroImageAndroid]}
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
    onLearnMore,
    onBuy,
    overlayVisible,
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

    // Botão de olho funciona igual em iOS e Android: quando overlayVisible
    // é false, gradientes/textos/preço/estoque/botões ficam ocultos e a
    // imagem fica limpa. Por padrão overlayVisible começa true, então o
    // visual inicial no iOS permanece idêntico ao que já existia.
    const showOverlay = overlayVisible;

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

        {showOverlay && (
          <>
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
          </>
        )}

        {showOverlay && (
          <View
            style={[
              styles.content,
              IS_ANDROID && styles.contentAndroid,
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
              onPress={() => onLearnMore({ product, productId: campaign?.productId })}
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
        )}
      </View>
    );
  },
);

export default function FullScreenProductCarousel({
  navigation,
  products: receivedProducts,
  onProductPress,
  onBuyPress,
  maxItems = 8,
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
  // Controla visibilidade do overlay (gradientes/textos/preço/estoque/botões/paginação).
  // Usado apenas no Android via botão de "olho"; no iOS o overlay é sempre visível
  // (showOverlay em ProductSlide ignora este estado quando !IS_ANDROID).
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [paymentInfoVisible, setPaymentInfoVisible] = useState(false);

  const sourceProducts =
    Array.isArray(receivedProducts) && receivedProducts.length > 0
      ? receivedProducts
      : contextProducts;

  const productLookup = useMemo(() => {
    const lookup = new Map();
    const source = Array.isArray(sourceProducts) ? sourceProducts : [];

    source.forEach((product) => {
      const productId = getProductId(product);

      if (productId != null) {
        lookup.set(String(productId), product);
      }
    });

    return lookup;
  }, [sourceProducts]);

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

  const handleLearnMore = useCallback(() => {
    setPaymentInfoVisible(true);
  }, []);

  const closePaymentInfo = useCallback(() => {
    setPaymentInfoVisible(false);
  }, []);

  const handleGoBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("MainTabs", {
      screen: "Loja",
    });
  }, [navigation]);

  const handleToggleOverlay = useCallback(() => {
    setOverlayVisible((prev) => !prev);
  }, []);

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
        onLearnMore={handleLearnMore}
        onBuy={handleBuy}
        overlayVisible={overlayVisible}
      />
    ),
    [width, height, insets.bottom, handleLearnMore, handleBuy, overlayVisible],
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

  // No Android, a paginação precisa ficar acima da área de conteúdo (que tem
  // altura variável dependendo do texto), então ancoramos relativo ao fundo
  // (bottom) em vez de um valor fixo a partir do topo (top: 625, usado no iOS).
  const androidPaginationBottom = Math.max(insets.bottom + 210, 218);

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
          IS_ANDROID && styles.headerAndroid,
          {
            paddingTop: IS_ANDROID
              ? insets.top + 10
              : insets.top + (Platform.OS === "android" ? 10 : 4),
          },
        ]}
      >
        <Pressable
          hitSlop={12}
          onPress={handleGoBack}
          style={[styles.backButton, IS_ANDROID && styles.backButtonAndroid]}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a loja"
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerRightGroup}>
          <Pressable
            hitSlop={14}
            onPress={handleToggleOverlay}
            style={({ pressed }) => [
              styles.eyeButton,
              IS_ANDROID && styles.eyeButtonAndroid,
              pressed && styles.searchButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              overlayVisible
                ? "Ocultar informações do produto"
                : "Mostrar informações do produto"
            }
          >
            <Ionicons
              name={overlayVisible ? "eye-outline" : "eye-off-outline"}
              size={26}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>

      {slides.length > 1 && overlayVisible && (
        <View
          pointerEvents="none"
          style={[
            styles.pagination,
            IS_ANDROID
              ? {
                  top: undefined,
                  left: 16,
                  right: undefined,
                  bottom: androidPaginationBottom,
                }
              : {
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

      <Modal
        visible={paymentInfoVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closePaymentInfo}
      >
        <PaymentInfoSheet onClose={closePaymentInfo} />
      </Modal>
    </View>
  );
}

const PaymentInfoSheet = memo(({ onClose }) => {
  const openAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(openAnim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [openAnim]);

  const sheetTranslateY = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [42, 0],
  });

  return (
    <View style={styles.sheetOverlay}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheetWrap,
          IS_ANDROID ? styles.sheetWrapAndroid : styles.sheetWrapIOS,
          { opacity: openAnim, transform: [{ translateY: sheetTranslateY }] },
        ]}
      >
        {IS_ANDROID ? (
          <View style={StyleSheet.absoluteFill} />
        ) : (
          <BlurView
            intensity={34}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        )}

        <LinearGradient
          pointerEvents="none"
          colors={
            IS_ANDROID
              ? ["rgba(10,10,12,0.96)", "rgba(18,18,20,0.98)"]
              : ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.03)"]
          }
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.sheetContent}>
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>Formas de pagamento</Text>

          <View style={styles.sheetList}>
            {PAYMENT_INFO_ITEMS.map((item) => (
              <View key={item} style={styles.sheetRow}>
                <View style={styles.sheetBullet} />
                <Text style={styles.sheetText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sheetNote}>{PAYMENT_INFO_NOTE}</Text>
        </View>
      </Animated.View>
    </View>
  );
});

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
    right: 0,
    bottom: 0,

    backgroundColor: "#000000",

    alignItems: "center",
    justifyContent: "center",
  },

  heroImage: IS_ANDROID
    ? {
        width: "100%",
        height: "100%",
        alignSelf: "center",
      }
    : {
        width: "130%",
        height: "100%",

        alignSelf: "center",
      },

  heroImageAndroid: {
    width: "100%",
    height: "100%",
    minWidth: "100%",
    minHeight: "100%",
    alignSelf: "center",
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

  // Android: paddingTop já soma insets.top dinamicamente (calculado inline),
  // então aqui só garantimos que o header não fique colado nas bordas em
  // telas menores/maiores (responsivo, sem valores fixos de tela).
  headerAndroid: {
    paddingHorizontal: 18,
  },

  headerRightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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

  // Android: BlurView "de vidro" empilhado costuma virar retângulo sólido
  // no compositor do Android. Como este componente usa apenas
  // backgroundColor translúcido (sem BlurView), o ajuste aqui é garantir
  // área de toque mínima de 44x44 (diretriz Android) e leve reforço de
  // contraste da borda para simular o efeito glass sem depender de blur.
  backButtonAndroid: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(20,20,20,0.55)",
    borderColor: "rgba(255,255,255,0.22)",
  },

  eyeButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(164, 0, 0, 0)",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.59)",
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

  searchButtonAndroid: {
    backgroundColor: "rgba(20,20,20,0.55)",
    borderColor: "rgba(255,255,255,0.22)",
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

  // Android: leve redução de padding horizontal para telas estreitas comuns
  // no ecossistema Android (largura menor que a maioria dos iPhones recentes),
  // evitando que textos/botões cheguem perto demais da borda.
  contentAndroid: {
    paddingHorizontal: Math.max(SCREEN_WIDTH * 0.055, 18),
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

    color: "rgba(255, 255, 255, 0.59)",

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

  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  sheetWrap: {
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 28,
    overflow: "hidden",
  },

  sheetWrapIOS: {
    backgroundColor: "rgba(14,14,16,0.30)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  sheetWrapAndroid: {
    backgroundColor: "rgba(8,8,10,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },

  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 999,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.30)",
    marginBottom: 18,
  },

  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: 14,
  },

  sheetList: {
    gap: 12,
  },

  sheetRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  sheetBullet: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginTop: 7,
    backgroundColor: "#FFFFFF",
  },

  sheetText: {
    flex: 1,
    color: "rgba(255,255,255,0.86)",
    fontSize: 14,
    lineHeight: 20,
  },

  sheetNote: {
    marginTop: 16,
    color: "rgba(255,255,255,0.62)",
    fontSize: 12.5,
    lineHeight: 18,
  },

  pagination: {
    position: "absolute",
    top: 625,

    left: 10,
    right: 300,

    zIndex: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,
  },

  paginationDot: {
    height: 3,
    borderRadius: 999,
  },

  paginationDotActive: {
    width: 20,
    backgroundColor: "rgba(255,255,255,0.90)",
  },

  paginationDotInactive: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.30)",
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
