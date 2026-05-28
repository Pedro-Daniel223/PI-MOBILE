import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PanResponder } from 'react-native';


export default function NavbarGlass({ navigation }) {
  const tabs = [
    { name: 'ticket', icon: 'ticket-outline', label: 'Ticket', tela: 'Ingressos' },
    { name: 'socio', icon: 'people-outline', label: 'Sócio', tela: 'Socio' },
    { name: 'home', icon: 'home', label: 'Home', tela: 'Home' },
    { name: 'loja', icon: 'cart-outline', label: 'Loja', tela: 'Loja' },
    { name: 'perfil', icon: 'person-outline', label: 'Perfil', tela: 'Perfil' },
  ];
  
  const dragX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);
  const [active, setActive] = useState('home');
  const [containerWidth, setContainerWidth] = useState(0);
  // --- REFS DE ANIMAÇÃO ---
  const translateX = useRef(new Animated.Value(0)).current;      // Movimento X
  const scaleAnim = useRef(new Animated.Value(1)).current;       // Pulo do ícone
  const glowAnim = useRef(new Animated.Value(0)).current;        // Brilho pulsante
  const translateYAnim = useRef(new Animated.Value(0)).current;  // Texto subindo
  const pressAnim = useRef(new Animated.Value(0)).current;       // Feedback de clique
  // ✅ DEFORMAÇÃO LÍQUIDA
  const stretchAnim = useRef(new Animated.Value(1)).current;     // Estica na corrida (X)
  const bubbleWobble = useRef(new Animated.Value(1)).current;    // Achata no impacto (Y)
  // --- DEFINIÇÃO DAS TABS E LARGURA ---
  // Certifique-se de que o array 'tabs' esteja declarado antes deste cálculo
  const tabWidth = containerWidth > 0 ? containerWidth / tabs.length : 0;
  const bubbleWidth = tabWidth > 0 ? tabWidth * 0.85 : 0;
  // const bubbleOffset = (tabWidth - bubbleWidth) / 2;
  const halfTab = tabWidth / 2;
  const centerX = Animated.add(dragX, halfTab);



const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      // salva posição atual
      lastOffset.current = dragX.__getValue();

      // leve stretch
      Animated.spring(stretchAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();
    },

    onPanResponderMove: (_, gesture) => {
      // 🔥 MOVIMENTO REAL (GRUDADO NO DEDO)
      let newX = lastOffset.current + gesture.dx;

      // 🔒 LIMITES (não sair da navbar)
      const max = (tabs.length - 1) * tabWidth;
      const maxLimit = containerWidth - tabWidth;

      newX = Math.max(0, Math.min(newX, maxLimit));

      dragX.setValue(newX);

      // 💧 stretch proporcional
      const stretch = 1 + Math.min(Math.abs(gesture.dx) / 300, 0.25);
      stretchAnim.setValue(stretch);
    },

    onPanResponderRelease: () => {
      const finalX = dragX.__getValue();

      let newIndex = Math.round(finalX / tabWidth);
      newIndex = Math.max(0, Math.min(tabs.length - 1, newIndex));

      const targetX = newIndex * tabWidth;

      lastOffset.current = targetX;
      setActive(tabs[newIndex].name);

      // 🚀 snap suave estilo iOS
      Animated.spring(dragX, {
        toValue: targetX,
        tension: 120,
        friction: 14,
        useNativeDriver: true,
      }).start(() => {
        // 💥 impacto gelatina PERFEITO
        Animated.sequence([
          Animated.timing(bubbleWobble, {
            toValue: 0.8,
            duration: 70,
            useNativeDriver: true,
          }),
          Animated.spring(bubbleWobble, {
            toValue: 1,
            friction: 3,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start();
      });

      Animated.spring(stretchAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    },
  })
).current;




// const bubbleOffset = (tabWidth - bubbleWidth) / 2;









const handlePress = (tab, index) => {
  setActive(tab.name);

  const targetX = index * tabWidth;

  // 🔥 1. MOVIMENTO + STRETCH (RODAM JUNTOS)
  Animated.parallel([
      Animated.spring(dragX, {
      toValue: targetX,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }),

    Animated.sequence([
      Animated.timing(stretchAnim, {
        toValue: 1.35,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(stretchAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]),

    // ÍCONE
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]),

    // TEXTO
    Animated.sequence([
      Animated.timing(translateYAnim, {
        toValue: 4,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]),
  ]).start(() => {

    // 💥 2. IMPACTO GELATINA (SÓ DEPOIS QUE CHEGA)
    Animated.sequence([
      Animated.timing(bubbleWobble, {
        toValue: 1.2, // achata
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleWobble, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

  });

  navigation.navigate(tab.tela);
};


// 1. Loop de Brilho (Glow) - Mantém o efeito pulsante constante
useEffect(() => {
  const loop = Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ])
  );

  loop.start();
  return () => loop.stop();
}, [glowAnim]); // Adicionada a dependência por boa prática



// 2. Sincronização de Posição - Garante que a bolha esteja no lugar certo
useEffect(() => {
  if (containerWidth > 0) {
    const targetIndex = tabs.findIndex(tab => tab.name === active);

    if (targetIndex !== -1) {
      // Usamos spring aqui para que, se a largura mudar (ex: rotação), 
      // a bolha se ajuste suavemente à nova posição
    Animated.spring(dragX, {
      toValue: targetIndex * tabWidth,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }).start();
    }
  }
}, [containerWidth, active, tabWidth]); // tabWidth incluído para reagir a mudanças de layout


// --- ANIMAÇÕES DE PRESS ---
const scale = pressAnim.interpolate({
  inputRange: [0,1],
  outputRange: [1, 1.05], 
});

const opacity = pressAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [1, 0.9], // Reduzi para 0.9 para o feedback ser mais visível no Blur
});






return (
  <View style={styles.wrapper}>

    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
      onTouchStart={() => {
        Animated.spring(pressAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }}
      onTouchEnd={() => {
        Animated.spring(pressAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // 👈 IMPORTANTE
    >


    
      <BlurView
        intensity={30}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />



      {/* 1. Camada de Distorção */}
            <View style={styles.distortionLayer} pointerEvents="none">
              <View style={styles.fakeDistortion} />
            </View>



      {/* 2. Bolha Líquida Animada */}
            {containerWidth > 0 && (
              <Animated.View
               {...panResponder.panHandlers}
                          style={[
              styles.bubble,
              {
                width: bubbleWidth,
                left: '0%',
                transform: [
                  {
                    translateX: Animated.subtract(centerX, bubbleWidth / 2), // Centraliza a bolha no centro do tab
                  },
                  { scaleX: stretchAnim },
                  { scaleY: bubbleWobble },
                ]
              },
            ]}
        >





    <LinearGradient
      colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
    <View style={styles.bubbleSpecular} />
  </Animated.View>
)}

      {/* 3. Luz */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.12)', 'transparent']}
        style={styles.light}
        pointerEvents="none"
      />



  {/* 4. Mapeamento das Tabs (Ícones e Textos) */}
{/* 4. Mapeamento das Tabs (Ícones e Textos) */}
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
          isActive && {
            // O scaleAnim agora reage ao "impacto" da bolha definido no handlePress
            transform: [{ scale: scaleAnim }],
            
            // Brilho pulsante externo (Glow)
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
            }),
            shadowColor: '#CC0000',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 12,
          },
        ]}
      >
        <Ionicons
          name={tab.icon}
          size={22}
          color={isActive ? '#a40000' : 'rgb(255, 255, 255)'}
        />

        <Animated.Text
          style={[
            styles.label,
            {
              // O texto sobe suavemente quando ativo
              color: isActive ? '#a40000' : 'rgb(255, 255, 255)',
              opacity: isActive ? 1 : 0.7,
              fontWeight: isActive ? '600' : '400',
              transform: [
                { 
                  translateY: isActive 
                    ? translateYAnim 
                    : 6 // Posição de descanso mais baixa para itens inativos
                }
              ],
            },
          ]}
        >
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
})}

      {/* 5. Acabamento Superior (Linha de brilho no topo do vidro) */}
      <View style={styles.highlight} pointerEvents="none" />

    </Animated.View>
  </View>
);
};

        


const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24, // Um pouco mais de margem para o efeito flutuante
    left: 16,
    right: 16,
    // Sombra externa suave para elevar toda a navbar do fundo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderRadius: 35, // Bordas mais curvas reforçam o aspecto "líquido"
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.9,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 10, // Garante que o toque fique acima das camadas de brilho
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 15,
    // O shadowColor aqui será o glow do ícone ativo
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
  },

  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // ✨ O "Glow" no topo do vidro
  highlight: {
    position: 'absolute',
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
  },

  // ✨ Camada de iluminação global
  light: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 35,
  },

// ✨ Camada de Refração (Distorção fake)
  distortionLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    overflow: 'hidden',
  },

  fakeDistortion: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    transform: [
      { scale: 1.4 },
      { translateX: -15 },
      { translateY: 10 },
    ],
  },

  // 💥 A BOLHA LÍQUIDA
  bubble: {
    position: 'absolute',
    top: '15%',
    height: '130%',
    borderRadius: 30,
    backgroundColor: 'rgba(73, 73, 73, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    shadowColor: "#c0c0c0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },

  bubbleSpecular: {
      position: 'absolute',
      top: 2,
      left: '25%',
      width: '30%',
      height: '20%',
      backgroundColor: 'rgba(176, 176, 176, 0.4)',
      borderRadius: 10,
      opacity: 0.4,
    },

});

  
  