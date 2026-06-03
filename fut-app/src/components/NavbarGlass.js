/**
 * NavbarGlass — REFACTOR COMPLETO
 * ─────────────────────────────────────────────────────────────────────────────
 * Liquid glass navbar com física iOS-grade e glassmorphism premium.
 *
 * ── BUGS CORRIGIDOS ──────────────────────────────────────────────────────────
 *
 *  #1  POSIÇÃO DA BOLHA (raiz)
 *      Original: `left: bubbleOffset` (estático) + `translateX: dragX` (dinâmico)
 *      Problema: centro visual ≠ centro do tab (erro de ~28px por tab)
 *      Fix: `bubbleX` = posição absoluta da borda esquerda da bolha.
 *           Para tab i → bubbleX = i * tabW + (tabW − bubW) / 2
 *           Zero de `left` no estilo — sem double-offset.
 *
 *  #2  CLOSURES MORTAS NO PANRESPONDER
 *      Original: PanResponder criado com useRef uma única vez, capturando
 *                `tabWidth` e `bubbleOffset` do primeiro render (containerWidth=0).
 *      Fix: `layoutRef` (useRef) armazena `tabW` e `bubW` e é atualizado via
 *           useEffect toda vez que containerWidth muda. PanResponder lê de
 *           `layoutRef.current` — sempre fresco, sem re-criação.
 *
 *  #3  DRAG NÃO GRUDA NO DEDO
 *      Original: `lastOffset.current = dragX.__getValue()` salva posição, mas
 *                a posição visual tem +bubbleOffset que o gesto desconhece.
 *      Fix: padrão `extractOffset` / `flattenOffset`:
 *           • onGrant: `bubX.extractOffset()` → _offset = posição atual, _value = 0
 *           • onMove:  `bubX.setValue(delta)` → total = offset + delta = segue o dedo
 *           • onRelease: `bubX.flattenOffset()` → merge limpo antes do spring

 *  #4  TARGETX ERRADO EM handlePress
 *      Original: `index * tabWidth` (sem o centering offset)
 *      Fix: `index * tabW + (tabW - bubW) / 2`
 *
 *  #5  BUBBLEwobble ERRADO (esticar ≠ achatar)
 *      Original: `toValue: 1.2` — fazia a bolha CRESCER no impacto (bug visual)
 *      Fix: `toValue: 0.80` — squash real, seguido de spring para 1 (gelatina)
 *
 *  #6  STRETCH BASEADO EM dx ACUMULADO
 *      Original: `1 + Math.abs(gesture.dx) / 300` — cresce com distância total
 *      Fix: `1 + Math.abs(gesture.vx) * 0.14` — proporcional à velocidade atual
 *
 *  #7  SEM VELOCITY FLICK NO SNAP
 *      Original: sempre snapa para o tab mais próximo pela posição
 *      Fix: se `|vx| > 0.65`, avança +1 tab na direção do flick (comportamento iOS)
 *
 *  #8  RUBBER-BAND NAS BORDAS
 *      Original: clamp duro (Math.max/min) — travava abruptamente
 *      Fix: resistência de 25% além dos limites — efeito borracha suave
 *
 *  #9  GLOW LOOP COMENTADO
 *      Fix: restaurado com `glowPulse` Animated.loop
 *
 * #10  PRESSANIM EXPANDIA AO INVÉS DE CONTRAIR
 *      Original: `outputRange: [1, 1.05]`
 *      Fix: `toValue: 0.972` no pressIn (padrão iOS haptic feedback)
 *
 * #11  IMPACTO SÓ DEPOIS DO SPRING (callback seguro)
 *      Original: `.start(() => wobble)` em onPanResponderRelease — correto,
 *                mas em handlePress o wobble rodava em paralelo (competia)
 *      Fix: `triggerWobble` como helper, chamado somente no callback do spring
 *
 * ── MELHORIAS PREMIUM ────────────────────────────────────────────────────────
 *   • Dual BlurView (base matte + camada de profundidade)
 *   • Glass tint gradient (azul-branco frio, como visionOS)
 *   • Ambient top-left light (iluminação de estúdio)
 *   • Depth fade inferior (espessura do vidro)
 *   • Bubble: glass fill tri-stop + depth fade + specular line + inner ring
 *   • Chromatic fringe: borda inferior azul + canto âmbar (refração real)
 *   • Outer ring 0.75px + Inner inset ring 0.5px (fora do clip)
 *   • Left rim light (borda esquerda como foto de produto Apple)
 *   • Bar press: scale 0.972 com spring stiff (tátil)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Tabs ──────────────────────────────────────────────────────────────────
const TABS = [
  { route: 'Ingressos', icon: 'ticket-outline', label: 'Ticket' },
  { route: 'Socio',     icon: 'people-outline',  label: 'Sócio'  },
  { route: 'Home',      icon: 'home',            label: 'Home'   },
  { route: 'Loja',      icon: 'cart-outline',    label: 'Loja'   },
  { route: 'Perfil',    icon: 'person-outline',  label: 'Perfil' },
];

// ─── Physics presets (iOS-calibrated) ─────────────────────────────────────
const SP = {
  SNAP:    { tension: 112, friction: 13  },  // slide da bolha
  RELEASE: { tension: 230, friction: 11  },  // soltar stretch
  ICON:    { tension: 340, friction: 8   },  // bounce do ícone
  WOBBLE:  { tension: 62,  friction: 3.8 },  // gelatina de impacto
  BAR_IN:  { tension: 420, friction: 22  },  // press feedback
  BAR_OUT: { tension: 260, friction: 18  },  // release feedback
  GLOW:    { tension: 50,  friction: 10  },  // sync de posição suave
};

// Proporção largura da bolha / largura do tab
const BUBBLE_RATIO = 0.82;

// ─── Componente ────────────────────────────────────────────────────────────
export default function NavbarGlass({ state, descriptors, navigation }) {
  const activeIndex = state?.index ?? 0;
  const [containerWidth, setContainerWidth] = useState(0);

  // ── Layout ref ───────────────────────────────────────────────────────────
  // Mantém tabW/bubW frescos sem re-criar o PanResponder.
  // PanResponder lê SEMPRE de L.current — nunca de closures do render.
  const L = useRef({ tabW: 0, bubW: 0, activeIdx: 0 });

  useEffect(() => {
    if (containerWidth > 0) {
      L.current.tabW = containerWidth / TABS.length;
      L.current.bubW = L.current.tabW * BUBBLE_RATIO;
    }
  }, [containerWidth]);

  useEffect(() => {
    L.current.activeIdx = activeIndex;
  }, [activeIndex]);

  // ── Animation values ─────────────────────────────────────────────────────
  //   bubX  → posição absoluta da borda esquerda da bolha (sem `left` estático)
  //   strX  → scaleX: stretch horizontal (corrida / arrasto)
  //   wobY  → scaleY: squash vertical (impacto gelatina)
  //   icoS  → scale do ícone ativo
  //   lblY  → translateY do label ativo (drop-and-rise)
  //   barS  → scale de todo o bar (haptic press feedback)
  //   glwP  → glow breathing da bolha
  const bubX = useRef(new Animated.Value(0)).current;
  const strX = useRef(new Animated.Value(1)).current;
  const wobY = useRef(new Animated.Value(1)).current;
  const icoS = useRef(new Animated.Value(1)).current;
  const lblY = useRef(new Animated.Value(0)).current;
  const glwP = useRef(new Animated.Value(0)).current;
  const barS = useRef(new Animated.Value(1)).current;

  // cX: posição comprometida da bolha (tab atual).
  // Atualizado a cada snap/press/sync — usado como âncora no drag.
  const cX = useRef(0);

  // ── Helpers de posição ────────────────────────────────────────────────────
  // Calcula a posição correta da borda esquerda da bolha para o tab i.
  // FIX #1: encoda o centering offset diretamente no valor — sem `left` estático.
  const xForIdx = useCallback((i) => {
    const { tabW, bubW } = L.current;
    return i * tabW + (tabW - bubW) / 2;
  }, []);

  // Calcula o índice mais próximo dado um valor de bubX.
  const nearestIdx = useCallback((bx) => {
    const { tabW, bubW } = L.current;
    const center = bx + bubW / 2;
    return Math.max(0, Math.min(TABS.length - 1,
      Math.round((center - tabW / 2) / tabW)
    ));
  }, []);

  // ── Sync da bolha com activeIndex ────────────────────────────────────────
  // Roda quando a rota muda por navegação externa (deep link, back button etc.)
  useEffect(() => {
    if (containerWidth <= 0) return;
    // Calcula inline (não via xForIdx) para garantir que L.current está atualizado
    // pelos dois effects terem a mesma dep containerWidth.
    const tW = containerWidth / TABS.length;
    const bW = tW * BUBBLE_RATIO;
    const tx = activeIndex * tW + (tW - bW) / 2;
    cX.current = tx;
    Animated.spring(bubX, { toValue: tx, ...SP.GLOW, useNativeDriver: true }).start();
  }, [activeIndex, containerWidth]);

  // ── Glow breathing loop ───────────────────────────────────────────────────
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

  // ── Impacto gelatina ──────────────────────────────────────────────────────
  // FIX #5: toValue < 1 = squash, depois spring para 1 = bounce gelatina real.
  // Chamado SOMENTE no callback do spring (após a bolha chegar).
  const triggerWobble = useCallback(() => {
    Animated.sequence([
      Animated.timing(wobY, { toValue: 0.80, duration: 62,  useNativeDriver: true }),
      Animated.spring( wobY, { toValue: 1,    ...SP.WOBBLE,  useNativeDriver: true }),
    ]).start();
  }, [wobY]);

  // ─────────────────────────────────────────────────────────────────────────
  // PAN RESPONDER
  // ─────────────────────────────────────────────────────────────────────────
  // FIX #2: todos os valores de layout vêm de L.current (sempre frescos).
  // FIX #3: padrão extractOffset/flattenOffset — drag 1:1 com o dedo.
  // FIX #6: stretch via vx (velocidade), não dx (distância acumulada).
  // FIX #7: velocity flick para avançar tab na direção do gesto.
  // FIX #8: rubber-band nas bordas (25% de resistência).
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: ()     => true,
      onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dx) > 2,

      onPanResponderGrant: () => {
        // Captura a posição visual atual como offset e reseta value para 0.
        // A partir de agora: bubX_total = offset (posição atual) + value (delta do dedo)
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

        // Limites: posição da bolha para tab 0 e tab último
        const minX = (tabW - bubW) / 2;
        const maxX = (TABS.length - 1) * tabW + (tabW - bubW) / 2;

        // Posição alvo = onde a bolha estava ao ser pega + quanto o dedo andou
        const rawTarget = cX.current + g.dx;

        // FIX #8: rubber-band nas bordas (25% de resistência além do limite)
        let delta;
        if (rawTarget < minX) {
          delta = (minX - cX.current) + (rawTarget - minX) * 0.25;
        } else if (rawTarget > maxX) {
          delta = (maxX - cX.current) + (rawTarget - maxX) * 0.25;
        } else {
          delta = g.dx;
        }

        // bubX_total = offset (cX.current) + delta = posição visual exata
        bubX.setValue(delta);

        // FIX #6: stretch proporcional à velocidade atual, não à distância total
        const vStretch = 1 + Math.min(Math.abs(g.vx) * 0.14, 0.32);
        strX.setValue(vStretch);
      },

      onPanResponderRelease: (_, g) => {
        const { tabW, bubW } = L.current;
        const minX = (tabW - bubW) / 2;
        const maxX = (TABS.length - 1) * tabW + (tabW - bubW) / 2;

        // Merge offset + value → value único (posição final real)
        bubX.flattenOffset();

        // Posição real clampeada (sem rubber-band) para calcular snap
        const rawTarget = cX.current + g.dx;
        const finalX    = Math.max(minX, Math.min(maxX, rawTarget));

        // FIX #7: calcular índice mais próximo por posição
        let snapI = nearestIdx(finalX);

        // FIX #7: velocity flick — avança na direção se rápido o suficiente
        if (Math.abs(g.vx) > 0.65) {
          snapI = g.vx > 0
            ? Math.min(snapI + 1, TABS.length - 1)
            : Math.max(snapI - 1, 0);
        }

        const snapX = xForIdx(snapI);
        cX.current  = snapX;

        // Spring até o tab de destino → wobble no callback (após chegada)
        Animated.spring(bubX, {
          toValue: snapX,
          ...SP.SNAP,
          useNativeDriver: true,
        }).start(triggerWobble);

        // Libera o stretch
        Animated.spring(strX, {
          toValue: 1,
          ...SP.RELEASE,
          useNativeDriver: true,
        }).start();

        // Navega somente se mudou de tab
        if (snapI !== L.current.activeIdx) {
          navigation.navigate(TABS[snapI].route);
        }
      },

      onPanResponderTerminate: () => {
        bubX.flattenOffset();
        Animated.spring(strX, { toValue: 1, ...SP.RELEASE, useNativeDriver: true }).start();
      },
    })
  ).current;

  // ─────────────────────────────────────────────────────────────────────────
  // PRESS DE TAB
  // ─────────────────────────────────────────────────────────────────────────
  // FIX #4: usa xForIdx() para targetX correto (inclui centering offset).
  // FIX #5: wobble como callback pós-spring (não em paralelo).
  const handlePress = useCallback((tab, idx) => {
    bubX.stopAnimation(); // cancela qualquer spring em curso

    const targetX  = xForIdx(idx);
    cX.current = targetX;

    Animated.parallel([
      // Slide da bolha
      Animated.spring(bubX, {
        toValue: targetX,
        ...SP.SNAP,
        useNativeDriver: true,
      }),

      // Stretch: estica na saída, volta com spring
      Animated.sequence([
        Animated.timing(strX, { toValue: 1.30, duration: 80, useNativeDriver: true }),
        Animated.spring( strX, { toValue: 1,    ...SP.RELEASE, useNativeDriver: true }),
      ]),

      // Ícone: micro-bounce de press
      Animated.sequence([
        Animated.timing(icoS, { toValue: 0.82, duration: 72, useNativeDriver: true }),
        Animated.spring( icoS, { toValue: 1,    ...SP.ICON,   useNativeDriver: true }),
      ]),

      // Label: drop-and-rise
      Animated.sequence([
        Animated.timing(lblY, { toValue: 5, duration: 0, useNativeDriver: true }),
        Animated.spring( lblY, { toValue: 0, tension: 200, friction: 9, useNativeDriver: true }),
      ]),

    ]).start(triggerWobble); // FIX #5: wobble DEPOIS que o spring chega

    navigation.navigate(tab.route);
  }, [xForIdx, triggerWobble, navigation]);

  // ── Haptic press feedback do bar inteiro ─────────────────────────────────
  // FIX #10: encolhe (0.972) ao invés de expandir, padrão iOS
  const onBarPressIn  = useCallback(() =>
    Animated.spring(barS, { toValue: 0.972, ...SP.BAR_IN,  useNativeDriver: true }).start(), [barS]);
  const onBarPressOut = useCallback(() =>
    Animated.spring(barS, { toValue: 1,     ...SP.BAR_OUT, useNativeDriver: true }).start(), [barS]);

  // ── Interpolações derivadas ───────────────────────────────────────────────
  const glowOpacity = glwP.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.52] });

  // Dimensões para render (dependem de containerWidth, atualizam normalmente)
  const tabW = containerWidth > 0 ? containerWidth / TABS.length : 0;
  const bubW = tabW * BUBBLE_RATIO;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.wrapper}>

      {/* Transform de scale para press feedback do bar inteiro */}
      <Animated.View
        style={{ transform: [{ scale: barS }] }}
        onTouchStart={onBarPressIn}
        onTouchEnd={onBarPressOut}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >

        {/* ══════════════════════════════════════════════════════════════════
            CORPO DE VIDRO (overflow: hidden — clip de todas as camadas)
        ══════════════════════════════════════════════════════════════════ */}
        <View style={styles.glassBody}>

          {/* ── L1: Blur base — fundação matte ── */}
          <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />

          {/* ── L2: Blur de profundidade — espessura do vidro ── */}
          <BlurView
            intensity={12}
            tint="light"
            style={[StyleSheet.absoluteFill, { opacity: 0.38 }]}
          />

          {/* ── L3: Tom base do vidro — azul-branco frio (visionOS) ── */}
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

          {/* ── L4: Reflexo ambiental superior esquerdo ── */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'transparent']}
            style={[StyleSheet.absoluteFill, { bottom: '52%' }]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            pointerEvents="none"
          />

          {/* ── L5: Fade de profundidade inferior ── */}
          <LinearGradient
            colors={['transparent', 'rgba(0,6,18,0.06)']}
            style={[StyleSheet.absoluteFill, { top: '55%' }]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
          />

          {/* ── L6: Distorção fake (sutil volume interno) ── */}
          <View style={styles.distortionLayer} pointerEvents="none">
            <View style={styles.fakeDistortion} />
          </View>

          {/* ════════════════════════════════════════════════════════════════
              BOLHA LÍQUIDA
              FIX #1: bubX = posição absoluta da borda esquerda
                      Sem `left` estático → sem double-offset
              FIX #2: PanResponder lê layout de L.current (sempre fresco)
              FIX #3: extractOffset/flattenOffset → gruda 1:1 no dedo
          ════════════════════════════════════════════════════════════════ */}
          {containerWidth > 0 && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.bubble,
                {
                  width: bubW,
                  // FIX #1: SEM `left: bubbleOffset` aqui.
                  // bubX já encoda o offset de centralização.
                transform: [
                  { translateX: bubX },
                ]
                },
              ]}
            >

              

              {/* Preenchimento de vidro da bolha (gradiente tri-stop) */}
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.30)',
                  'rgba(255,255,255,0.12)',
                  'rgba(255,255,255,0.18)',
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
              />

              {/* Fade de profundidade inferior da bolha */}
              <LinearGradient
                colors={['transparent', 'rgba(250, 0, 0, 0.19)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0.45 }}
                end={{ x: 0.5, y: 1 }}
              />

              {/* Glow breathing (FIX #9: restaurado) */}
              <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { opacity: glowOpacity }]}
              >
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,0.24)',
                    'rgba(255,255,255,0.08)',
                    'transparent',
                  ]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 0.75 }}
                />
              </Animated.View>

              {/* Linha especular superior da bolha */}
              <View style={styles.bubbleSpecularLine} />

              {/* Anel interno inset da bolha */}
              <View style={styles.bubbleInnerRing} />

            </Animated.View>
          )}

          {/* ── L7: Linha de brilho global (iluminação superior) ── */}
          <LinearGradient
            colors={['rgba(255,255,255,0.13)', 'transparent']}
            style={styles.globalLight}
            pointerEvents="none"
          />

          {/* ────────────────────────────────────────────────────────
              TABS — Ícones e Labels
          ──────────────────────────────────────────────────────── */}
          {TABS.map((tab, idx) => {
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
                    size={22}
                    color={isActive ? '#b20000' : 'rgba(255,255,255,0.82)'}
                  />
                  <Animated.Text
                    style={[
                      styles.label,
                      {
                        color:      isActive ? '#b20000'             : 'rgba(255,255,255,0.58)',
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

          {/* ── Acabamento: linha especular no topo do vidro ── */}
          <View style={styles.topEdgeHighlight} pointerEvents="none" />

          {/* ── Separação cromática: borda inferior azul (ondas curtas) ── */}
          <View style={styles.chromaticBlue} pointerEvents="none">
            <LinearGradient
              colors={[
                'transparent',
                'rgba(150,180,255,0.26)',
                'rgba(175,200,255,0.42)',
                'rgba(150,180,255,0.26)',
                'transparent',
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>

          {/* ── Separação cromática: canto superior direito âmbar (ondas longas) ── */}
          <View style={styles.chromaticAmber} pointerEvents="none">
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255,222,155,0.22)',
                'rgba(255,202,115,0.34)',
                'transparent',
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>

        </View>{/* /glassBody */}

        {/* ── Anel de borda externo (fora do clip para mostrar completo) ── */}
        <View style={styles.outerRing} pointerEvents="none" />

        {/* ── Anel de borda interno inset (cria ilusão de espessura) ── */}
        <View style={styles.innerRing} pointerEvents="none" />

        {/* ── Rim light esquerdo (foto de produto Apple) ── */}
        <View style={styles.rimLeft} pointerEvents="none">
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.38)',
              'rgba(255,255,255,0.22)',
              'rgba(255,255,255,0.08)',
              'transparent',
            ]}
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
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const RADIUS = 36;

const styles = StyleSheet.create({

  // ── Wrapper externo (sombra de levitação) ────────────────────────────────
  wrapper: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    shadowColor: '#000820',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 26,
    elevation: 14,
  },

  // ── Corpo de vidro ───────────────────────────────────────────────────────
  glassBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderRadius: RADIUS,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden', // clip das camadas internas
  },

  // ── Tab ──────────────────────────────────────────────────────────────────
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
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.3,
  },

  // ── Camada de distorção fake ─────────────────────────────────────────────
  distortionLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },

  fakeDistortion: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.025)',
    transform: [
      { scale:      1.4  },
      { translateX: -14  },
      { translateY:  10  },
    ],
  },

  // ── Bolha líquida ────────────────────────────────────────────────────────
  // NOTA: sem `left` aqui — a centralização está em bubX (translateX).
  bubble: {
    position:        'absolute',
    top:              6,
    bottom:           6,
    borderRadius:     28,
    backgroundColor: 'rgba(70,70,80,0.15)',
    overflow:        'hidden',
    // Glow shadow
    shadowColor:     'rgba(200,220,255,0.9)',
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:    0.22,
    shadowRadius:     14,
    elevation:        5,
  },

  // Linha especular no topo da bolha (reflexo sharp da aresta)
  bubbleSpecularLine: {
    position:        'absolute',
    top:              0,
    left:            '18%',
    width:           '40%',
    height:           1,
    backgroundColor: 'rgba(255,255,255,0.60)',
    borderRadius:     1,
  },

  // Anel interno inset da bolha (ilusão de espessura)
  bubbleInnerRing: {
    position:    'absolute',
    top:          1,
    left:         1,
    right:        1,
    bottom:       1,
    borderRadius: 27,
    borderWidth:  0.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  // ── Iluminação global superior ───────────────────────────────────────────
  globalLight: {
    position: 'absolute',
    top:       0,
    left:      0,
    right:     0,
    height:   '55%',
    borderRadius: RADIUS,
  },

  // ── Linha especular no topo do glassBody ────────────────────────────────
  topEdgeHighlight: {
    position:        'absolute',
    top:              0,
    left:             28,
    right:            28,
    height:           1,
    backgroundColor: 'rgba(255,255,255,0.40)',
    borderRadius:     1,
  },

  // ── Chromatic fringe: azul inferior ─────────────────────────────────────
  chromaticBlue: {
    position:     'absolute',
    bottom:        0,
    left:          36,
    right:         36,
    height:        0.75,
    borderRadius:  0.75,
    overflow:     'hidden',
  },

  // ── Chromatic fringe: âmbar superior direito ─────────────────────────────
  chromaticAmber: {
    position:     'absolute',
    top:           0,
    right:         52,
    width:         110,
    height:        0.75,
    borderRadius:  0.75,
    overflow:     'hidden',
  },

  // ── Border rings (fora do clip) ──────────────────────────────────────────
  // Outer ring: define o "envelope" do vidro
  outerRing: {
    position:    'absolute',
    top:          0,
    left:         0,
    right:        0,
    bottom:       0,
    borderRadius: RADIUS,
    borderWidth:  0.75,
    borderColor: 'rgba(255,255,255,0.46)',
  },

  // Inner inset ring: cria profundidade de espessura (duas superfícies do vidro)
  innerRing: {
    position:    'absolute',
    top:          1.5,
    left:         1.5,
    right:        1.5,
    bottom:       1.5,
    borderRadius: RADIUS - 1.5,
    borderWidth:  0.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  // ── Rim light esquerdo ───────────────────────────────────────────────────
  rimLeft: {
    position:    'absolute',
    left:         0,
    top:         '16%',
    width:        1,
    height:      '%',
    borderRadius: 1,
    overflow:    'hidden',
  },
});