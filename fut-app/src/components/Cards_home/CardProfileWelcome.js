/**
 * CardProfileWelcome â€” Premium Liquid Glass Edition
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * LÃ³gica original 100% preservada.
 * Apenas a camada visual foi reescrita com a engenharia do PremiumGlassCard.
 *
 * Arquitetura de camadas (baixo â†’ cima):
 *
 *  [outerContainer] â€” sem overflow:hidden, ancora camadas especulares
 *   C0. Glow de respiro vermelho (Animated, vaza para fora)
 *   S1. Sombra de levitaÃ§Ã£o (grande, difusa)
 *   S2. Sombra de contato (prÃ³xima, sharp)
 *
 *  [wrapper] â€” overflow:hidden (clip do shimmer e blurs)
 *   G1. BlurView primÃ¡rio (base fosca, intensity 90)
 *   G2. BlurView secundÃ¡rio (profundidade, intensity 22)
 *   G3. Tom base escuro diagonal
 *   G4. Reflexo ambiental superior-esquerdo
 *   G5. Highlight de volume central (curvatura 3D)
 *   G6. Vignette de profundidade inferior
 *   G7. Tint vermelho sutil (identidade da marca)
 *   G8. Shimmer diagonal animado (Animated)
 *   G9. glowOverlay vermelho (preservado do original)
 *   â”€â”€ ConteÃºdo original intacto â”€â”€
 *
 *  [specular â€” fora do clip]
 *   E1. Barra especular superior (1px)
 *   E2. Rim light esquerdo (1px vertical)
 *   E3. Franja cromÃ¡tica inferior (tom quente/vermelho)
 *   E4. Franja Ã¢mbar superior-direita
 *   E5. Anel externo (0.75px branco)
 *   E6. Anel interno inset (0.5px branco recuado)
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { Value, timing, loop, sequence, delay } = Animated;


export default function CardProfileWelcome({
    isDarkMode,
    setIsDarkMode,
  }) {
  // const [isDarkMode, setIsDarkMode] = useState(true);
  const navigation = useNavigation();
  const { cliente } = useAuth();
  const { subscription, loadingSubscription } = useSubscription();
  const avatarUri = cliente?.url_foto_clientes?.trim() || 'https://i.pravatar.cc/150?img=12';

  // â”€â”€ LÃ³gica original â€” intacta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const nomeCompleto = [
    cliente?.nome_clientes?.trim(),
    cliente?.sobrenome_clientes?.trim(),
  ].filter(Boolean).join(' ').trim() || 'UsuÃ¡rio';
  const statusAssinatura = loadingSubscription
    ? ''
    : subscription?.title
      || subscription?.nome_plano
      || subscription?.plan?.title
      || 'Não sócio';

  const fullText = [
    'Seja bem-vindo',
    `${nomeCompleto},`,
    'aproveite nosso app'
  ];

  const [displayedText, setDisplayedText] = useState(['', '', '']);
  const [lineIndex, setLineIndex]         = useState(0);
  const [charIndex, setCharIndex]         = useState(0);

  useEffect(() => {
    setDisplayedText(['', '', '']);
    setLineIndex(0);
    setCharIndex(0);
  }, [nomeCompleto, avatarUri]);

  useEffect(() => {
    const typingSpeed = 40;

    const interval = setInterval(() => {
      if (lineIndex < fullText.length) {
        const currentLine = fullText[lineIndex];

        if (charIndex < currentLine.length) {
          setDisplayedText(prev => {
            const newText = [...prev];
            newText[lineIndex] = currentLine.substring(0, charIndex + 1);
            return newText;
          });
          setCharIndex(prev => prev + 1);
        } else {
          setLineIndex(prev => prev + 1);
          setCharIndex(0);
        }
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [charIndex, lineIndex]);
  // â”€â”€ fim lÃ³gica original â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // â”€â”€ AnimaÃ§Ãµes visuais (novas â€” nÃ£o interferem na lÃ³gica existente) â”€â”€â”€â”€â”€â”€â”€â”€
  const shimmerAnim = useRef(new Value(0)).current;
  const breatheAnim = useRef(new Value(0)).current;

  // Varredura diagonal de shimmer
  useEffect(() => {
    const anim = loop(
      sequence([
        delay(4400),
        timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        timing(shimmerAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // Glow de respiro suave
  useEffect(() => {
    const anim = loop(
      sequence([
        timing(breatheAnim, { toValue: 1, duration: 3400, useNativeDriver: true }),
        timing(breatheAnim, { toValue: 0, duration: 3400, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // Valores derivados das animaÃ§Ãµes
  const shimmerX = shimmerAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [-(SCREEN_WIDTH * 1.3), SCREEN_WIDTH * 1.3],
  });

  const breatheOpacity = breatheAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 0.18],
  });
  // â”€â”€ fim animaÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <View style={styles.outerContainer}>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          CAMADA 0 â€” Glow de respiro vermelho
          Halo de luz crimson que pulsa ao redor do card, identidade
          da marca preservada e elevada ao nÃ­vel de emissÃ£o fÃ­sica.
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <Animated.View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          margin:       -22,
          borderRadius: 50,
          overflow:     'hidden',
          opacity:      breatheOpacity,
        }}
      >
        <LinearGradient
          colors={[
            'rgba(255, 50, 50, 0.32)',
            'rgba(220, 30, 30, 0.16)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
        />
      </Animated.View>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          CORPO DE VIDRO â€” overflow:hidden (clip do shimmer)
          As sombras ficam no outerContainer (sem overflow) para renderizar
          corretamente no iOS â€” melhoria implÃ­cita da arquitetura original.
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <View style={styles.wrapper}>

        {/* BotÃ£o de configuraÃ§Ãµes â€” zIndex 10, preservado integralmente */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Loja', { screen: 'Carrinho' })}
        >
          <BlurView intensity={5} tint="dark" style={styles.editBlur}>
            <Ionicons name="cart-outline" size={16} color="#fff" />
          </BlurView>
        </TouchableOpacity>

                <TouchableOpacity
          style={styles.themeButton}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <BlurView intensity={5} tint="dark" style={styles.editBlur}>
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={16}
              color="#fff"
            />
          </BlurView>
        </TouchableOpacity>

        {/* G1: BlurView primÃ¡rio â€” base fosca principal */}
        <BlurView
          intensity={90}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />

        {/* G2: BlurView secundÃ¡rio â€” profundidade adicional */}
        <BlurView
          intensity={22}
          tint="dark"
          style={[StyleSheet.absoluteFill, { opacity: 0.55 }]}
        />

        {/* G3: Tom base escuro â€” diagonal para dinamismo */}
        <LinearGradient
          colors={[
            'rgba(192, 192, 192, 0.07)',
            'rgba(192, 192, 192, 0.07)',
            'rgba(192, 192, 192, 0.07)',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* G4: Reflexo ambiental superior-esquerdo
            Fonte de luz de estÃºdio â€” efeito visionOS clÃ¡ssico */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.12)',
            'rgba(255, 255, 255, 0.05)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.65, y: 0.55 }}
        />

        {/* G5: Highlight de volume central
            Centro levemente mais brilhante â€” curvatura ilusÃ³ria 3D */}
        <LinearGradient
          colors={[
            'transparent',
            // 'rgba(192, 192, 192, 0.07)',
            // 'rgba(192, 192, 192, 0.07)',
            // 'rgba(192, 192, 192, 0.07)',
            'transparent',
          ]}
          style={[StyleSheet.absoluteFill, { top: '18%', bottom: '18%' }]}
          start={{ x: 0.12, y: 0.5 }}
          end={{ x: 0.88, y: 0.5 }}
        />

        {/* G6: Vignette de profundidade inferior
            Parte inferior mais densa â€” reforÃ§a espessura do material */}
        <LinearGradient
          colors={[
            'transparent',
            'transparent',
            'rgba(0, 0, 0, 0.04)',
            'rgba(0, 0, 0, 0.11)',
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.45 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* G7: Tint vermelho sutil â€” identidade da marca no material */}
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

        {/* G8: Shimmer diagonal
            Faixa de luz percorrendo o card â€” reflexo de luz ambiente */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top:      -60,
            bottom:   -60,
            width:    SCREEN_WIDTH * 0.28,
            transform: [
              { translateX: shimmerX },
              { skewX: '-18deg' },
            ],
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.03)',
              'rgba(255, 255, 255, 0.11)',
              'rgba(255, 255, 255, 0.18)',
              'rgba(255, 255, 255, 0.11)',
              'rgba(255, 255, 255, 0.03)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>

        {/* G9: glowOverlay vermelho â€” preservado do original */}
        <View style={styles.glowOverlay} />

        {/* â”€â”€ CONTEÃšDO â€” preservado integralmente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

        {/* HEADER */}
        <View style={styles.topRow}>

          {/* Avatar com anel premium e halo de luz */}
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.06)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
          </View>

          <View>
            <Text style={styles.statusTitle}>Status atual:</Text>
            <View style={styles.statusChip}>
              <Text style={styles.statusText}>{statusAssinatura}</Text>
            </View>
          </View>
        </View>

        {/* TEXTO ANIMADO â€” states e lÃ³gica 100% intactos */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{displayedText[0]}</Text>

          <Text style={[styles.text, styles.name]}>
            {displayedText[1]}
          </Text>

          <Text style={styles.text}>{displayedText[2]}</Text>
        </View>

        {/* AÃ‡Ã•ES â€” eventos e estrutura preservados */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <BlurView intensity={30} tint="dark" style={styles.actionBlur}>
              {/* Linha especular interna do botÃ£o */}
              <View style={styles.actionBlurSpecular} />
              <Ionicons name="card-outline" size={16} color="#fff" />
              <Text style={styles.actionText}>Plano</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

      </View>
      {/* â”€â”€ fim wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          CAMADA ESPECULAR â€” fora do overflow:hidden
          Renderizadas sobre o vidro, sem serem recortadas pelo clip.
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* E1: Barra especular superior â€” a "linha diagnÃ³stica" do vidro real */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top:      0,
          left:     '10%',
          right:    '10%',
          height:   1,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.50)',
            'rgba(255,255,255,0.86)',
            'rgba(255,255,255,0.92)',
            'rgba(255,255,255,0.86)',
            'rgba(255,255,255,0.50)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E2: Rim light esquerdo â€” iluminaÃ§Ã£o de estÃºdio lateral */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left:   0,
          top:    '12%',
          width:  1,
          height: '60%',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255,255,255,0.42)',
            'rgba(255,255,255,0.28)',
            'rgba(255,255,255,0.10)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* E3: Franja cromÃ¡tica inferior â€” refraÃ§Ã£o de ondas curtas (tom quente) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom:   0,
          left:     '16%',
          right:    '16%',
          height:   0.75,
          borderRadius: 0.75,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(160, 80, 80, 0.32)',
            'rgba(185, 100, 100, 0.48)',
            'rgba(160, 80, 80, 0.32)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E4: Franja Ã¢mbar â€” borda superior-direita (refraÃ§Ã£o de ondas longas) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top:      0,
          right:    '12%',
          width:    '28%',
          height:   0.75,
          borderRadius: 0.75,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 225, 170, 0.26)',
            'rgba(255, 205, 130, 0.36)',
            'transparent',
          ]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </View>

      {/* E5: Anel externo â€” envelope do vidro (0.75px) */}
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 28,
          borderWidth:  0.75,
          borderColor:  'rgba(255, 255, 255, 0.22)',
        }}
      />

      {/* E6: Anel interno inset â€” espessura do vidro (0.5px, recuado 1.5px)
          Detalhe que separa o premium do comum: as duas superfÃ­cies do material */}
      <View
        pointerEvents="none"
        style={{
          position:     'absolute',
          top:          1.5,
          left:         1.5,
          right:        1.5,
          bottom:       1.5,
          borderRadius: 26.5,
          borderWidth:  0.5,
          borderColor:  'rgba(255, 255, 255, 0.09)',
        }}
      />

    </View>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const styles = StyleSheet.create({

  // Container externo â€” sem overflow:hidden para receber camadas especulares.
  // Sombras movidas para cÃ¡ pois overflow:hidden as anula no iOS.
  outerContainer: {
    marginTop:  50,
    borderRadius: 28,

    // S1: Sombra de levitaÃ§Ã£o â€” grande, difusa
    shadowColor:   '#1a0a0a',
    shadowOpacity: 0.42,
    shadowRadius:  36,
    shadowOffset:  { width: 0, height: 18 },
    elevation:     18,
  },

  // Corpo do vidro â€” overflow:hidden necessÃ¡rio para clicar o shimmer e blurs
  wrapper: {
    padding:         20,
    borderRadius:    28,
    overflow:        'hidden',
    backgroundColor: 'transparent',
  },

  // â”€â”€ ConteÃºdo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   20,
  },

  // Anel premium ao redor do avatar
  avatarRing: {
    width:           54,
    height:          54,
    borderRadius:    27,
    marginRight:     12,
    overflow:        'hidden',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     0.75,
    borderColor:     'rgba(255, 255, 255, 0.28)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  avatar: {
    width:        50,
    height:       50,
    borderRadius: 25,
  },

  statusTitle: {
    color:    '#fff',
    fontSize: 12,
    opacity:  0.55,
    letterSpacing: 0.3,
  },

  // Chip de status â€” refinado visualmente
  statusChip: {
    marginTop:       3,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius:    8,
    alignSelf:       'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth:     0.5,
    borderColor:     'rgba(255,255,255,0.15)',
  },

  statusText: {
    color:      '#fff',
    fontWeight: '600',
    fontSize:   13,
    letterSpacing: 0.2,
  },

  textContainer: {
    // preservado â€” sem alteraÃ§Ãµes
  },

  text: {
    color:      '#fff',
    fontSize:   22,
    fontWeight: '500',
    lineHeight: 28,
  },

  // Nome em vermelho â€” preservado integralmente
  name: {
    color:           '#ff2b2b',
    textShadowColor:  'rgba(255,0,0,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  // glowOverlay vermelho â€” preservado
  glowOverlay: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    bottom:          0,
    borderRadius:    28,
    backgroundColor: 'transparent',
  },

  // BotÃ£o de settings â€” preservado
  editButton: {
    position: 'absolute',
    top:      16,
    right:    16,
    zIndex:   10,
  },

    themeButton: {
      position: 'absolute',
      top: 16,
      right: 62,
      zIndex: 10,
    },

  editBlur: {
    padding:     10,
    borderRadius: 14,
    overflow:     'hidden',
    borderWidth:  0.75,
    borderColor:  'rgba(255,255,255,0.18)',
  },

  // â”€â”€ AÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  actionsContainer: {
    marginTop:  20,
    alignItems: 'flex-start',
  },

  actionButton: {
    alignSelf: 'flex-start',
  },

  actionBlur: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius:    14,
    overflow:        'hidden',
    borderWidth:     0.75,
    borderColor:     'rgba(255,255,255,0.16)',
  },

  // Linha especular interna do botÃ£o â€” aresta de vidro
  actionBlurSpecular: {
    position:        'absolute',
    top:             0,
    left:            '10%',
    right:           '10%',
    height:          0.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius:    0.5,
  },

  actionText: {
    color:      '#fff',
    marginLeft: 6,
    fontSize:   13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

});

