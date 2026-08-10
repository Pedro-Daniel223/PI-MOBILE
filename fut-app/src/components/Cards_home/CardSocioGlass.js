/**
 * CardSocioGlass â€” Premium Liquid Glass Neutral Edition
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * LÃ³gica original 100% preservada:
 *   â€“ Props: onPress, flatLeft, flatRight, style
 *   â€“ floatAnim  (flutuaÃ§Ã£o da imagem, loop 2000ms, 0 â†’ -5 â†’ 0)
 *   â€“ pressAnim  (scale spring, 1 â†’ 0.96 â†’ 1)
 *   â€“ handlePressIn / handlePressOut
 *   â€“ useEffect do loop flutuante
 *   â€“ Imagem local: require('../../assets/img/card_branco.png')
 *   â€“ Ãcone: "people-outline"
 *   â€“ Textos: "Seja SÃ³cio" / "Tenha benefÃ­cios exclusivos"
 *   â€“ flatLeftBorderFix / flatRightBorderFix mantidos
 *
 * Arquitetura de camadas â€” Liquid Glass Neutro (baixo â†’ cima):
 *
 *  [Animated.View â€” outerContainer]
 *   Recebe: scale transform, flatLeft/flatRight, shadows premium
 *   Sem overflow:hidden â†’ sombras renderizam corretamente no iOS.
 *
 *   [View â€” glassBody]  â† overflow:hidden (clip de blur + shimmer)
 *    G1. BlurView primÃ¡rio    (tint="light", intensity 52)
 *    G2. BlurView secundÃ¡rio  (tint="light", intensity 14, opacity 0.42)
 *    G3. Tom base do vidro    (branco frio, opacidade mÃ­nima)
 *    G4. Reflexo ambiental    (superior-esquerdo, estÃºdio de luz)
 *    G5. Volume central       (curvatura 3D ilusÃ³ria)
 *    G6. Vignette inferior    (levÃ­ssima, espessura do material)
 *    G7. Shimmer diagonal     (Animated, varredura periÃ³dica)
 *    G8. ConteÃºdo original    (icon, image, title, desc, button)
 *
 *  [Camada Especular â€” fora do overflow:hidden]
 *   E1. Barra especular superior  (1px, gradiente branco)
 *   E2. Rim light esquerdo        (1px vertical, ocultado com flatLeft)
 *   E3. Franja cromÃ¡tica inferior (0.75px, azul-Ã­ndigo sutil)
 *   E4. Franja Ã¢mbar superior-dir (0.75px, ocultada com flatRight)
 *   E5. Anel externo              (0.75px branco, adapta flat edges)
 *   E6. Anel interno inset        (0.5px branco recuado, espessura do vidro)
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../contexts/SubscriptionContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { Value, timing, loop, sequence, delay } = Animated;

export default function CardSocioGlass({ onPress, flatLeft, flatRight, style }) {

  // â”€â”€ LÃ³gica original â€” intacta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const { subscription } = useSubscription();
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  console.log('[CardSocioGlass] render', {
    render: renderCountRef.current,
    hasSubscription: Boolean(subscription),
    subscriptionTitle: subscription?.title || subscription?.nome_plano || subscription?.plan?.title || null,
  });
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const planoAtivo = subscription?.title
    || subscription?.nome_plano
    || subscription?.plan?.title
    || null;
  const isSocio = Boolean(planoAtivo);
  const socioCardTitle = isSocio ? 'Plano ativo' : 'Seja Sócio';
  const socioCardDesc = isSocio
    ? `${planoAtivo}\nSua assinatura está ativa.`
    : 'Tenha benefícios exclusivos';

  // ðŸ”¥ animaÃ§Ã£o flutuante
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ðŸ”¥ animaÃ§Ã£o toque
  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // â”€â”€ fim lÃ³gica original â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // â”€â”€ Shimmer (visual only â€” nÃ£o altera nenhuma lÃ³gica existente) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const shimmerAnim = useRef(new Value(0)).current;

  useEffect(() => {
    const anim = loop(
      sequence([
        delay(3800),
        timing(shimmerAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        timing(shimmerAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const shimmerX = shimmerAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [-(SCREEN_WIDTH * 1.2), SCREEN_WIDTH * 1.2],
  });
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >

      {/*
        outerContainer â€” Animated.View
        Recebe scale transform e flat-edge styles.
        Sem overflow:hidden â†’ sombras iOS funcionam + camadas especulares visÃ­veis.
      */}
      <Animated.View
        style={[
          styles.outerContainer,
          flatLeft  && styles.flatLeft,
          flatRight && styles.flatRight,
          { transform: [{ scale: pressAnim }] },
        ]}
      >

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            CORPO DE VIDRO â€” overflow:hidden
            Clip necessÃ¡rio para conter BlurViews e varredura de shimmer.
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <View
          style={[
            styles.glassBody,
            flatLeft  && styles.flatLeft,
            flatRight && styles.flatRight,
          ]}
        >

          {/* G1: BlurView primário — translúcido neutro.
              Android: fallback de BlurView desenha backgroundColor sólido
              (sem compositor de blur real). Empilhar dois BlurViews aqui
              somava duas camadas opacas e gerava o "quadrado" visível
              atrás do card. Mantemos só 1 blur real no Android. */}
          <BlurView
            intensity={Platform.OS === 'android' ? 45 : 50}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />

          {/* G2: BlurView secundário — profundidade, mínimo.
              No Android substituído por gradiente translúcido puro
              (não é outro blur), preservando a leitura de profundidade
              sem duplicar a camada de fallback opaca. */}
          {Platform.OS === 'android' ? (
            <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          ) : (
            <BlurView
              intensity={0}
              tint="dark"
              style={[StyleSheet.absoluteFill, { opacity: 0.42 }]}
            />
          )}

          {/* G3: Tom base do vidro â€” branco-frio, opacidade mÃ­nima
              Neutro puro: sem amarelos, vermelhos ou acinzentados pesados.
              O fundo fica visÃ­vel atravÃ©s do blur. */}
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.06)',
              'rgba(255,255,255,0.06)',
              'rgba(255,255,255,0.06)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* G4: Reflexo ambiental superior-esquerdo
              Fonte de luz de estÃºdio â€” efeito visionOS / Apple */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.18)',
              'rgba(255, 255, 255, 0.06)',
              'transparent',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.65, y: 0.55 }}
          />

          {/* G5: Highlight de volume central
              Centro levemente mais luminoso â€” curvatura 3D ilusÃ³ria */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.01)',
              'transparent',
            ]}
            style={[StyleSheet.absoluteFill, { top: '16%', bottom: '16%' }]}
            start={{ x: 0.12, y: 0.5 }}
            end={{ x: 0.88, y: 0.5 }}
          />

          {/* G6: Vignette de profundidade inferior â€” levÃ­ssima
              Densidade mÃ­nima na base; reforÃ§a espessura do material
              sem escurecer nem criar coloraÃ§Ã£o prÃ³pria */}
          <LinearGradient
            colors={[
              'transparent',
              'transparent',
              'rgba(0, 8, 24, 0.016)',
              'rgba(0, 8, 24, 0.038)',
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.44 }}
            end={{ x: 0.5, y: 1.0 }}
          />

          {/* G7: Shimmer diagonal
              Faixa de luz percorrendo o card em diagonal periÃ³dica.
              Simula reflexo de ambiente em movimento sobre vidro real. */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top:    -125,
              bottom: -125,
              width:  SCREEN_WIDTH * 0.30,
              transform: [
                { translateX: shimmerX },
                { skewX: '-18deg' },
              ],
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.04)',
                'rgba(255, 255, 255, 0.14)',
                'rgba(255, 255, 255, 0.22)',
                'rgba(255, 255, 255, 0.14)',
                'rgba(255, 255, 255, 0.04)',
                'transparent',
              ]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>

          {/* â”€â”€ G8: CONTEÃšDO â€” preservado integralmente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <View style={styles.content}>

            {/* ÃCONE â€” preservado */}
            <Ionicons
              name="people-outline"
              size={18}
              color="rgba(255,255,255,0.7)"
              style={{ marginBottom: 6 }}
            />

            {/* IMAGEM â€” floatAnim preservado, source preservado */}
            <Animated.Image
              source={require('../../assets/img/socios/card_branco.png')}
              style={[
                styles.image,
                {
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            />

            {/* TEXTO â€” preservado */}
            <Text style={styles.title}>{socioCardTitle}</Text>
            <Text style={styles.desc}>{socioCardDesc}</Text>

            {/* BOTÃƒO â€” estrutura preservada, acabamento refinado */}
            <View style={styles.button}>
              <BlurView
                intensity={Platform.OS === 'android' ? 55 : 40}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />

              <LinearGradient
                colors={[
                  'transparent',
                  'transparent',
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />

              {/* Linha especular interna â€” aresta superior do botÃ£o */}
              <View style={styles.buttonSpecular} />

              <View style={styles.buttonBorder} />

              <Text style={styles.buttonText}>VER</Text>
            </View>

          </View>
          {/* â”€â”€ fim conteÃºdo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

        </View>
        {/* â”€â”€ fim glassBody â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            CAMADA ESPECULAR â€” fora do overflow:hidden
            Elementos especulares posicionados sobre o vidro, sem clipping.
            Simulam as superfÃ­cies fÃ­sicas reais de um material Ã³ptico.
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

        {/* E1: Barra especular superior â€” a "linha diagnÃ³stica" do vidro real
            Reflexo direto da fonte de luz na aresta superior.
            Presente mesmo em flatLeft/flatRight. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top:   0,
            left:  '10%',
            right: '10%',
            height: 1,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255, 255, 255, 0.55)',
              'rgba(255, 255, 255, 0.90)',
              'rgba(255, 255, 255, 0.95)',
              'rgba(255, 255, 255, 0.90)',
              'rgba(255, 255, 255, 0.55)',
              'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        {/* E2: Rim light esquerdo â€” iluminaÃ§Ã£o de estÃºdio lateral
            Suprimido quando flatLeft estÃ¡ ativo (borda plana sem aresta). */}
        {!flatLeft && (
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
                'rgba(255, 255, 255, 0.50)',
                'rgba(255, 255, 255, 0.34)',
                'rgba(255, 255, 255, 0.12)',
                'transparent',
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </View>
        )}

        {/* E3: Franja cromÃ¡tica inferior â€” refraÃ§Ã£o de ondas curtas
            Azul-Ã­ndigo extremamente sutil na aresta inferior.
            ImperceptÃ­vel na maioria dos Ã¢ngulos; textura de vidro Ã³ptico. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 0,
            left:   '16%',
            right:  '16%',
            height: 0.75,
            borderRadius: 0.75,
            overflow: 'hidden',
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(160, 185, 255, 0.30)',
              'rgba(180, 200, 255, 0.45)',
              'rgba(160, 185, 255, 0.30)',
              'transparent',
            ]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </View>

        {/* E4: Franja Ã¢mbar â€” borda superior-direita (refraÃ§Ã£o de ondas longas)
            Suprimida quando flatRight estÃ¡ ativo. */}
        {!flatRight && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top:   0,
              right: '12%',
              width: '28%',
              height: 0.75,
              borderRadius: 0.75,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255, 230, 180, 0.26)',
                'rgba(255, 210, 140, 0.36)',
                'transparent',
              ]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </View>
        )}

        {/* E5: Anel de borda externo (0.75px)
            Adapta os raios de canto para flatLeft e flatRight. */}
        <View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            borderRadius:             22,
            ...(flatLeft && {
              borderTopLeftRadius:    4,
              borderBottomLeftRadius: 4,
            }),
            ...(flatRight && {
              borderTopRightRadius:    4,
              borderBottomRightRadius: 4,
            }),
            borderWidth: 0.75,
            borderColor: 'rgba(255, 255, 255, 0.52)',
          }}
        />

        {/* E6: Anel interno inset (0.5px, recuado 1.5px)
            Segunda superfÃ­cie do vidro â€” ilusÃ£o de espessura do material.
            Detalhe que separa o premium do comum. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top:    1.5,
            left:   1.5,
            right:  1.5,
            bottom: 1.5,
            borderRadius:             20.5,
            ...(flatLeft && {
              borderTopLeftRadius:    3,
              borderBottomLeftRadius: 3,
            }),
            ...(flatRight && {
              borderTopRightRadius:    3,
              borderBottomRightRadius: 3,
            }),
            borderWidth: 0.5,
            borderColor: 'rgba(255, 255, 255, 0.22)',
          }}
        />

      </Animated.View>
    </TouchableOpacity>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const styles = StyleSheet.create({

  // Container externo de transformação — sem overflow:hidden.
  // Sombras aqui renderizam corretamente no iOS (overflow as cancelaria).
  // Sombra: neutra, soft, premium — sem tonalidades quentes ou avermelhadas.
  // Android: elevation com borderRadius e sem backgroundColor opaco pinta
  // um retângulo sólido atrás do card (bug de composição do Material
  // Design quando a view "dona" do elevation é visualmente transparente).
  // Fix: backgroundColor 'transparent' explícito + elevation reduzida,
  // deixando a sombra suave (shadow*) carregar o efeito de profundidade.
  outerContainer: {
    height:       250,
    borderRadius: 22,
    backgroundColor: 'transparent',
    shadowColor:   '#182040',
    shadowOpacity: 0.15,
    shadowRadius:  28,
    shadowOffset:  { width: 0, height: 14 },
    elevation: Platform.OS === 'android' ? 6 : 12,
  },

  // Corpo do vidro — overflow:hidden para clip do blur e shimmer.
  // Android: fundo levemente mais opaco compensa o blur fraco/fallback,
  // evitando aspecto "cru"/artificial de transparência mal resolvida.
  glassBody: {
    flex:            1,
    borderRadius:    22,
    overflow:        'hidden',
    backgroundColor: Platform.OS === 'android' ? '#151519' : 'rgba(255, 255, 255, 0.02)',
  },

  // â”€â”€ ConteÃºdo â€” preservado â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  content: {
    padding: 20,
    flex:    1,
  },

  image: {
    width:          '80%',
    height:         90,
    resizeMode:     'contain',
    alignSelf:      'center',
    marginVertical: 10,
    opacity:        0.90,
    marginTop:      10,
  },

  title: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '800',
  },

  desc: {
    color:     '#fff',
    fontSize:  11,
    opacity:   0.6,
    marginTop: 3,
  },

  // BotÃ£o glass â€” estrutura preservada
  button: {
    marginTop:      'auto',
    height:         26,
    borderRadius:   14,
    overflow:       'hidden',
    justifyContent: 'center',
    alignItems:     'center',
    width:          '60%',
    alignSelf:      'flex-start',
  },

  // Linha especular interna do botÃ£o â€” aresta superior do vidro
  buttonSpecular: {
    position:        'absolute',
    top:             0,
    left:            '12%',
    right:           '12%',
    height:          0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius:    0.5,
  },

  buttonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth:  0.75,
    borderColor:  'rgba(255, 255, 255, 0.38)',
  },

  buttonText: {
    color:         '#fff',
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 1,
  },

  // Glow style â€” preservado na definiÃ§Ã£o (nÃ£o renderizado, igual ao original)
  glow: {
    position:        'absolute',
    width:           110,
    height:          110,
    borderRadius:    80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    right:           10,
    top:             20,
  },

  // â”€â”€ Flat edge styles â€” preservados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  flatLeft: {
    borderTopLeftRadius:    4,
    borderBottomLeftRadius: 4,
  },

  flatRight: {
    borderTopRightRadius:    4,
    borderBottomRightRadius: 4,
  },

  // Mantidos para compatibilidade retroativa
  flatLeftBorderFix: {
    borderLeftWidth: 0,
  },

  flatRightBorderFix: {
    borderRightWidth: 0,
  },

});