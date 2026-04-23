import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width - 40;

export default function GlassCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  
    // const img1 = require('.../assets/img/card_branco.png');
    // const img2 = require('.../assets/img/card_branco.png');
    // const img3 = require('.../assets/img/card_branco.png');


const data = [
  {
    teamA: 'Drakos',
    teamB: 'Vasco',
    logoA: require('../../assets/img/img_home/img_jogos/Drakos HD.png'),
    logoB: require('../../assets/img/img_home/img_jogos/Vasco da Gama HD.png'),
    date: '27/09/2026',
    home: true, // ou false (fora)
  },
  {
    teamA: 'Drakos',
    teamB: 'Corinthians',
    logoA: require('../../assets/img/img_home/img_jogos/Drakos HD.png'),
    logoB: require('../../assets/img/img_home/img_jogos/Corinthians HD.png'),
    date: '02/10/2026',
    home: false,
  },
  {
    teamA: 'Drakos',
    teamB: 'Bahia',
    logoA: require('../../assets/img/img_home/img_jogos/Drakos HD.png'),
    logoB: require('../../assets/img/img_home/img_jogos/Bahia HD.png'),
    date: '10/10/2026',
    home: true,
  },
];



  const handleScroll = (e) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / CARD_WIDTH
    );
    setActiveIndex(index);
  };


const scrollRef = useRef(null);
useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex((prev) => {
      let nextIndex = prev + 1;

      if (nextIndex >= data.length) {
        nextIndex = 0;
      }

      scrollRef.current?.scrollTo({
        x: nextIndex * CARD_WIDTH,
        animated: true,
      });

      return nextIndex;
    });
  }, 3000);

  return () => clearInterval(interval);
}, []);


    


return (
  <View style={{ marginTop: 10 }}>

    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      onMomentumScrollEnd={handleScroll}
    >
      {data.map((item, index) => (
        <View key={index} style={{ width: CARD_WIDTH }}>

          <View style={styles.wrapper}>

            <BlurView
              intensity={90}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />

            <LinearGradient
              colors={[
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0.01)',
                'transparent',
              ]}
              style={StyleSheet.absoluteFill}
            />

            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.highlight} />
            <View style={styles.border} />

            {/* CONTEÚDO */}
            <View style={styles.content}>

              {/* ESQUERDA */}
              <View style={{ flex: 1 }}>
                <Text style={styles.smallTitle}>próximos jogos</Text>

                <Text style={styles.dateLabel}>Data:</Text>
                <Text style={styles.date}>{item.date}</Text>

                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>VER</Text>
                </TouchableOpacity>
              </View>

              {/* DIREITA */}
              <View style={styles.matchContainer}>

                <View style={styles.team}>
                  <Image source={item.logoA} style={styles.logo} />
                  <Text style={styles.teamName}>{item.teamA}</Text>
                </View>

                <Text style={styles.vs}>X</Text>

                <View style={styles.team}>
                  <Image source={item.logoB} style={styles.logo} />
                  <Text style={styles.teamName}>{item.teamB}</Text>
                </View>

              </View>

            </View>

          </View>

        </View>
      ))}
    </Animated.ScrollView>

    {/* INDICADORES */}
    <View style={styles.dots}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            activeIndex === index && styles.dotActive,
          ]}
        />
      ))}
    </View>

  </View>
);
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',

    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },

  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  desc: {
    color: '#fff',
    opacity: 0.7,
    marginTop: 5,
  },

  button: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
  },

  image: {
    width: 100,
    height: 70,
    marginLeft: 10,
    resizeMode: 'contain',
    opacity: 0.8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  dotActive: {
    backgroundColor: '#fff',
  },


  smallTitle: {
  color: '#fff',
  fontSize: 14,
  letterSpacing: 2,
  opacity: 0.7,
},

dateLabel: {
  color: '#fff',
  marginTop: 10,
  opacity: 0.6,
},

date: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  marginTop: 2,
},

matchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

team: {
  alignItems: 'center',
},

logo: {
  width: 45,
  height: 45,
  resizeMode: 'contain',
},

teamName: {
  color: '#fff',
  fontSize: 12,
  marginTop: 4,
},

vs: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '700',
  opacity: 0.7,
},
});