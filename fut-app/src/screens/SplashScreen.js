import { View, Animated, Image, Text } from "react-native";
import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { stylesSplash } from "../styles/styleSplash/styleSplash";

export default function Splash({ navigation }) {
  const { authenticated } = useAuth();
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
          toValue: -75, // ajustado (menos distância)
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 40, // mais próximo da logo
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
          navigation.replace(authenticated ? "MainTabs" : "BoasVindas");
        }, 800);
      });
    });
  }, []);

  return (
    <View style={stylesSplash.container}>
      <View style={stylesSplash.centerWrap}>
        {/* TEXTO */}
        <Animated.Text
          style={[
            stylesSplash.animatedText,
            {
              opacity: textOpacity,
              transform: [{ translateX: textTranslateX }],
            },
          ]}
        >
          DRAKOS APP
        </Animated.Text>

        {/* LOGO */}
        <Animated.Image
          source={require("../assets/img/Escudo_Drakos.png")}
          style={[
            stylesSplash.logo,
            { opacity, transform: [{ scale }, { translateX: logoTranslateX }] },
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
