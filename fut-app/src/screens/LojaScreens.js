/**
 * LojaScreens — Drakos Store
 * ═══════════════════════════════════════════════════════════════════════════════
 * Direção: editorial de luxo esportivo. Papel, não tela — off-white quente,
 * tipografia condensada pesada, espaço negativo como material de design,
 * crimson usado como assinatura, não como decoração. Um único momento de
 * vidro líquido, reservado para o instante de maior intenção (a campanha).
 *
 * Suporte a Dark Mode: segue o tema do sistema (useColorScheme) por padrão,
 * com um toggle manual na TopBar para o usuário sobrepor a preferência.
 * No dark, a paleta "papel" vira "carvão/breu" — mesma hierarquia editorial,
 * mesmo crimson como assinatura, sem perder a identidade em nenhum dos dois.
 *
 * Arquivo único e autocontido — sem dependências externas de dados ou estilos.
 * Mock de conteúdo embutido para fins de demonstração.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Platform,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProducts } from '../contexts/ProductContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — paleta clara e escura
// A hierarquia e o crimson permanecem idênticos; só a base "papel" inverte.
// ═══════════════════════════════════════════════════════════════════════════════
const FONT = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

const LIGHT = {
  mode: 'light',
  bg: '#F6F4F0',
  bgWarm: '#EFEBE3',
  paper: '#FFFFFF',
  ink: '#15130F',
  inkSoft: '#5B584F',
  inkFaint: '#9C978A',
  hairline: 'rgba(21, 19, 15, 0.10)',
  hairlineStrong: 'rgba(21, 19, 15, 0.16)',
  crimson: '#B4020F',
  crimsonDeep: '#6E0009',
  cream: '#EDE6D6',
  cardMarkAlpha: 'rgba(21,19,15,0.14)',
  statusBarStyle: 'light-content', // hero sempre escuro, então a status bar inicial é sempre clara
  ...FONT,
};

const DARK = {
  mode: 'dark',
  bg: '#121110',
  bgWarm: '#1B1917',
  paper: '#1D1B19',
  ink: '#F3F0EA',
  inkSoft: '#B7B2A7',
  inkFaint: '#726D63',
  hairline: 'rgba(243, 240, 234, 0.08)',
  hairlineStrong: 'rgba(243, 240, 234, 0.14)',
  crimson: '#E23A2E',
  crimsonDeep: '#8A0009',
  cream: '#2A2622',
  cardMarkAlpha: 'rgba(243,240,234,0.10)',
  statusBarStyle: 'light-content',
  ...FONT,
};

const HERO_H = 520;
const CARD_GAP = 14;
const CARD_W = (SCREEN_WIDTH - 40 - CARD_GAP) / 2;
const CARD_H = CARD_W * 1.36;

const CATEGORIES = ['Tudo', 'Camisas', 'Calçados', 'Acessórios', 'Ingressos'];

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: TopBar
// Wordmark editorial, sem ruído. Um traço fino separa do conteúdo.
// Inclui o toggle de tema — um pequeno botão sol/lua ao lado do carrinho.
// ═══════════════════════════════════════════════════════════════════════════════
const TopBar = memo(({ onCartPress, isDark, onToggleTheme, DS, s }) => (
  <View style={s.topBar}>
    <View>
      <Text style={s.topEyebrow}>DRAKOS FUTEBOL CLUBE</Text>
      <Text style={s.topWordmark}>Loja Oficial</Text>
    </View>
    <View style={s.topActions}>
      <TouchableOpacity onPress={onToggleTheme} style={s.themeBtn} activeOpacity={0.6}>
        <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={17} color={DS.ink} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCartPress} style={s.cartBtn} activeOpacity={0.6}>
        <Ionicons name="bag-outline" size={19} color={DS.ink} />
      </TouchableOpacity>
    </View>
  </View>
));

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: Hero
// Editorial em página cheia — imagem, vinheta, tipografia condensada gigante.
// Um único slide fixo: intenção > variedade. Já é escuro por natureza, então
// muda muito pouco entre os temas — só a intensidade da vinheta final.
// ═══════════════════════════════════════════════════════════════════════════════
const Hero = memo(({ DS, s }) => {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      delay: 120,
    }).start();
  }, []);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
  const opacity = enter;

  return (
    <View style={s.hero}>
      <LinearGradient
        colors={['#1C1A16', '#0E0C0A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      {/* Textura de linhas de campo — sutil, geométrica */}
      <View style={s.heroFieldLines} pointerEvents="none">
        <View style={s.fieldLine} />
        <View style={[s.fieldLine, { top: '50%' }]} />
        <View style={s.fieldCircle} />
      </View>

      <LinearGradient
        colors={['transparent', 'transparent', DS.mode === 'dark' ? 'rgba(18,17,16,0.97)' : 'rgba(14,12,10,0.94)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <View style={s.heroKicker}>
          <View style={s.heroKickerDash} />
          <Text style={s.heroKickerText}>TEMPORADA 24/25</Text>
        </View>

        <Text style={s.heroTitle}>
          NASCIDOS{'\n'}PARA{'\n'}<Text style={{ color: DS.crimson }}>VENCER</Text>
        </Text>

        <Text style={s.heroSub}>
          A nova coleção titular chegou. Tecido de performance,{'\n'}corte anatômico, brasão bordado.
        </Text>

        <TouchableOpacity style={s.heroCta} activeOpacity={0.85}>
          <Text style={s.heroCtaText}>EXPLORAR COLEÇÃO</Text>
          <View style={s.heroCtaIcon}>
            <Ionicons name="arrow-forward" size={13} color={DS.ink} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Text style={s.heroFootnote}>Nº 09 · EDIÇÃO LIMITADA · 500 UNIDADES</Text>
    </View>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: CategoryRail
// Texto puro, sem pílulas — sublinhado no ativo. Tipografia carrega a hierarquia.
// ═══════════════════════════════════════════════════════════════════════════════
const CategoryRail = memo(({ selected, onSelect, s }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={s.railScroll}
    contentContainerStyle={s.railContent}
  >
    {CATEGORIES.map((cat) => {
      const active = cat === selected;
      return (
        <TouchableOpacity
          key={cat}
          onPress={() => onSelect(cat)}
          activeOpacity={0.6}
          style={s.railItem}
        >
          <Text style={[s.railText, active && s.railTextActive]}>{cat}</Text>
          {active && <View style={s.railUnderline} />}
        </TouchableOpacity>
      );
    })}
  </ScrollView>
));

const resolveImageSource = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return { uri: value };
  }

  return value;
};

const normalizeCategory = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const matchesCategory = (productCategory, selectedCategory) => {
  if (selectedCategory === 'Tudo') {
    return true;
  }

  const productValue = normalizeCategory(productCategory);
  const selectedValue = normalizeCategory(selectedCategory);

  if (!productValue || !selectedValue) {
    return false;
  }

  if (productValue === selectedValue) {
    return true;
  }

  if (selectedValue === 'camisas') {
    return productValue.includes('camisa');
  }

  if (selectedValue === 'ingressos') {
    return productValue.includes('ingresso');
  }

  return productValue.includes(selectedValue);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: CampaignGlass
// O único momento "Liquid Glass" da tela — vidro sobre fundo escuro,
// construído localmente (BlurView + camadas) para não depender de import externo.
// Este bloco já era escuro por design, então permanece quase idêntico nos dois
// temas — o vidro líquido "flutua" igual sobre papel claro ou carvão escuro.
// ═══════════════════════════════════════════════════════════════════════════════
const CampaignGlass = memo(({ DS, s }) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  const width = SCREEN_WIDTH - 40;
  const height = 178;
  const radius = 4;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(3800),
        Animated.timing(shimmer, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const shimmerX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width * 1.4],
  });

  return (
    <View style={[s.campWrap, { width, height, borderRadius: radius }]}>
      <LinearGradient
        colors={['#1A0304', '#0C0203', '#050101']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: radius }]}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(180,2,15,0.30)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.75, y: 0.9 }}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.10)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
        />

        {/* shimmer */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -height * 0.5,
            bottom: -height * 0.5,
            width: width * 0.28,
            transform: [{ translateX: shimmerX }, { skewX: '-16deg' }],
          }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.12)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      </View>

      {/* barra especular superior */}
      <View style={s.campSpecular} pointerEvents="none" />

      {/* conteúdo */}
      <View style={s.campContent}>
        <View>
          <Text style={s.campEyebrow}>OFERTA DA SEMANA</Text>
          <Text style={s.campTitle}>ATÉ 50%{'\n'}DE DESCONTO</Text>
        </View>
        <View style={s.campFooter}>
          <Text style={s.campFootnote}>Em peças selecionadas · até domingo</Text>
          <View style={s.campArrow}>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* anel de borda */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width,
          height,
          borderRadius: radius,
          borderWidth: 0.75,
          borderColor: 'rgba(255,255,255,0.16)',
        }}
      />
    </View>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: SectionHeader
// ═══════════════════════════════════════════════════════════════════════════════
const SectionHeader = memo(({ index, title, subtitle, s }) => (
  <View style={s.sectionHead}>
    <View style={s.sectionRow}>
      <Text style={s.sectionIndex}>{index}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={s.sectionSub}>{subtitle}</Text> : null}
      </View>
    </View>
    <View style={s.sectionRule} />
  </View>
));

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: ProductCard
// Papel puro — sem borda decorativa, sem sombra pesada. Fotografia como herói.
// ═══════════════════════════════════════════════════════════════════════════════
const ProductCard = memo(({ item, onPress, DS, s }) => {
  const press = useRef(new Animated.Value(0)).current;
  const productImageRaw =
    item.image ??
    item.imagem ??
    item.images?.[0] ??
    item.imagens?.[0] ??
    item.url_imagem_produtos ??
    null;
  const productImage = resolveImageSource(productImageRaw);

  const onIn = () =>
    Animated.spring(press, { toValue: 1, tension: 380, friction: 24, useNativeDriver: true }).start();
  const onOut = () =>
    Animated.spring(press, { toValue: 0, tension: 220, friction: 18, useNativeDriver: true }).start();

  const scale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.975] });

  console.log('[LojaScreens] product card image payload', {
    id: item.id,
    image: item.image ?? null,
    imagem: item.imagem ?? null,
    images: item.images ?? null,
    imagens: item.imagens ?? null,
    url_imagem_produtos: item.url_imagem_produtos ?? null,
    raw: productImageRaw,
    resolved: productImage,
  });

  return (
    <Animated.View style={{ width: CARD_W, transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
      >
        <View style={[s.cardImage, { width: CARD_W, height: CARD_H }]}>
          <LinearGradient
            colors={[DS.cream, DS.bgWarm]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
          />

          {productImage ? (
            <Image
              source={productImage}
              style={StyleSheet.absoluteFill}
              resizeMode="contain"
              onLoad={() => {
                console.log('[LojaScreens] product card image loaded', {
                  id: item.id,
                  source: productImage,
                });
              }}
              onError={(event) => {
                console.log('[LojaScreens] product card image error', {
                  id: item.id,
                  source: productImage,
                  error: event?.nativeEvent,
                });
              }}
            />
          ) : null}

          <View style={s.cardImageMark}>
            <Text style={s.cardImageMarkText}>DRAKOS</Text>
          </View>

          {item.tag && (
            <View style={[s.cardTag, item.tag === 'NOVO' && s.cardTagInk]}>
              <Text style={[s.cardTagText, item.tag === 'NOVO' && s.cardTagTextInk]}>
                {item.tag}
              </Text>
            </View>
          )}
        </View>

        <View style={s.cardInfo}>
          <Text style={s.cardCat}>{item.cat.toUpperCase()}</Text>
          <Text style={s.cardName} numberOfLines={2}>{item.name}</Text>
          <View style={s.cardPriceRow}>
            <Text style={s.cardPrice}>
              {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            {item.oldPrice && (
              <Text style={s.cardOldPrice}>
                {item.oldPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: ProductGrid
// ═══════════════════════════════════════════════════════════════════════════════
const ProductGrid = memo(({ products, onPressItem, DS, s }) => (
  <View style={s.grid}>
    {products.map((item) => (
      <ProductCard key={item.id} item={item} onPress={() => onPressItem(item)} DS={DS} s={s} />
    ))}
  </View>
));

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
function LojaContent({ navigation }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeOverride, setThemeOverride] = useState(null); // null = segue o sistema
  const { products, loadProducts } = useProducts();

  const isDark = (themeOverride ?? systemScheme) === 'dark';
  const DS = isDark ? DARK : LIGHT;
  const s = useMemo(() => makeStyles(DS), [DS]);

  const [category, setCategory] = useState('Tudo');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!products.length) {
      loadProducts().catch(() => {});
    }
  }, [loadProducts, products.length]);

  useEffect(() => {
    console.log('[LojaScreens] products snapshot', {
      total: products.length,
      sample: products.slice(0, 5).map((item) => ({
        id: item.id,
        image: item.image ?? null,
        imagem: item.imagem ?? null,
        images: item.images ?? null,
        imagens: item.imagens ?? null,
        categoria: item.categoria ?? null,
        category: item.category ?? null,
        cat: item.cat ?? null,
      })),
    });
  }, [products]);

  const filtered = useMemo(() => (
    products.filter((p) => matchesCategory(p.cat ?? p.category ?? p.categoria, category))
  ), [category, products]);

  const goToDetail = useCallback(
    (item) => {
      if (navigation?.navigate) navigation.navigate('DetalhesProdutos', { produto: item });
    },
    [navigation]
  );

  const goToCart = useCallback(() => {
    if (navigation?.navigate) navigation.navigate('Carrinho');
  }, [navigation]);

  const toggleTheme = useCallback(() => {
    setThemeOverride((prev) => {
      const current = prev ?? systemScheme ?? 'light';
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={DS.statusBarStyle} backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <Hero DS={DS} s={s} />

        <View style={s.body}>
          <TopBar
            onCartPress={goToCart}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            DS={DS}
            s={s}
          />

          <CategoryRail selected={category} onSelect={setCategory} s={s} />

          <View style={s.campSection}>
            <CampaignGlass DS={DS} s={s} />
          </View>

          <SectionHeader
            index="01"
            title="Selecionados para você"
            subtitle="Peças em destaque nesta temporada"
            s={s}
          />
          <ProductGrid products={filtered} onPressItem={goToDetail} DS={DS} s={s} />

          <View style={s.closing}>
            <View style={s.closingRule} />
            <Text style={s.closingText}>DRAKOS FC · FUNDADO EM 1911</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

export default function LojaScreens(props) {
  return (
    <SafeAreaProvider>
      <LojaContent {...props} />
    </SafeAreaProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ESTILOS — função de tokens de tema para folha de estilos
// Mesma geometria e espaçamento nos dois temas; apenas as cores mudam.
// ═══════════════════════════════════════════════════════════════════════════════
function makeStyles(DS) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: DS.bg,
    },
    scrollContent: {
      paddingBottom: 8,
    },
    body: {
      paddingHorizontal: 20,
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    hero: {
      height: HERO_H,
      marginTop: -1,
      paddingHorizontal: 24,
      paddingBottom: 30,
      justifyContent: 'flex-end',
      overflow: 'hidden',
    },
    heroFieldLines: {
      ...StyleSheet.absoluteFillObject,
    },
    fieldLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '22%',
      height: StyleSheet.hairlineWidth,
      backgroundColor: 'rgba(255,255,255,0.08)',
    },
    fieldCircle: {
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: 130,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      top: '30%',
      right: -90,
    },
    heroKicker: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
    },
    heroKickerDash: {
      width: 18,
      height: 2,
      backgroundColor: DS.crimson,
      marginRight: 8,
    },
    heroKickerText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2.2,
      color: 'rgba(255,255,255,0.65)',
    },
    heroTitle: {
      fontFamily: DS.display,
      fontSize: 58,
      lineHeight: 56,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -1,
    },
    heroSub: {
      fontSize: 14.5,
      lineHeight: 21,
      color: 'rgba(255,255,255,0.62)',
      marginTop: 20,
      maxWidth: '92%',
    },
    heroCta: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: '#FFFFFF',
      borderRadius: 2,
      paddingLeft: 20,
      paddingRight: 6,
      paddingVertical: 6,
      marginTop: 30,
    },
    heroCtaText: {
      fontSize: 11.5,
      fontWeight: '800',
      letterSpacing: 1.6,
      color: '#15130F',
      marginRight: 14,
    },
    heroCtaIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: DS.cream,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroFootnote: {
      position: 'absolute',
      top: 20,
      right: 24,
      fontFamily: DS.mono,
      fontSize: 9.5,
      letterSpacing: 0.6,
      color: 'rgba(255,255,255,0.32)',
    },

    // ── TopBar ──────────────────────────────────────────────────────────────
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingTop: 26,
      paddingBottom: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: DS.hairline,
      marginBottom: 22,
    },
    topEyebrow: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.8,
      color: DS.inkFaint,
      marginBottom: 6,
    },
    topWordmark: {
      fontFamily: DS.display,
      fontSize: 24,
      fontWeight: '700',
      color: DS.ink,
      letterSpacing: -0.3,
    },
    topActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    themeBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: DS.paper,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: DS.hairlineStrong,
    },
    cartBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: DS.paper,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: DS.hairlineStrong,
    },

    // ── CategoryRail ────────────────────────────────────────────────────────
    railScroll: {
      marginBottom: 30,
    },
    railContent: {
      paddingRight: 20,
      gap: 26,
    },
    railItem: {
      paddingBottom: 8,
    },
    railText: {
      fontSize: 14,
      fontWeight: '600',
      color: DS.inkFaint,
      letterSpacing: 0.2,
    },
    railTextActive: {
      color: DS.ink,
      fontWeight: '700',
    },
    railUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: DS.crimson,
    },

    // ── CampaignGlass ───────────────────────────────────────────────────────
    campSection: {
      marginBottom: 38,
      alignItems: 'center',
    },
    campWrap: {
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: DS.mode === 'dark' ? 0.32 : 0.16,
      shadowRadius: 24,
      elevation: 8,
    },
    campSpecular: {
      position: 'absolute',
      top: 0,
      left: '10%',
      right: '10%',
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.35)',
    },
    campContent: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 24,
    },
    campEyebrow: {
      fontSize: 10.5,
      fontWeight: '700',
      letterSpacing: 2,
      color: 'rgba(255,255,255,0.55)',
      marginBottom: 10,
    },
    campTitle: {
      fontFamily: DS.display,
      fontSize: 30,
      lineHeight: 30,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    campFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    campFootnote: {
      fontSize: 11.5,
      color: 'rgba(255,255,255,0.5)',
    },
    campArrow: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255,255,255,0.25)',
    },

    // ── SectionHeader ───────────────────────────────────────────────────────
    sectionHead: {
      marginBottom: 20,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    sectionIndex: {
      fontFamily: DS.mono,
      fontSize: 12,
      color: DS.crimson,
      marginRight: 12,
      marginTop: 4,
      fontWeight: '700',
    },
    sectionTitle: {
      fontFamily: DS.display,
      fontSize: 21,
      fontWeight: '700',
      color: DS.ink,
      letterSpacing: -0.2,
    },
    sectionSub: {
      fontSize: 12.5,
      color: DS.inkSoft,
      marginTop: 3,
    },
    sectionRule: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: DS.hairline,
    },

    // ── Grid / ProductCard ──────────────────────────────────────────────────
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 28,
      marginTop: 6,
    },
    cardImage: {
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 12,
    },
    cardImageMark: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardImageMarkText: {
      fontFamily: DS.display,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 3,
      color: DS.cardMarkAlpha,
    },
    cardTag: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: DS.crimson,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    cardTagInk: {
      backgroundColor: DS.ink,
    },
    cardTagText: {
      fontSize: 9.5,
      fontWeight: '800',
      letterSpacing: 0.6,
      color: '#FFFFFF',
    },
    cardTagTextInk: {
      color: DS.mode === 'dark' ? DS.bg : '#FFFFFF',
    },
    cardInfo: {
      paddingRight: 4,
    },
    cardCat: {
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 1,
      color: DS.inkFaint,
      marginBottom: 5,
    },
    cardName: {
      fontSize: 13.5,
      fontWeight: '600',
      color: DS.ink,
      lineHeight: 18,
      marginBottom: 8,
    },
    cardPriceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },
    cardPrice: {
      fontSize: 14.5,
      fontWeight: '800',
      color: DS.ink,
    },
    cardOldPrice: {
      fontSize: 11.5,
      color: DS.inkFaint,
      textDecorationLine: 'line-through',
    },

    // ── Closing ─────────────────────────────────────────────────────────────
    closing: {
      alignItems: 'center',
      marginTop: 48,
    },
    closingRule: {
      width: 32,
      height: 2,
      backgroundColor: DS.crimson,
      marginBottom: 14,
    },
    closingText: {
      fontFamily: DS.mono,
      fontSize: 10,
      letterSpacing: 1.4,
      color: DS.inkFaint,
    },
  });
}
