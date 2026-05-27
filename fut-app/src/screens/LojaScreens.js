/**
 * LojaScreens — Redesign Premium Cinematográfico
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Arquitetura visual inspirada em:
 *   – Nike App / Adidas Confirmed  → tipografia editorial agressiva, composição
 *   – Apple Wallet / visionOS      → vidro líquido, camadas de profundidade
 *   – Luxury Fashion Tech           → espaço negativo, hierarquia forte
 *
 * Estrutura de seções (topo → rodapé):
 *   A. TopBar            — barra minimalista com busca
 *   B. HeroCarousel      — carrossel cinematográfico (460px)
 *   C. CategoriasStrip   — filtros horizontais deslizantes
 *   D. CampaignBanner    — PremiumGlassCard como hero de campanha
 *   E. ProdutosGrid      — grid premium (3 primeiros produtos)
 *   F. EditorialAdBanner — banner editorial de divisão de conteúdo
 *   G. ProdutosGrid      — grid premium (3 últimos produtos)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import NavbarGlass from '../components/NavbarGlass';
import PremiumGlassCard from '../components/Cards_home/PremiumGlassCard';

// ─── Dimensões ────────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Design System ────────────────────────────────────────────────────────────
const DS = {
  // Paleta cinematográfica escura
  bg:             '#070707',
  bgLayer:        '#0e0e0e',
  bgElevated:     '#131313',

  // Acento — vermelho marca (escuro e saturado)
  accent:         '#c0000a',
  accentBright:   '#e8000f',
  accentGlow:     'rgba(180, 0, 10, 0.18)',
  accentGlowSoft: 'rgba(140, 0, 8, 0.09)',

  // Texto
  text:           '#f2f2f2',
  textDim:        'rgba(242,242,242,0.55)',
  textFaint:      'rgba(242,242,242,0.28)',

  // Vidro
  glass:          'rgba(255,255,255,0.055)',
  glassBorder:    'rgba(255,255,255,0.10)',
  glassBorderSub: 'rgba(255,255,255,0.055)',

  // Sombra
  shadow:         '#000000',

  // Raios
  radius:         { sm: 14, md: 20, lg: 28, xl: 36 },
  spacing:        { xs: 8, sm: 12, md: 16, lg: 20, xl: 24 },
};

// ─── Dados dos produtos ───────────────────────────────────────────────────────
const PRODUTOS_EXEMPLO = [
  {
    id: '1',
    nome: 'Cachecol Drakos - Premium',
    preco: 89.99,
    precoAntigo: 149.00,
    desconto: '40%',
    categoria: 'Acessório',
    imagens: [
      require('../assets/img/Produtos/acessorios/objeto 1/cachecol_drakos (1).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 1/cachecol_transparent (3).png'),
      require('../assets/img/Produtos/acessorios/objeto 1/cachecol_drakos (2).webp'),
    ],
    imagem: require('../assets/img/Produtos/acessorios/objeto 1/cachecol_transparent (3).png'),
    descricao: 'Cachecol oficial Drakos em material premium, 100% algodão. Design exclusivo com as cores do clube, acabamento reforçado e tamanho generoso.',
  },
  {
    id: '2',
    nome: 'Boneco Drakos - Edição Especial',
    preco: 129.99,
    precoAntigo: 220.00,
    desconto: '41%',
    categoria: 'Colecionável',
    imagens: [
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_drakos (1).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_drakos (2).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_drakos (3).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 2/boneco_transparent (3).png'),
    ],
    imagem: require('../assets/img/Produtos/acessorios/objeto 2/boneco_transparent (3).png'),
    descricao: 'Boneco colecionável edição especial. Material de alta qualidade, detalhes pintados manualmente, uniforme oficial.',
  },
  {
    id: '3',
    nome: 'Touca Drakos - Inverno',
    preco: 59.99,
    precoAntigo: 89.00,
    desconto: '33%',
    categoria: 'Acessório',
    imagens: [
      require('../assets/img/Produtos/acessorios/objeto 3/touca_Drakos (1).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 3/touca_Drakos (2).jpg'),
      require('../assets/img/Produtos/acessorios/objeto 3/touca_transparent.png'),
    ],
    imagem: require('../assets/img/Produtos/acessorios/objeto 3/touca_transparent.png'),
    descricao: 'Touca de inverno oficial Drakos, confeccionada em lã acrílica de alta qualidade com bordado do escudo.',
  },
  {
    id: '4',
    nome: 'Drakos Temp 24/25 — Oficial',
    preco: 169.99,
    precoAntigo: 285.00,
    desconto: '40%',
    categoria: 'Camisa',
    imagens: [ require('../assets/img/img_home/milan_r2006(2).png') ],
    imagem:   require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Camisa oficial da temporada 24/25. Dry-fit performance, corte ergonômico, detalhes em vermelho.',
  },
  {
    id: '5',
    nome: 'Drakos 24/25 — Ed. Limitada',
    preco: 189.99,
    precoAntigo: 320.00,
    desconto: '41%',
    categoria: 'Camisa',
    imagens: [ require('../assets/img/img_home/milan_r2006(2).png') ],
    imagem:   require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Versão limitada da temporada 24/25, comemorativa aos 20 anos do clube. Escudo bordado, numeração especial.',
  },
  {
    id: '6',
    nome: 'Drakos 24/25 — Torcedor',
    preco: 149.99,
    precoAntigo: 210.00,
    desconto: '29%',
    categoria: 'Camisa',
    imagens: [ require('../assets/img/img_home/milan_r2006(2).png') ],
    imagem:   require('../assets/img/img_home/milan_r2006(2).png'),
    descricao: 'Versão torcedor, algodão e poliéster. Equilíbrio entre respirabilidade e resistência.',
  },
];

// ─── Dados do carrossel hero ──────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 'h1',
    tag:      'NOVA COLEÇÃO',
    title:    'DRAKOS\n24/25',
    sub:      'Desempenho que\nvira lenda.',
    cta:      'Explorar',
    accent:   DS.accentBright,
    gradient: ['#1a0000', '#0a0000', '#070707'],
  },
  {
    id: 'h2',
    tag:      'EDIÇÃO LIMITADA',
    title:    'APENAS\n500',
    sub:      'Cada peça conta\numa história.',
    cta:      'Ver agora',
    accent:   '#8a2be2',
    gradient: ['#0d0020', '#060010', '#070707'],
  },
  {
    id: 'h3',
    tag:      'ESPECIAL 20 ANOS',
    title:    'DOIS\nDÉCADAS',
    sub:      'O legado vive\nem cada fio.',
    cta:      'Descobrir',
    accent:   '#00aaff',
    gradient: ['#001520', '#000a12', '#070707'],
  },
];

// ─── Categorias ───────────────────────────────────────────────────────────────
const CATEGORIAS = ['Todos', 'Camisas', 'Acessórios', 'Colecionáveis', 'Limitados'];

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: HeroCarousel
// Auto-scroll com parallax e indicadores minimalistas
// ═══════════════════════════════════════════════════════════════════════════════
const HERO_HEIGHT = SCREEN_WIDTH * 1.08;

const HeroCarousel = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef      = useRef(null);
  const autoScrollRef  = useRef(null);
  const scaleAnims     = useRef(HERO_SLIDES.map(() => new Animated.Value(1))).current;
  const opacityAnims   = useRef(HERO_SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0.6))).current;

  // ── Auto-scroll a cada 4.5s ─────────────────────────────────────────────
  const goToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % HERO_SLIDES.length;
        goToIndex(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(autoScrollRef.current);
  }, [goToIndex]);

  const handleScroll = useCallback(({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeIndex) setActiveIndex(index);
  }, [activeIndex]);

  return (
    <View style={heroStyles.container}>
      {/* ── Slides ─────────────────────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ width: SCREEN_WIDTH }}
      >
        {HERO_SLIDES.map((slide, i) => (
          <HeroSlide key={slide.id} slide={slide} index={i} />
        ))}
      </ScrollView>

      {/* ── Indicadores minimalistas ────────────────────────────────────── */}
      <View style={heroStyles.indicators}>
        {HERO_SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => goToIndex(i)}
            style={[
              heroStyles.dot,
              i === activeIndex && heroStyles.dotActive,
              i === activeIndex && { backgroundColor: HERO_SLIDES[activeIndex].accent },
            ]}
          />
        ))}
      </View>

      {/* ── Fade para o fundo abaixo ────────────────────────────────────── */}
      <LinearGradient
        colors={['transparent', DS.bg]}
        style={heroStyles.bottomFade}
        pointerEvents="none"
      />
    </View>
  );
});

// ── Slide individual ─────────────────────────────────────────────────────────
const HeroSlide = memo(({ slide }) => {
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = enterAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
  const opacity    = enterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={[heroStyles.slide, { width: SCREEN_WIDTH }]}>
      {/* Gradiente de fundo do slide */}
      <LinearGradient
        colors={slide.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Halo de acento */}
      <View
        pointerEvents="none"
        style={[
          heroStyles.accentGlow,
          { backgroundColor: slide.accent, shadowColor: slide.accent },
        ]}
      />

      {/* Linhas decorativas verticais (detalhes gráficos) */}
      <View style={heroStyles.decorLines} pointerEvents="none">
        <View style={[heroStyles.decorLine, { left: SCREEN_WIDTH * 0.12 }]} />
        <View style={[heroStyles.decorLine, { right: SCREEN_WIDTH * 0.12, opacity: 0.3 }]} />
      </View>

      {/* Conteúdo textual */}
      <Animated.View style={[heroStyles.textContainer, { opacity, transform: [{ translateY }] }]}>
        {/* Tag de categoria */}
        <View style={[heroStyles.tag, { borderColor: slide.accent }]}>
          <Text style={[heroStyles.tagText, { color: slide.accent }]}>
            {slide.tag}
          </Text>
        </View>

        {/* Título gigante */}
        <Text style={heroStyles.title}>{slide.title}</Text>

        {/* Linha separadora */}
        <View style={[heroStyles.titleDivider, { backgroundColor: slide.accent }]} />

        {/* Subtítulo */}
        <Text style={heroStyles.subtitle}>{slide.sub}</Text>

        {/* CTA */}
        <TouchableOpacity
          style={[heroStyles.cta, { borderColor: slide.accent }]}
          activeOpacity={0.75}
        >
          <Text style={[heroStyles.ctaText, { color: slide.accent }]}>
            {slide.cta}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={slide.accent} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </Animated.View>

      {/* Número decorativo de fundo */}
      <Text style={heroStyles.bgNumber} pointerEvents="none">
        {String(HERO_SLIDES.indexOf(HERO_SLIDES.find(s => s.id === slide.id)) + 1).padStart(2, '0')}
      </Text>

      {/* Vinheta das bordas */}
      <LinearGradient
        colors={['rgba(7,7,7,0.6)', 'transparent', 'transparent', 'rgba(7,7,7,0.4)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        pointerEvents="none"
      />
    </View>
  );
});

const heroStyles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  slide: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  accentGlow: {
    position: 'absolute',
    top: -80,
    left: SCREEN_WIDTH * 0.3,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 80,
  },
  decorLines: {
    ...StyleSheet.absoluteFillObject,
  },
  decorLine: {
    position: 'absolute',
    top: 60,
    bottom: 140,
    width: 0.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  textContainer: {
    paddingHorizontal: DS.spacing.xl,
    paddingBottom: 80,
  },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 0.75,
    borderRadius: DS.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  title: {
    fontSize: 68,
    fontWeight: '900',
    color: DS.text,
    lineHeight: 64,
    letterSpacing: -2,
    textTransform: 'uppercase',
  },
  titleDivider: {
    width: 32,
    height: 2,
    marginTop: 18,
    marginBottom: 16,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: DS.textDim,
    lineHeight: 22,
    letterSpacing: 0.3,
    marginBottom: 28,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 0.75,
    borderRadius: DS.radius.xl,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bgNumber: {
    position: 'absolute',
    right: -12,
    bottom: 60,
    fontSize: 200,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.025)',
    lineHeight: 190,
    letterSpacing: -8,
  },
  indicators: {
    position: 'absolute',
    bottom: 28,
    right: DS.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 32,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: CategoriasStrip
// Filtros horizontais com visual de pílulas premium
// ═══════════════════════════════════════════════════════════════════════════════
const CategoriasStrip = memo(({ selected, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={catStyles.strip}
    contentContainerStyle={catStyles.stripContent}
  >
    {CATEGORIAS.map(cat => {
      const isActive = cat === selected;
      return (
        <TouchableOpacity
          key={cat}
          onPress={() => onSelect(cat)}
          style={[catStyles.pill, isActive && catStyles.pillActive]}
          activeOpacity={0.7}
        >
          {isActive && (
            <LinearGradient
              colors={[DS.accent, '#900008']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              borderRadius={DS.radius.xl}
            />
          )}
          <Text style={[catStyles.pillText, isActive && catStyles.pillTextActive]}>
            {cat}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
));

const catStyles = StyleSheet.create({
  strip: { marginTop: 28 },
  stripContent: {
    paddingHorizontal: DS.spacing.lg,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: DS.radius.xl,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
    backgroundColor: DS.glass,
    overflow: 'hidden',
  },
  pillActive: {
    borderColor: DS.accent,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: DS.textDim,
  },
  pillTextActive: {
    color: DS.text,
    fontWeight: '700',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: CampaignBanner
// PremiumGlassCard usado como hero de campanha premium
// ═══════════════════════════════════════════════════════════════════════════════
const CAMPAIGN_WIDTH  = SCREEN_WIDTH - DS.spacing.lg * 2;
const CAMPAIGN_HEIGHT = 160;

const CampaignBanner = memo(() => (
  <View style={campStyles.outer}>
    {/* Glow de acento vermelho atrás do card */}
    <View style={campStyles.glowLayer} pointerEvents="none" />

    <PremiumGlassCard
      width={CAMPAIGN_WIDTH}
      height={CAMPAIGN_HEIGHT}
      borderRadius={DS.radius.lg}
      blurIntensity={40}
      tint="dark"
      enableShimmer={true}
      enableBreathing={false}
      enableFloat={false}
      glowColor="rgba(180, 0, 8, 0.6)"
      shimmerDelay={5000}
      contentPadding={0}
    >
      {/* Overlay de gradiente escuro dentro do card */}
      <LinearGradient
        colors={['rgba(180,0,8,0.22)', 'rgba(0,0,0,0.45)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Conteúdo textual */}
      <View style={campStyles.content}>
        <View>
          <Text style={campStyles.campaignTag}>CAMPANHA EXCLUSIVA</Text>
          <Text style={campStyles.campaignTitle}>ATÉ{'\n'}50% OFF</Text>
          <Text style={campStyles.campaignSub}>Temporada 24/25 · Selecionados</Text>
        </View>
        <View style={campStyles.campaignCta}>
          <Ionicons name="arrow-forward" size={18} color={DS.text} />
        </View>
      </View>

      {/* Marca tipográfica de fundo */}
      <Text style={campStyles.bgMark} pointerEvents="none">DRAK</Text>
    </PremiumGlassCard>
  </View>
));

const campStyles = StyleSheet.create({
  outer: {
    marginHorizontal: DS.spacing.lg,
    marginTop: 28,
    marginBottom: 8,
  },
  glowLayer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    height: CAMPAIGN_HEIGHT,
    borderRadius: DS.radius.lg,
    backgroundColor: DS.accent,
    opacity: 0.12,
    shadowColor: DS.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DS.spacing.xl,
  },
  campaignTag: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: DS.accent,
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: DS.text,
    lineHeight: 38,
    letterSpacing: -1.5,
  },
  campaignSub: {
    fontSize: 10,
    color: DS.textDim,
    letterSpacing: 0.5,
    marginTop: 8,
    fontWeight: '400',
  },
  campaignCta: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bgMark: {
    position: 'absolute',
    right: -8,
    bottom: -18,
    fontSize: 88,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.04)',
    letterSpacing: -3,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: ProductCard
// Card premium minimalista com física de toque e profundidade visual
// ═══════════════════════════════════════════════════════════════════════════════
const CARD_WIDTH = (SCREEN_WIDTH - DS.spacing.lg * 2 - 12) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.52;

const ProductCard = memo(({ item, onPress }) => {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 400,
      friction: 26,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      tension: 240,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  const scale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.958],
  });

  const shadowOpacity = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0.08],
  });

  return (
    <Animated.View style={[cardStyles.wrapper, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[cardStyles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
      >
        {/* Borda glass */}
        <View style={cardStyles.borderLayer} />

        {/* Área de imagem */}
        <View style={cardStyles.imageContainer}>
          <Image source={item.imagem} style={cardStyles.image} resizeMode="contain" />

          {/* Vinheta inferior sobre imagem */}
          <LinearGradient
            colors={['transparent', DS.bgLayer]}
            style={cardStyles.imageVignette}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Badge de desconto */}
          <View style={cardStyles.badge}>
            <Text style={cardStyles.badgeText}>−{item.desconto}</Text>
          </View>
        </View>

        {/* Informações */}
        <View style={cardStyles.info}>
          <Text style={cardStyles.categoria}>{item.categoria.toUpperCase()}</Text>
          <Text style={cardStyles.nome} numberOfLines={2}>{item.nome}</Text>

          {/* Preço */}
          <View style={cardStyles.priceRow}>
            <Text style={cardStyles.preco}>
              {item.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <Text style={cardStyles.precoAntigo}>
              {item.precoAntigo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
          </View>
        </View>

        {/* Linha de acento inferior */}
        <View style={cardStyles.accentLine} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const cardStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  card: {
    borderRadius: DS.radius.lg,
    backgroundColor: DS.bgElevated,
    overflow: 'hidden',
  },
  borderLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: DS.radius.lg,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: DS.accent,
    borderRadius: DS.radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: DS.text,
    letterSpacing: 0.5,
  },
  info: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 4,
  },
  categoria: {
    fontSize: 8,
    fontWeight: '700',
    color: DS.accent,
    letterSpacing: 1.8,
  },
  nome: {
    fontSize: 12,
    fontWeight: '700',
    color: DS.text,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  preco: {
    fontSize: 14,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.3,
  },
  precoAntigo: {
    fontSize: 10,
    color: DS.textFaint,
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  accentLine: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: DS.accent,
    opacity: 0.5,
    borderRadius: 1,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: ProdutosGrid
// Grid de 2 colunas para os cards premium
// ═══════════════════════════════════════════════════════════════════════════════
const ProdutosGrid = memo(({ produtos, navigation }) => (
  <View style={gridStyles.container}>
    <View style={gridStyles.grid}>
      {produtos.map(item => (
        <ProductCard
          key={item.id}
          item={item}
          onPress={() => navigation.navigate('DetalhesProdutos', { produto: item })}
        />
      ))}
    </View>
  </View>
));

const gridStyles = StyleSheet.create({
  container: {
    paddingHorizontal: DS.spacing.lg,
    marginTop: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: EditorialAdBanner
// Banner divisório estilo campanha Nike/Adidas
// ═══════════════════════════════════════════════════════════════════════════════
const EditorialAdBanner = memo(() => (
  <View style={adStyles.outer}>
    {/* Linha superior decorativa */}
    <View style={adStyles.topLine} />

    <View style={adStyles.inner}>
      {/* Gradiente de fundo editorial */}
      <LinearGradient
        colors={['#100000', '#0a0000', '#080000']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Texto lateral vertical */}
      <View style={adStyles.sideLabel}>
        <Text style={adStyles.sideLabelText}>DRAKOS COLLECTION</Text>
      </View>

      {/* Conteúdo principal */}
      <View style={adStyles.content}>
        <Text style={adStyles.eyebrow}>ESTAÇÃO 2024–25</Text>
        <Text style={adStyles.headline}>VISTA{'\n'}A FORÇA.</Text>
        <View style={adStyles.underline} />
        <Text style={adStyles.body}>
          Cada detalhe pensado{'\n'}para quem não aceita menos.
        </Text>
      </View>

      {/* Elemento gráfico decorativo */}
      <View style={adStyles.graphicElement}>
        <LinearGradient
          colors={[DS.accent, 'transparent']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Marca d'água numérica */}
      <Text style={adStyles.watermark} pointerEvents="none">25</Text>
    </View>

    {/* Linha inferior decorativa */}
    <View style={adStyles.bottomLine} />
  </View>
));

const adStyles = StyleSheet.create({
  outer: {
    marginTop: 36,
    marginBottom: 8,
  },
  topLine: {
    height: 0.5,
    backgroundColor: DS.glassBorderSub,
  },
  inner: {
    height: 200,
    marginHorizontal: DS.spacing.lg,
    borderRadius: DS.radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 0.75,
    borderColor: 'rgba(140,0,8,0.3)',
    marginTop: 1,
    marginBottom: 1,
  },
  sideLabel: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.07)',
  },
  sideLabelText: {
    fontSize: 7,
    fontWeight: '700',
    color: DS.textFaint,
    letterSpacing: 2,
    transform: [{ rotate: '-90deg' }],
    width: 120,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: 24,
    paddingVertical: 28,
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: '700',
    color: DS.accent,
    letterSpacing: 2.5,
    marginBottom: 12,
  },
  headline: {
    fontSize: 48,
    fontWeight: '900',
    color: DS.text,
    lineHeight: 46,
    letterSpacing: -2,
  },
  underline: {
    width: 28,
    height: 2,
    backgroundColor: DS.accent,
    marginVertical: 14,
    borderRadius: 1,
  },
  body: {
    fontSize: 12,
    fontWeight: '300',
    color: DS.textDim,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  graphicElement: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 3,
    bottom: 0,
    opacity: 0.6,
  },
  watermark: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    fontSize: 160,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.025)',
    lineHeight: 150,
    letterSpacing: -6,
  },
  bottomLine: {
    height: 0.5,
    backgroundColor: DS.glassBorderSub,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: SectionHeader
// Cabeçalho de seção com tipografia editorial
// ═══════════════════════════════════════════════════════════════════════════════
const SectionHeader = memo(({ tag, title, subtitle }) => (
  <View style={secStyles.container}>
    <View style={secStyles.tagRow}>
      <View style={secStyles.tagLine} />
      <Text style={secStyles.tag}>{tag}</Text>
    </View>
    <Text style={secStyles.title}>{title}</Text>
    {subtitle && <Text style={secStyles.subtitle}>{subtitle}</Text>}
  </View>
));

const secStyles = StyleSheet.create({
  container: {
    paddingHorizontal: DS.spacing.lg,
    marginTop: 32,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tagLine: {
    width: 18,
    height: 2,
    backgroundColor: DS.accent,
    borderRadius: 1,
  },
  tag: {
    fontSize: 9,
    fontWeight: '700',
    color: DS.accent,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 12,
    color: DS.textFaint,
    fontWeight: '400',
    marginTop: 6,
    letterSpacing: 0.2,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTE: TopBar
// Barra superior com busca minimalista
// ═══════════════════════════════════════════════════════════════════════════════
const TopBar = memo(({ search, onSearch, onClose }) => (
  <View style={topStyles.bar}>
    {/* Logo / marca */}
    <View style={topStyles.logoContainer}>
      <Text style={topStyles.logoText}>D</Text>
    </View>

    {/* Campo de busca */}
    <View style={topStyles.searchContainer}>
      <Ionicons name="search-outline" size={14} color={DS.textFaint} style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Buscar..."
        placeholderTextColor={DS.textFaint}
        style={topStyles.searchInput}
        value={search}
        onChangeText={onSearch}
      />
    </View>

    {/* Botão fechar */}
    <TouchableOpacity onPress={onClose} style={topStyles.closeBtn} activeOpacity={0.7}>
      <Ionicons name="close" size={18} color={DS.textDim} />
    </TouchableOpacity>
  </View>
));

const topStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: 12,
    gap: 12,
  },
  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: DS.radius.sm,
    backgroundColor: DS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: DS.glass,
    borderRadius: DS.radius.md,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
  },
  searchInput: {
    flex: 1,
    color: DS.text,
    fontSize: 13,
    fontWeight: '400',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: DS.radius.sm,
    backgroundColor: DS.glass,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: LojaContent
// ═══════════════════════════════════════════════════════════════════════════════
function LojaContent({ navigation }) {
  const [search, setSearch]       = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const insets                    = useSafeAreaInsets();

  // Divide produtos em 2 grupos para intercalar com o banner editorial
  const primeiros = PRODUTOS_EXEMPLO.slice(0, 4);
  const ultimos   = PRODUTOS_EXEMPLO.slice(4);

  return (
    <View style={[mainStyles.container, { paddingTop: insets.top || 20 }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Fundo com camadas de profundidade ───────────────────────────── */}
      <View style={mainStyles.bg} pointerEvents="none">
        {/* Glow vermelho ambiente — extremamente sutil */}
        <View style={mainStyles.bgGlowRed} />
        {/* Grade de pontos decorativa */}
        <View style={mainStyles.bgDots} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={mainStyles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* A. Barra superior */}
        <TopBar
          search={search}
          onSearch={setSearch}
          onClose={() => navigation.goBack()}
        />

        {/* B. Carrossel hero */}
        <HeroCarousel />

        {/* C. Categorias */}
        <CategoriasStrip selected={categoria} onSelect={setCategoria} />

        {/* D. Banner de campanha (PremiumGlassCard) */}
        <CampaignBanner />

        {/* E. Primeiro bloco de produtos */}
        <SectionHeader
          tag="Destaques"
          title="NOVIDADES"
          subtitle="Lançamentos da temporada 24/25"
        />
        <ProdutosGrid produtos={primeiros} navigation={navigation} />

        {/* F. Banner editorial divisor */}
        <EditorialAdBanner />

        {/* G. Segundo bloco de produtos */}
        <SectionHeader
          tag="Coleção"
          title="CAMISAS"
          subtitle="Uniformes oficiais Drakos"
        />
        <ProdutosGrid produtos={ultimos} navigation={navigation} />

        {/* Espaço para navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.bg,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGlowRed: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: DS.accent,
    opacity: 0.04,
    shadowColor: DS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 120,
  },
  bgDots: {
    // Placeholder para textura futura — pode implementar com SVG ou Canvas
    opacity: 0,
  },
  scrollContent: {
    // Sem paddingBottom aqui — tratado com View spacer
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT: Wrapper com SafeAreaProvider
// ═══════════════════════════════════════════════════════════════════════════════
export default function LojaScreens(props) {
  return (
    <SafeAreaProvider>
      <LojaContent {...props} />
    </SafeAreaProvider>
  );
}
