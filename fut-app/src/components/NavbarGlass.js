import React, { useState, useEffect,  useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function NavbarGlass({ navigation }) {
  const [active, setActive] = useState('home');

  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  // ✅ usar useRef (evita recriação)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;


  const translateYAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { name: 'ticket', icon: 'ticket-outline', label: 'Ticket' },
    { name: 'socio', icon: 'people-outline', label: 'Sócio' },
    { name: 'home', icon: 'home', label: 'Home' },
    { name: 'loja', icon: 'cart-outline', label: 'Loja' },
    { name: 'perfil', icon: 'person-outline', label: 'Perfil' },
  ];

  // ✅ largura REAL (pixel)
const tabWidth = containerWidth > 0 ? containerWidth / tabs.length : 0;

 const handlePress = (tab, index) => {
  setActive(tab.name); // 🔥 VOLTA ISSO

  // 💥 MOVE A BOLHA
  Animated.spring(translateX, {
    toValue: index * tabWidth,
    useNativeDriver: true,
  }).start();

  // 🔥 TEXTO SOBE
  translateYAnim.setValue(4);
  Animated.spring(translateYAnim, {
    toValue: 0,
    useNativeDriver: true,
    friction: 5,
  }).start();

  // 🔥 BOUNCE
  scaleAnim.setValue(0.9);
  Animated.spring(scaleAnim, {
    toValue: 1,
    useNativeDriver: true,
    friction: 4,
  }).start();

  if (navigation) {
    navigation.navigate(tab.name);
  }
};



useEffect(() => {
  if (containerWidth > 0) {
    const initialIndex = tabs.findIndex(tab => tab.name === active);
    translateX.setValue(initialIndex * tabWidth);
  }
}, [containerWidth]);



// 💥 POSIÇÃO INICIAL CORRETA
useEffect(() => {
  const loop = Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ])
  );

  loop.start();

  return () => loop.stop();
}, []);






// ✨ GLOW LOOP (separado)
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);



  

return (
  <View style={styles.wrapper}>
    <BlurView
      intensity={25}
      tint="dark"
      style={styles.container}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // ✅ pega largura real
    >

      {/* 💥 DISTORÇÃO FAKE */}
      <View style={styles.distortionLayer}>
        <View style={styles.fakeDistortion} />
      </View>

      {/* ✨ LUZ */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.25)',
          'rgba(255,255,255,0.08)',
          'transparent'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.light}
      />

      {/* 💥 BOLHA CORRIGIDA */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.bubble,
            {
              width: tabWidth * 0.8,
              left: tabWidth * 0.1,
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.35)',
              'rgba(255,255,255,0.15)',
            ]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* 🔥 HIGHLIGHT */}
      <View style={styles.highlight} />

      {tabs.map((tab, index) => {
        const isActive = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handlePress(tab, index)}
            activeOpacity={1}
            style={styles.tab}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                isActive && styles.activeTab,
                isActive && {
                  transform: [{ scale: scaleAnim }],
                  shadowOpacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.6],
                    shadowColor: '#880000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 10,
                  }),
                },
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? '#880000' : 'rgba(255,255,255,0.4)'}
              />

              <Animated.Text
                style={[
                  styles.label,
                  {
                    color: isActive ? '#880000' : 'rgba(255,255,255,0.6)',
                   transform: [
                    {
                      translateY: isActive ? translateYAnim : 4,
                    },

                    ],
                  },
                  isActive && {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ]}
              >
                {tab.label}
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </BlurView>
  </View>
)};


const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },

container: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 30,

  backgroundColor: 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.30)',

  overflow: 'hidden', // MUITO IMPORTANTE pro glass
},

  tab: {
    alignItems: 'center',
    flex: 1,
  },

iconContainer: {
  padding: 6,
  borderRadius: 12,

  shadowColor: '#880000',
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 10,
},

  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    marginTop: 1,
    letterSpacing: 0.2,
  },



highlight: {
  position: 'absolute',
  top: 0,
  left: 20,
  right: 20,
  height: 1.5,
  backgroundColor: 'rgba(255,255,255,0.5)',
  borderRadius: 20,
},


  light: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 30,
},

distortionLayer: {
  ...StyleSheet.absoluteFillObject,
  borderRadius: 30,
  overflow: 'hidden',
},

fakeDistortion: {
  flex: 1,

  // 💥 AQUI QUE MORA O EFEITO
  transform: [
    { scale: 1.2 },
    { translateX: 10 },
    { translateY: -6 },
  ],

  opacity: 0.12,
},


bubble: {
  position: 'absolute',
  top: 6,
  bottom: 6,
  left: 0,
  backgroundColor: 'rgba(255,255,255,0.18)',
  borderRadius: 20,

  // ✨ BORDA DE VIDRO
    borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.4)',
  // ✨ SOMBRA SUAVE
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  shadowOpacity: 0.15,


},

});