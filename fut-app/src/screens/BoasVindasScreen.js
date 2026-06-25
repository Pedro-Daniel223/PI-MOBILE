import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

/* ─── Ember particle component ──────────────────────────── */
function Ember({ delay, startX, duration }) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      y.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.3 + Math.random() * 0.7);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, {
            toValue: -(height * 0.55),
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.9,
              duration: duration * 0.15,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.6,
              delay: duration * 0.25,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.ember,
        {
          left: startX,
          transform: [{ translateY: y }, { scale }],
          opacity,
        },
      ]}
    />
  );
}

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  delay: i * 420,
  startX: 20 + Math.random() * (width - 40),
  duration: 2800 + Math.random() * 2200,
}));

/* ─── Main screen ────────────────────────────────────────── */
export default function BoasVindasScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  /* entrance animations */
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.6)).current;

  /* button press scale */
  const nextScale = useRef(new Animated.Value(1)).current;
  const skipScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(160, [
      Animated.spring(logoAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(titleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(subtitleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(btnAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.55, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pressIn = (anim) =>
    Animated.spring(anim, { toValue: 0.93, useNativeDriver: true }).start();
  const pressOut = (anim) =>
    Animated.spring(anim, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }).start();

  const handleSkip = () =>
    navigation.reset({
      index: 0,
      routes: [
        { name: 'AuthStack', state: { index: 0, routes: [{ name: 'Login' }] } },
      ],
    });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Background ── */}
      <ImageBackground
        source={require('../assets/images/tela1.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* dark gradient overlay */}
      <View style={styles.overlay} />

      {/* ember particles */}
      <View style={styles.embersLayer} pointerEvents="none">
        {EMBERS.map((e) => (
          <Ember key={e.id} {...e} />
        ))}
      </View>

      {/* ── Content ── */}
      <View style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 }]}>

        {/* Skip */}
        <Animated.View style={[styles.skipWrapper, { transform: [{ scale: skipScale }] }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleSkip}
            onPressIn={() => pressIn(skipScale)}
            onPressOut={() => pressOut(skipScale)}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Pular</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

          {/* Dragon glow ring */}
          {/* <Animated.View style={[styles.glowRing, { opacity: glowPulse }]} /> */}

          {/* Logo emblem placeholder — swap for your <Image> */}
        {/* Center block */}
        <View style={styles.centerBlock}>

      

          {/* Title */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            DRAKOS{'\n'}
            <Text style={styles.titleAccent}>CLUB</Text>
          </Animated.Text>

          {/* Decorative rule */}
          <Animated.View style={[styles.rule, { opacity: subtitleAnim }]}>
            <View style={styles.ruleLine} />
            <View style={styles.ruleDiamond} />
            <View style={styles.ruleLine} />
          </Animated.View>

          {/* Subtitle */}
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: subtitleAnim,
                transform: [
                  {
                    translateY: subtitleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            ENTRE NA ARENA
          </Animated.Text>
        </View>

        {/* Bottom CTA */}
        <Animated.View
          style={[
            styles.bottomBlock,
            {
              opacity: btnAnim,
              transform: [
                {
                  translateY: btnAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* page dots */}
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Glassmorphism NEXT button */}
          <Animated.View style={{ transform: [{ scale: nextScale }] }}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => pressIn(nextScale)}
              onPressOut={() => pressOut(nextScale)}
              onPress={() => navigation.navigate('BoasVindas2')}
              style={styles.nextBtn}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.nextBtnAndroidBlur]} />
              )}
              <View style={styles.nextBtnInner}>
                <Text style={styles.nextBtnText}>PRÓXIMO</Text>
                <Ionicons name="chevron-forward" size={20} color="#ff2d2d" style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.legalNote}>Ao continuar você aceita os Termos de Uso</Text>
        </Animated.View>
      </View>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const RED = '#ff2d2d';
const RED_DARK = '#a31010';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  /* overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.62)',
    // simulate vertical gradient: heavier at bottom
    // (LinearGradient from expo-linear-gradient is the ideal swap here)
  },

  embersLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  ember: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: RED,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },

  /* layout */
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },

  /* skip */
  skipWrapper: {
    alignSelf: 'flex-end',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  skipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  /* center block */
  centerBlock: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 0,
  },

  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: RED,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 0,
  },

  logoWrap: {
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragonBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: RED_DARK,
    borderWidth: 2,
    borderColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: RED,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 12,
  },
  dragonGlyph: {
    fontSize: 52,
  },

  title: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 58,
    letterSpacing: 6,
    textShadowColor: 'rgba(255,45,45,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  titleAccent: {
    color: RED,
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 10,
  },

  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
    width: 180,
  },
  ruleLine: {
    flex: 1,
    height: 1,
    backgroundColor: RED,
    opacity: 0.7,
  },
  ruleDiamond: {
    width: 6,
    height: 6,
    backgroundColor: RED,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 5,
    textTransform: 'uppercase',
  },

  /* bottom */
  bottomBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },

  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 24,
    backgroundColor: RED,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },

  nextBtn: {
    width: width * 0.82,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,45,45,0.55)',
    shadowColor: RED,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  nextBtnAndroidBlur: {
    backgroundColor: 'rgba(10,0,0,0.72)',
  },
  nextBtnInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 3.5,
  },

  legalNote: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 11,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});