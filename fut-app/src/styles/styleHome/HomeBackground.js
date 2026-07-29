/**
 * HomeBackground
 * ─────────────────────────────────────────────────────────────────────────────
 * Fundo "Liquid Glass" cyber-retrô para a Home — mesma linguagem visual da
 * CampaignGlass/PremiumGlassCard (base escura + blur + gradientes radiais +
 * vinheta + grão), pensado para ficar ATRÁS de todo o conteúdo existente,
 * sem alterar nenhum layout, componente ou lógica da tela.
 *
 * Camadas (baixo → cima):
 *   1. Base sólida quase-preta (evita qualquer "flash" antes do gradiente)
 *   2. Gradiente linear de fundo (mantém a leitura escura → vermelho-vinho)
 *   3. Glow radial superior-direito (vermelho difuso, entra por trás dos cards)
 *   4. Glow radial inferior-esquerdo (mais sutil, profundidade)
 *   5. Scanlines/grade sutil estilo cyber-retrô (opcional, muito discreta)
 *   6. Ruído (noise) — textura fina de grão para tirar o "chapado" do gradiente
 *   7. Vinheta nas bordas (escurece cantos, foca o conteúdo central)
 *
 * Uso (drop-in, substitui o LinearGradient antigo 1:1):
 *
 *   <HomeBackground isDarkMode={isDarkMode} />
 *
 * Continua absolutamente posicionado (StyleSheet.absoluteFill) e com
 * pointerEvents="none", então não interfere em nenhum toque/scroll existente.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const HomeBackground = ({ isDarkMode = true }) => {
  // Paletas — dark é o cyber-retrô "quase-preto + vinho"; light mantém o
  // vermelho sólido original só que com a mesma arquitetura de camadas,
  // para não perder a opção de tema claro já existente na tela.
  const base = isDarkMode
    ? ['#070707', '#0d0303', '#160202']
    : ['#ac0707', '#8c0505', '#6e0004'];

  const glowTop = isDarkMode
    ? ['rgba(224, 20, 30, 0.47)', 'rgba(160, 10, 20,0.10)', 'transparent']
    : ['rgba(240, 236, 236, 0.63)', 'rgba(255, 80, 80, 0.12)', 'transparent'];

  const glowBottom = isDarkMode
    ? ['rgba(160, 0, 19, 0.83)', 'rgba(80, 0, 10, 0.06)', 'transparent']
    : ['rgba(216, 212, 212, 0.62)', 'rgba(120, 10, 10, 0.08)', 'transparent'];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Base sólida */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: base[0] }]} />

      {/* 2. Gradiente linear de fundo — profundidade geral escuro → vinho */}
      <LinearGradient
        colors={base}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
      />

      {/* 3. Glow radial superior-direito — "respiro" de luz vermelha atrás do
             topo da tela, onde ficam os cards de perfil/ações */}
      <View
        style={{
          position: 'absolute',
          top: -SCREEN_H * 0.18,
          right: -SCREEN_W * 0.35,
          width: SCREEN_W * 1.15,
          height: SCREEN_W * 1.15,
          borderRadius: SCREEN_W * 0.6,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={glowTop}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* 4. Glow radial inferior-esquerdo — mais sutil, dá profundidade ao
             scroll sem competir com o glow principal */}
      <View
        style={{
          position: 'absolute',
          bottom: -SCREEN_H * 0.15,
          left: -SCREEN_W * 0.4,
          width: SCREEN_W * 1.1,
          height: SCREEN_W * 1.1,
          borderRadius: SCREEN_W * 0.55,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={glowBottom}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* 5. Camada de profundidade extra via blur — funde os dois glows num
             halo contínuo, como no vidro líquido da Loja (CampaignGlass) */}
      <BlurView
        intensity={isDarkMode ? 45 : 30}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      {/* 6. Scanlines cyber-retrô — linhas horizontais extremamente sutis,
             só perceptíveis de perto, reforçam o tema "retrô" sem virar ruído
             visual que atrapalhe a leitura dos cards */}
      <View style={styles.scanlineWrap} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={styles.scanline} />
        ))}
      </View>

      {/* 7. Grão/noise — pontos aleatórios em baixíssima opacidade para tirar
             o aspecto "chapado" do gradiente digital */}
      <NoiseOverlay dark={isDarkMode} />

      {/* 8. Vinheta — escurece os cantos/bordas, focando o olhar no centro
             onde ficam os componentes existentes */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'transparent']}
        style={[StyleSheet.absoluteFill, { height: SCREEN_H * 0.22 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={[
          StyleSheet.absoluteFill,
          { top: SCREEN_H * 0.6, height: SCREEN_H * 0.4 },
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent', 'transparent', 'rgba(0,0,0,0.45)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
    </View>
  );
};

// ─── Noise overlay ────────────────────────────────────────────────────────
// Grade de pontos com opacidades levemente variadas, distribuída de forma
// determinística (sem Math.random em cada render) para simular grão fino
// sem custo de performance nem flicker entre re-renders.
const NOISE_ROWS = 26;
const NOISE_COLS = 14;

const NoiseOverlay = React.memo(({ dark }) => {
  const dots = [];
  let seed = 17;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let r = 0; r < NOISE_ROWS; r++) {
    for (let c = 0; c < NOISE_COLS; c++) {
      const jitterX = pseudoRandom() * 14;
      const jitterY = pseudoRandom() * 14;
      const opacity = 0.015 + pseudoRandom() * 0.03;
      dots.push({
        left: (c / NOISE_COLS) * SCREEN_W + jitterX,
        top: (r / NOISE_ROWS) * SCREEN_H + jitterY,
        opacity,
      });
    }
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((d, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: 1.4,
            height: 1.4,
            borderRadius: 0.7,
            backgroundColor: dark ? '#FFFFFF' : '#000000',
            opacity: d.opacity,
          }}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  scanlineWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    opacity: 0.5,
  },
  scanline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});

export default HomeBackground;
