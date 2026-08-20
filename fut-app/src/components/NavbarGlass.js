/**
 * NavbarGlass — REFACTOR COMPLETO
 * ─────────────────────────────────────────────────────────────────────────────
 * Liquid glass navbar com física iOS-grade e glassmorphism premium.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { platformPick } from '../styles/platformUiTokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Telas Android estreitas (<360px) apertam 5 tabs com ícone+label;
// reduzimos discretamente ícone/fonte só nesse caso, sem alterar layout,
// gestos ou posições — puramente cosmético para não cortar texto/ícone.
const IS_NARROW_SCREEN = SCREEN_WIDTH < 360;

// ─── Tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { route: 'Ingressos', icon: 'ticket-outline', label: 'Ticket' },
  { route: 'Socio',     icon: 'people-outline',  label: 'Sócio'  },
  { route: 'Home',      icon: 'home',            label: 'Home'   },
  { route: 'Loja',      icon: 'cart-outline',    label: 'Loja'   },
  { route: 'Perfil',    icon: 'person-outline',  label: 'Perfil' },
];

const NAVBAR_UI = {
  glassBodyBg: platformPick('rgba(255,255,255,0.07)', 'rgba(8,8,10,0.82)'),
  fakeDistortionBg: platformPick('rgba(255,255,255,0.025)', 'rgba(255,255,255,0.045)'),
  bubbleBg: platformPick('rgba(70,70,80,0.15)', 'rgba(18,18,22,0.42)'),
  bubbleShadowColor: platformPick('rgba(200,220,255,0.9)', 'rgba(255,255,255,0.28)'),
  topEdgeHighlight: platformPick('rgba(255,255,255,0.40)', 'rgba(255,255,255,0.26)'),
  outerRingColor: platformPick('rgba(255,255,255,0.46)', 'rgba(255,255,255,0.12)'),
  innerRingColor: platformPick('rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)'),
  tabActive: '#b20000',
  tabInactive: platformPick('rgba(255,255,255,0.82)', 'rgba(255,255,255,0.76)'),
  labelInactive: platformPick('rgba(255,255,255,0.58)', 'rgba(255,255,255,0.68)'),
  bubbleFill: platformPick(
    ['rgba(255,255,255,0.30)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.18)'],
    ['rgba(255,255,255,0.20)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.10)'],
  ),
  bubbleDepth: platformPick(['transparent', 'rgba(250, 0, 0, 0.19)'], ['transparent', 'rgba(250, 0, 0, 0.10)']),
  bubbleGlow: platformPick(
    ['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.08)', 'transparent'],
    ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.05)', 'transparent'],
  ),
  chromaticBlue: platformPick(
    ['transparent', 'rgba(150,180,255,0.26)', 'rgba(175,200,255,0.42)', 'rgba(150,180,255,0.26)', 'transparent'],
    ['transparent', 'rgba(150,180,255,0.16)', 'rgba(175,200,255,0.24)', 'rgba(150,180,255,0.16)', 'transparent'],
  ),
  chromaticAmber: platformPick(
    ['transparent', 'rgba(255,222,155,0.22)', 'rgba(255,202,115,0.34)', 'transparent'],
    ['transparent', 'rgba(255,222,155,0.12)', 'rgba(255,202,115,0.20)', 'transparent'],
  ),
  rimLeft: platformPick(
    ['transparent', 'rgba(255,255,255,0.38)', 'rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)', 'transparent'],
    ['transparent', 'rgba(255,255,255,0.28)', 'rgba(255,255,255,0.16)', 'rgba(255,255,255,0.06)', 'transparent'],
  ),
};

// ─── Physics presets (iOS-calibrated) ─────────────────────────────────────
const SP = {
  SNAP:    { tension: 112, friction: 13  },
  RELEASE: { tension: 230, friction: 11  },
  ICON:    { tension: 340, friction: 8   },
  WOBBLE:  { tension: 62,  friction: 3.8 },
  BAR_IN:  { tension: 420, friction: 22  },
  BAR_OUT: { tension: 260, friction: 18  },
  GLOW:    { tension: 50,  friction: 10  },
};

const BUBBLE_RATIO = 0.82;

export default function NavbarGlass({ state, descriptors, navigation }) {
  const activeIndex = state?.index ?? 0;
  const insets = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'android'
    ? Math.max(12, insets.bottom + 8)
    : 24;
  const [containerWidth, setContainerWidth] = useState(0);
  const navTabs = Array.isArray(TABS) ? TABS : [];

  const L = useRef({ tabW: 0, bubW: 0, activeIdx: 0 });

  useEffect(() => {
    if (containerWidth > 0) {
      L.current.tabW = containerWidth / navTabs.length;
      L.current.bubW = L.current.tabW * BUBBLE_RATIO;
    }
  }, [containerWidth, navTabs.length]);

  useEffect(() => {
    L.current.activeIdx = activeIndex;
  }, [activeIndex]);

  const bubX = useRef(new Animated.Value(0)).current;
  const strX = useRef(new Animated.Value(1)).current;
  const wobY = useRef(new Animated.Value(1)).current;
  const icoS = useRef(new Animated.Value(1)).current;
  const lblY = useRef(new Animated.Value(0)).current;
  const glwP = useRef(new Animated.Value(0)).current;
  const barS = useRef(new Animated.Value(1)).current;

  const cX = useRef(0);

  const xForIdx = useCallback((i) => {
    const { tabW, bubW } = L.current;
    return i * tabW + (tabW - bubW) / 2;
  }, []);

  const nearestIdx = useCallback((bx) => {
    const { tabW, bubW } = L.current;
    const center = bx + bubW / 2;
    return Math.max(0, Math.min(navTabs.length - 1,
      Math.round((center - tabW / 2) / tabW)
    ));
  }, [navTabs.length]);

  useEffect(() => {
    if (containerWidth <= 0) return;
    const tW = containerWidth / navTabs.length;
    const bW = tW * BUBBLE_RATIO;
    const tx = activeIndex * tW + (tW - bW) / 2;
    cX.current = tx;
    Animated.spring(bubX, { toValue: tx, ...SP.GLOW, useNativeDriver: true }).start();
  }, [activeIndex, containerWidth, navTabs.length]);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(glwP, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(glwP, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const triggerWobble = useCallback(() => {
    Animated.sequence([
      Animated.timing(wobY, { toValue: 0.80, duration: 62,  useNativeDriver: true }),
      Animated.spring( wobY, { toValue: 1,    ...SP.WOBBLE,  useNativeDriver: true }),
    ]).start();
  }, [wobY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: ()     => true,
      onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dx) > 2,

      onPanResponderGrant: () => {
        bubX.stopAnimation();
        bubX.extractOffset();

        Animated.spring(strX, {
          toValue: 1.12,
          tension: 300,
          friction: 14,
          useNativeDriver: true,
        }).start();
      },

      onPanResponderMove: (_, g) => {
        const { tabW, bubW } = L.current;

        const minX = (tabW - bubW) / 2;
        const maxX = (navTabs.length - 1) * tabW + (tabW - bubW) / 2;

        const rawTarget = cX.current + g.dx;

        let delta;
        if (rawTarget < minX) {
          delta = (minX - cX.current) + (rawTarget - minX) * 0.25;
        } else if (rawTarget > maxX) {
          delta = (maxX - cX.current) + (rawTarget - maxX) * 0.25;
        } else {
          delta = g.dx;
        }

        bubX.setValue(delta);

        const vStretch = 1 + Math.min(Math.abs(g.vx) * 0.14, 0.32);
        strX.setValue(vStretch);
      },

      onPanResponderRelease: (_, g) => {
        const { tabW, bubW } = L.current;
        const minX = (tabW - bubW) / 2;
        const maxX = (navTabs.length - 1) * tabW + (tabW - bubW) / 2;

        bubX.flattenOffset();

        const rawTarget = cX.current + g.dx;
        const finalX    = Math.max(minX, Math.min(maxX, rawTarget));

        let snapI = nearestIdx(finalX);

        if (Math.abs(g.vx) > 0.65) {
          snapI = g.vx > 0
          ? Math.min(snapI + 1, navTabs.length - 1)
          : Math.max(snapI - 1, 0);
        }

        const snapX = xForIdx(snapI);
        cX.current  = snapX;

        Animated.spring(bubX, {
          toValue: snapX,
          ...SP.SNAP,
          useNativeDriver: true,
        }).start(triggerWobble);

        Animated.spring(strX, {
          toValue: 1,
          ...SP.RELEASE,
          useNativeDriver: true,
        }).start();

        if (snapI !== L.current.activeIdx) {
          navigation.navigate(navTabs[snapI].route);
        }
      },

      onPanResponderTerminate: () => {
        bubX.flattenOffset();
        Animated.spring(strX, { toValue: 1, ...SP.RELEASE, useNativeDriver: true }).start();
      },
    })
  ).current;

  const handlePress = useCallback((tab, idx) => {
    bubX.stopAnimation();

    const targetX  = xForIdx(idx);
    cX.current = targetX;

    Animated.parallel([
      Animated.spring(bubX, {
        toValue: targetX,
        ...SP.SNAP,
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(strX, { toValue: 1.30, duration: 80, useNativeDriver: true }),
        Animated.spring( strX, { toValue: 1,    ...SP.RELEASE, useNativeDriver: true }),
      ]),

      Animated.sequence([
        Animated.timing(icoS, { toValue: 0.82, duration: 72, useNativeDriver: true }),
        Animated.spring( icoS, { toValue: 1,    ...SP.ICON,   useNativeDriver: true }),
      ]),

      Animated.sequence([
        Animated.timing(lblY, { toValue: 5, duration: 0, useNativeDriver: true }),
        Animated.spring( lblY, { toValue: 0, tension: 200, friction: 9, useNativeDriver: true }),
      ]),

    ]).start(triggerWobble);

    navigation.navigate(tab.route);
  }, [xForIdx, triggerWobble, navigation, navTabs.length]);

  const onBarPressIn  = useCallback(() =>
    Animated.spring(barS, { toValue: 0.972, ...SP.BAR_IN,  useNativeDriver: true }).start(), [barS]);
  const onBarPressOut = useCallback(() =>
    Animated.spring(barS, { toValue: 1,     ...SP.BAR_OUT, useNativeDriver: true }).start(), [barS]);

  const glowOpacity = glwP.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.52] });

  const tabCount = navTabs.length;
  const tabW = containerWidth > 0 ? containerWidth / tabCount : 0;
  const bubW = tabW * BUBBLE_RATIO;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>

      <Animated.View
        style={{ transform: [{ scale: barS }] }}
        onTouchStart={onBarPressIn}
        onTouchEnd={onBarPressOut}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >

        <View style={styles.glassBody}>

          {/* ── L1: Blur base — fundação matte.
              Android: BlurView usa fallback com backgroundColor sólido
              (sem compositor de blur real). Empilhar 2 BlurViews aqui
              somava duas camadas opacas, aparecendo como um "quadrado"
              atrás da navbar. Mantemos 1 blur real no Android. ── */}
          <BlurView intensity={platformPick(32, 45)} tint="dark" style={StyleSheet.absoluteFill} />

          {/* ── L2: Blur de profundidade — espessura do vidro.
              No Android substituído por gradiente translúcido puro,
              preservando a leitura de profundidade sem duplicar a
              camada opaca de fallback. ── */}
          {Platform.OS === 'android' ? (
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              pointerEvents="none"
            />
          ) : (
            <BlurView
              intensity={12}
              tint="light"
              style={[StyleSheet.absoluteFill, { opacity: 0.38 }]}
            />
          )}

          <LinearGradient
            colors={[
              'rgba(255,255,255,0.14)',
              'rgba(252,254,255,0.05)',
              'rgba(242,248,255,0.10)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            pointerEvents="none"
          />

          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'transparent']}
            style={[StyleSheet.absoluteFill, { bottom: '52%' }]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            pointerEvents="none"
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,6,18,0.06)']}
            style={[StyleSheet.absoluteFill, { top: '55%' }]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
          />

          <View style={styles.distortionLayer} pointerEvents="none">
            <View style={styles.fakeDistortion} />
          </View>

          {containerWidth > 0 && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.bubble,
                {
                  width: bubW,
                transform: [
                  { translateX: bubX },
                ]
                },
              ]}
            >

              <LinearGradient
                colors={NAVBAR_UI.bubbleFill}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
              />

              <LinearGradient
                colors={NAVBAR_UI.bubbleDepth}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0.45 }}
                end={{ x: 0.5, y: 1 }}
              />

              <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { opacity: glowOpacity }]}
              >
                <LinearGradient
                  colors={NAVBAR_UI.bubbleGlow}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 0.75 }}
                />
              </Animated.View>

              <View style={styles.bubbleSpecularLine} />

              <View style={styles.bubbleInnerRing} />

            </Animated.View>
          )}

          <LinearGradient
            colors={['rgba(255,255,255,0.13)', 'transparent']}
            style={styles.globalLight}
            pointerEvents="none"
          />

          {navTabs.map((tab, idx) => {
            const isActive = (state?.routes?.[activeIndex]?.name ?? '') === tab.route;
            return (
              <TouchableOpacity
                key={tab.route}
                onPress={() => handlePress(tab, idx)}
                activeOpacity={1}
                style={styles.tab}
              >
                <Animated.View
                  style={[
                    styles.iconWrap,
                    isActive && { transform: [{ scale: icoS }] },
                  ]}
                >
                  <Ionicons
                    name={tab.icon}
                    size={IS_NARROW_SCREEN ? 19 : 22}
                    color={isActive ? NAVBAR_UI.tabActive : NAVBAR_UI.tabInactive}
                  />
                  <Animated.Text
                    numberOfLines={1}
                    style={[
                      styles.label,
                      {
                        color:      isActive ? NAVBAR_UI.tabActive   : NAVBAR_UI.labelInactive,
                        fontWeight: isActive ? '600'                  : '400',
                        transform:  [{ translateY: isActive ? lblY : 0 }],
                      },
                    ]}
                  >
                    {tab.label}
                  </Animated.Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.topEdgeHighlight} pointerEvents="none" />

          <View style={styles.chromaticBlue} pointerEvents="none">
            <LinearGradient
              colors={NAVBAR_UI.chromaticBlue}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>

          <View style={styles.chromaticAmber} pointerEvents="none">
            <LinearGradient
              colors={NAVBAR_UI.chromaticAmber}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>

        </View>{/* /glassBody */}

        <View style={styles.outerRing} pointerEvents="none" />

        <View style={styles.innerRing} pointerEvents="none" />

        <View style={styles.rimLeft} pointerEvents="none">
            <LinearGradient
            colors={NAVBAR_UI.rimLeft}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>

      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const RADIUS = 36;

const styles = StyleSheet.create({

  // Android: elevation com borderRadius (herdado do glassBody) e sem
  // backgroundColor opaco pinta um retângulo sólido atrás da navbar —
  // agravado aqui porque shadowColor customizado (azul) é ignorado pelo
  // elevation do Android, que sempre usa preto/cinza. Fix: backgroundColor
  // 'transparent' explícito + elevation reduzida no Android, deixando a
  // sombra suave (shadow*) carregar o efeito de profundidade.
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'transparent',
    shadowColor: NAVBAR_UI.bubbleShadowColor,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 26,
    elevation: Platform.OS === 'android' ? 8 : 14,
  },

  glassBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderRadius: RADIUS,
    backgroundColor: NAVBAR_UI.glassBodyBg,
    overflow: 'hidden',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 14,
  },

  label: {
    fontSize: IS_NARROW_SCREEN ? 9 : 10,
    marginTop: 3,
    letterSpacing: 0.3,
  },

  distortionLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },

  fakeDistortion: {
    flex: 1,
    backgroundColor: NAVBAR_UI.fakeDistortionBg,
    transform: [
      { scale:      1.4  },
      { translateX: -14  },
      { translateY:  10  },
    ],
  },

  // Android: elevation com shadowColor customizado é ignorado (Android
  // sempre usa preto/cinza para elevation). Numa forma pequena e muito
  // arredondada como a bolha, o retângulo de elevation ficava
  // proporcionalmente mais visível. Reduzida no Android; backgroundColor
  // (NAVBAR_UI.bubbleBg) já é opaco o bastante para sustentar o volume
  // visual sem depender da elevation.
  bubble: {
    position:        'absolute',
    top:              6,
    bottom:           6,
    borderRadius:     28,
    backgroundColor: NAVBAR_UI.bubbleBg,
    overflow:        'hidden',
    shadowColor:     NAVBAR_UI.bubbleShadowColor,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:    0.22,
    shadowRadius:     14,
    elevation: Platform.OS === 'android' ? 2 : 5,
  },

  bubbleSpecularLine: {
    position:        'absolute',
    top:              0,
    left:            '18%',
    width:           '40%',
    height:           1,
    backgroundColor: platformPick('rgba(255,255,255,0.60)', 'rgba(255,255,255,0.40)'),
    borderRadius:     1,
  },

  bubbleInnerRing: {
    position:    'absolute',
    top:          1,
    left:         1,
    right:        1,
    bottom:       1,
    borderRadius: 27,
    borderWidth:  0.5,
    borderColor: NAVBAR_UI.innerRingColor,
  },

  globalLight: {
    position: 'absolute',
    top:       0,
    left:      0,
    right:     0,
    height:   '55%',
    borderRadius: RADIUS,
  },

  topEdgeHighlight: {
    position:        'absolute',
    top:              0,
    left:             28,
    right:            28,
    height:           1,
    backgroundColor: NAVBAR_UI.topEdgeHighlight,
    borderRadius:     1,
  },

  chromaticBlue: {
    position:     'absolute',
    bottom:        0,
    left:          36,
    right:         36,
    height:        0.75,
    borderRadius:  0.75,
    overflow:     'hidden',
  },

  chromaticAmber: {
    position:     'absolute',
    top:           0,
    right:         52,
    width:         110,
    height:        0.75,
    borderRadius:  0.75,
    overflow:     'hidden',
  },

  outerRing: {
    position:    'absolute',
    top:          0,
    left:         0,
    right:        0,
    bottom:       0,
    borderRadius: RADIUS,
    borderWidth:  0.75,
    borderColor: NAVBAR_UI.outerRingColor,
  },

  innerRing: {
    position:    'absolute',
    top:          1.5,
    left:         1.5,
    right:        1.5,
    bottom:       1.5,
    borderRadius: RADIUS - 1.5,
    borderWidth:  0.5,
    borderColor: NAVBAR_UI.innerRingColor,
  },

  // Fix: height: '%' era um valor inválido (string incompleta) — o rim
  // light não renderizava com a altura pretendida em nenhuma plataforma.
  // Padronizado com '60%', consistente com os rim lights análogos dos
  // demais componentes de vidro do app.
  rimLeft: {
    position:    'absolute',
    left:         0,
    top:         '16%',
    width:        1,
    height:      '60%',
    borderRadius: 1,
    overflow:    'hidden',
  },
});
