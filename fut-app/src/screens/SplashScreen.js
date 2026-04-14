import { View, Animated, Image, Text } from 'react-native';
import { useEffect, useRef } from 'react';

export default function Splash({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  const logoTranslateX = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1️⃣ Logo aparece no centro
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {

      // 2️⃣ Movimento sincronizado
      Animated.parallel([
        Animated.timing(logoTranslateX, {
          toValue: -75, // 👈 ajustado (menos distância)
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 40, // 👈 mais próximo da logo
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          navigation.replace('Home');
        }, 800);
      });

    });
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#6f0f0f',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

        <View style={{
          position: 'absolute',
          width: 300, // 👈 ESSENCIAL
          justifyContent: 'center',
          alignItems: 'center'
        }}> 

        {/* TEXTO */}
        <Animated.Text
          style={{
            position: 'absolute',
            left: 100,
            color: '#fff',
            fontSize: 22, // 👈 levemente menor pra caber melhor
            fontWeight: 'bold',
            // letterSpacing: 1,

            opacity: textOpacity,
            transform: [{ translateX: textTranslateX }]
          }}
        >
          DRAKOS APP
        </Animated.Text>

        {/* LOGO */}
        <Animated.Image
          source={require('../assets/img/Escudo_Drakos.png')}
          style={{
            width: 120,
            height: 120,
            opacity,
            transform: [
              { scale },
              { translateX: logoTranslateX }
            ]
          }}
          resizeMode="contain"
        />

      </View>
    </View>
  );
}