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
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const RED    = '#ff2d2d';
const ORANGE = '#ff6a1a';

/* ─── Ember particle ─────────────────────────────────────── */
function Ember({ delay, startX, duration }) {
  const y       = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = () => {
      y.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.3 + Math.random() * 0.7);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, {
            toValue:  -(height * 0.5),
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.85, duration: duration * 0.15, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0,    duration: duration * 0.6,  delay: duration * 0.25, useNativeDriver: true }),
          ]),
        ]),
      ]).start(loop);
    };
    loop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.ember,
        { left: startX, transform: [{ translateY: y }, { scale }], opacity },
      ]}
    />
  );
}

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  id:       i,
  delay:    i * 380,
  startX:   20 + Math.random() * (width - 40),
  duration: 2600 + Math.random() * 2400,
}));

const ONBOARDING_KEY = 'onboarding_seen';

/* ─── Animated security feature row ────────────────────── */
function FeatureRow({ icon, label, delay }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue:  1,
      tension:  55,
      friction: 9,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureRow,
        {
          opacity: anim,
          transform: [
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) },
          ],
        },
      ]}
    >
      <View style={styles.featureIconWrap}>
        <Ionicons name={icon} size={18} color={RED} />
      </View>
      <Text style={styles.featureLabel}>{label}</Text>
    </Animated.View>
  );
}

/* ─── Main screen ────────────────────────────────────────── */
export default function BoasVindas3Screen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();

  /* entrance animations */
  const overlineAnim = useRef(new Animated.Value(0)).current;
  const titleAnim    = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const btnAnim      = useRef(new Animated.Value(0)).current;
  const accentPulse  = useRef(new Animated.Value(0.5)).current;
  const btnGlow      = useRef(new Animated.Value(0.55)).current;

  /* press scale */
  const startScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.spring(overlineAnim, { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
      Animated.spring(titleAnim,    { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
      Animated.spring(featuresAnim, { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
      Animated.spring(btnAnim,      { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(accentPulse, { toValue: 1,   duration: 1800, useNativeDriver: true }),
        Animated.timing(accentPulse, { toValue: 0.5, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(btnGlow, { toValue: 0.85, duration: 1400, useNativeDriver: true }),
        Animated.timing(btnGlow, { toValue: 0.45, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pressIn  = (a) => Animated.spring(a, { toValue: 0.93, useNativeDriver: true }).start();
  const pressOut = (a) => Animated.spring(a, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }).start();

  const handleStart = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
    } catch {
      // Se o armazenamento falhar, seguimos o fluxo para não travar o usuário.
    }

    navigation.reset({
      index: 0,
      routes: [
        { name: 'AuthStack', state: { index: 0, routes: [{ name: 'Login' }] } },
      ],
    });
  };

  return (
  <View style={styles.root}>
    <StatusBar
      barStyle="light-content"
      translucent
      backgroundColor="transparent"
    />

    {/* background */}
    <ImageBackground
      source={require("../assets/images/bemvindo3.png")}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    />

    {/* dark overlay */}
    <View style={styles.overlay} />

    {/* embers */}
    <View style={styles.embersLayer} pointerEvents="none">
      {EMBERS.map((e) => (
        <Ember key={e.id} {...e} />
      ))}
    </View>

    {/* CONTENT */}
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 28,
        },
      ]}
    >

      {/* HERO */}
      <View style={styles.heroContent}>

        <Animated.View
          style={[
            styles.overlineWrap,
            {
              opacity: overlineAnim,
              transform: [
                {
                  translateY: overlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.overlineDot} />
          <Text style={styles.overlineText}>
            INGRESSOS DIGITAIS
          </Text>
          <View style={styles.overlineDot} />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Sistema de compra de ingresso para{" "}
          <Text style={styles.titleAccent}>
            estádio,{"\n"}objetiva e segura
          </Text>
        </Animated.Text>

        <Animated.View
          style={[
            styles.featuresBlock,
            {
              opacity: featuresAnim,
              transform: [
                {
                  translateY: featuresAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <FeatureRow
            icon="qr-code-outline"
            label="QR Code exclusivo por ingresso"
            delay={0}
          />

          <FeatureRow
            icon="shield-checkmark-outline"
            label="Pagamento 100% seguro"
            delay={90}
          />

          <FeatureRow
            icon="flash-outline"
            label="Acesso instantâneo ao estádio"
            delay={180}
          />
        </Animated.View>

      </View>

      {/* BOTTOM FIXO */}
      <View style={styles.bottomBlock}>

        <Animated.View
          style={[
            styles.rule,
            {
              opacity: featuresAnim,
            },
          ]}
        >
          <View style={styles.ruleLine} />
          <Animated.View
            style={[
              styles.ruleDiamond,
              {
                opacity: accentPulse,
              },
            ]}
          />
          <View style={styles.ruleLine} />
        </Animated.View>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <Animated.View
          style={[
            styles.btnWrap,
            {
              opacity: btnAnim,
              transform: [
                {
                  translateY: btnAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
                {
                  scale: startScale,
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.btnGlowRing,
              {
                opacity: btnGlow,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => pressIn(startScale)}
            onPressOut={() => pressOut(startScale)}
            onPress={handleStart}
            style={styles.startBtn}
          >
            {Platform.OS === "ios" ? (
              <BlurView
                intensity={30}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.startBtnAndroid,
                ]}
              />
            )}

            <View style={styles.startBtnInner}>
              <Ionicons
                name="football-outline"
                size={20}
                color={RED}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.startBtnText}>
                COMEÇAR
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.legalNote}>
          Bem-vindo ao Drakos Club — a arena é sua
        </Text>

      </View>

    </View>
  </View>
);
}

/* ─── Styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },

  embersLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  ember: {
    position:        'absolute',
    bottom:          0,
    width:           4,
    height:          4,
    borderRadius:    2,
    backgroundColor: RED,
    shadowColor:     RED,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    6,
  },

  container: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 24,
  },

  centerSpacer: { flex: 1 },

  bottomBlock: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 8,
      gap: 14,
  },


  /* overline */
    overlineWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 18,
    },
  overlineDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: RED,
    shadowColor:     RED,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    5,
  },
  overlineText: {
    color:         'rgba(255,255,255,0.55)',
    fontSize:      11,
    fontWeight:    '700',
    letterSpacing: 4,
  },

  /* title */
  title: {
    fontFamily:       Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    fontSize:         26,
    fontWeight:       '800',
    color:            '#ffffff',
    textAlign: 'center',
    justifyContent:    'center',
    lineHeight:       36,
    letterSpacing:    0.3,
    textShadowColor:  'rgba(255,45,45,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  titleAccent: {
    color:      RED,
    fontWeight: '900',
  },

  /* feature rows */
  featuresBlock: {
      width: '100%',
      justifyContent: 'center',
      gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
  },
  featureIconWrap: {
    width:           34,
    height:          34,
    borderRadius:    17,
    borderWidth:     1,
    borderColor:     'rgba(255,45,45,0.45)',
    backgroundColor: 'rgba(255,45,45,0.12)',
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     RED,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.4,
    shadowRadius:    6,
  },
  featureLabel: {
    color:         'rgba(255,255,255,0.82)',
    fontSize:      13,
    fontWeight:    '600',
    letterSpacing: 0.3,
  },

  /* rule */
  rule: {
    flexDirection: 'row',
    alignItems:    'center',
    width:         160,
  },
  ruleLine: {
    flex:            1,
    height:          1,
    backgroundColor: RED,
    opacity:         0.6,
  },
  ruleDiamond: {
    width:            6,
    height:           6,
    backgroundColor:  RED,
    transform:        [{ rotate: '45deg' }],
    marginHorizontal: 8,
    shadowColor:      RED,
    shadowOffset:     { width: 0, height: 0 },
    shadowOpacity:    1,
    shadowRadius:     6,
  },

  /* page dots */
  dots: {
    flexDirection: 'row',
    gap:           10,
    justifyContent: 'center',
  },
  dot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width:           24,
    backgroundColor: RED,
    shadowColor:     RED,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.9,
    shadowRadius:    6,
  },

  /* CTA button */
  btnWrap: {
    width:      '100%',
    alignItems: 'center',
  },
  btnGlowRing: {
    position:     'absolute',
    width:         width * 0.82 + 16,
    height:        58 + 16,
    borderRadius:  37,
    borderWidth:   1,

    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius:  18,
  },
  startBtn: {
    width:        width * 0.82,
    height:       58,
    borderRadius: 29,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  'rgba(199, 0, 0, 0.6)',
    shadowColor:  RED,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation:    12,
  },
  startBtnAndroid: {
    backgroundColor: 'rgba(241, 241, 241, 0.72)',
  },
  startBtnInner: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 24,
  },
  startBtnText: {
    color:         '#fff',
    fontSize:      16,
    fontWeight:    '800',
    letterSpacing: 3.5,
  },


  heroContent: {
    marginTop: 35,
    width: '82%',
    alignItems: 'center',
},


});
