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

const RED = '#ff2d2d';
const RED_DARK = '#a31010';

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
            toValue: -(height * 0.5),
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

/* ─── Animated feature pill ─────────────────────────────── */
function FeaturePill({ icon, label, delay }) {
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
        styles.pill,
        {
          opacity: anim,
          transform: [
            { scale: anim },
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] }) },
          ],
        },
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.pillAndroid]} />
      )}
      <Ionicons name={icon} size={16} color={RED} style={{ marginRight: 7 }} />
      <Text style={styles.pillText}>{label}</Text>
    </Animated.View>
  );
}

/* ─── Main screen ────────────────────────────────────────── */
export default function BoasVindas2Screen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();

  /* entrance animations */
  const taglineAnim  = useRef(new Animated.Value(0)).current;
  const titleAnim    = useRef(new Animated.Value(0)).current;
  const pillsAnim    = useRef(new Animated.Value(0)).current;
  const btnAnim      = useRef(new Animated.Value(0)).current;
  const accentPulse  = useRef(new Animated.Value(0.5)).current;

  /* button press scales */
  const nextScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.spring(taglineAnim,  { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
      Animated.spring(titleAnim,    { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
      Animated.spring(pillsAnim,    { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
      Animated.spring(btnAnim,      { toValue: 1, tension: 58, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(accentPulse, { toValue: 1,   duration: 1800, useNativeDriver: true }),
        Animated.timing(accentPulse, { toValue: 0.5, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pressIn  = (a) => Animated.spring(a, { toValue: 0.93, useNativeDriver: true }).start();
  const pressOut = (a) => Animated.spring(a, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }).start();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* background */}
      <ImageBackground
        source={require('../assets/images/bemvindo2.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* dark overlay */}
      <View style={styles.overlay} />

      {/* ember particles */}
      <View style={styles.embersLayer} pointerEvents="none">
        {EMBERS.map((e) => <Ember key={e.id} {...e} />)}
      </View>

      {/* content */}
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
        ]}
      >
        {/* ── top spacer (no skip on this screen — matches original) ── */}
        <View />

        {/* ── center is blank — hero image is in background ── */}
        <View style={styles.centerSpacer} />

        {/* ── bottom content block ── */}
        <View style={styles.bottomBlock}>

          {/* overline tag */}
          <Animated.View
            style={[
              styles.overlineWrap,
              {
                opacity: taglineAnim,
                transform: [
                  { translateY: taglineAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
                ],
              },
            ]}
          >
            <View style={styles.overlineDot} />
            <Text style={styles.overlineText}>LOJA OFICIAL</Text>
            <View style={styles.overlineDot} />
          </Animated.View>

          {/* main title */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleAnim,
                transform: [
                  { translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
                ],
              },
            ]}
          >
            Realize compras de{' '}
            <Text style={styles.titleAccent}>produtos{'\n'}oficiais</Text>
            {' '}do clube!
          </Animated.Text>

          {/* feature pills */}
          <Animated.View
            style={[
              styles.pillsRow,
              {
                opacity: pillsAnim,
                transform: [
                  { translateY: pillsAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
                ],
              },
            ]}
          >
            <FeaturePill icon="shirt-outline"   label="Camisas"    delay={0}   />
            <FeaturePill icon="star-outline"    label="Exclusivos"  delay={80}  />
            <FeaturePill icon="flash-outline"   label="Promoções"  delay={160} />
          </Animated.View>

          {/* divider rule */}
          <Animated.View style={[styles.rule, { opacity: pillsAnim }]}>
            <View style={styles.ruleLine} />
            <Animated.View style={[styles.ruleDiamond, { opacity: accentPulse }]} />
            <View style={styles.ruleLine} />
          </Animated.View>

          {/* page dots */}
          <View style={styles.dots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          {/* CTA button */}
          <Animated.View
            style={[
              styles.btnWrap,
              {
                opacity: btnAnim,
                transform: [
                  { translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
                  { scale: nextScale },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => pressIn(nextScale)}
              onPressOut={() => pressOut(nextScale)}
              onPress={() => navigation.navigate('BoasVindas3')}
              style={styles.nextBtn}
            >
              {Platform.OS === 'ios' ? (
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.nextBtnAndroid]} />
              )}
              <View style={styles.nextBtnInner}>
                <Text style={styles.nextBtnText}>PRÓXIMO</Text>
                <Ionicons name="chevron-forward" size={20} color={RED} style={{ marginLeft: 6 }} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.legalNote}>Produtos oficialmente licenciados</Text>
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
    backgroundColor: 'rgba(0,0,0,0.58)',
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
    flex:            1,
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: 24,
  },

  centerSpacer: {
    flex: 1,
  },

  bottomBlock: {
    width:       '100%',
    alignItems:  'center',
    gap:         14,
  },

  /* overline */
  overlineWrap: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            10,
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
    color:       'rgba(255,255,255,0.55)',
    fontSize:    11,
    fontWeight:  '700',
    letterSpacing: 4,
  },

  /* title */
  title: {
    fontFamily:    Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    fontSize:      28,
    fontWeight:    '800',
    color:         '#ffffff',
    textAlign:     'center',
    lineHeight:    38,
    letterSpacing: 0.4,
    textShadowColor:  'rgba(255,45,45,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  titleAccent: {
    color:      RED,
    fontWeight: '900',
  },

  /* pills */
  pillsRow: {
    flexDirection:  'row',
    gap:            10,
    flexWrap:       'wrap',
    justifyContent: 'center',
  },
  pill: {
    flexDirection:  'row',
    alignItems:     'center',
    overflow:       'hidden',
    borderRadius:   20,
    borderWidth:    1,
    borderColor:    'rgba(255,45,45,0.4)',
    paddingHorizontal: 14,
    paddingVertical:    8,
    shadowColor:    RED,
    shadowOffset:   { width: 0, height: 0 },
    shadowOpacity:  0.3,
    shadowRadius:   8,
    elevation:      4,
  },
  pillAndroid: {
    backgroundColor: 'rgba(12,0,0,0.78)',
  },
  pillText: {
    color:        '#fff',
    fontSize:     12,
    fontWeight:   '700',
    letterSpacing: 1,
  },

  /* rule */
  rule: {
    flexDirection:  'row',
    alignItems:     'center',
    width:          160,
  },
  ruleLine: {
    flex:            1,
    height:          1,
    backgroundColor: RED,
    opacity:         0.6,
  },
  ruleDiamond: {
    width:           6,
    height:          6,
    backgroundColor: RED,
    transform:       [{ rotate: '45deg' }],
    marginHorizontal: 8,
    shadowColor:     RED,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   1,
    shadowRadius:    6,
  },

  /* page dots */
  dots: {
    flexDirection: 'row',
    gap:           8,
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
    width: '100%',
    alignItems: 'center',
  },
  nextBtn: {
    width:        width * 0.82,
    height:       58,
    borderRadius: 29,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  'rgba(255,45,45,0.55)',
    shadowColor:  RED,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation:    10,
  },
  nextBtnAndroid: {
    backgroundColor: 'rgba(10,0,0,0.72)',
  },
  nextBtnInner: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 24,
  },
  nextBtnText: {
    color:         '#fff',
    fontSize:      16,
    fontWeight:    '800',
    letterSpacing: 3.5,
  },

  legalNote: {
    color:         'rgba(255,255,255,0.28)',
    fontSize:      11,
    letterSpacing: 0.3,
    textAlign:     'center',
  },
});
