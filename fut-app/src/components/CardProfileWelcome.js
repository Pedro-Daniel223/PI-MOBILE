import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function CardProfileWelcome() {

  const fullText = [
    'Seja bem-vindo',
    'fernando freitas,',
    'aproveite nosso app'
  ];

  const [displayedText, setDisplayedText] = useState(['', '', '']);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 40;

    const interval = setInterval(() => {
      if (lineIndex < fullText.length) {
        const currentLine = fullText[lineIndex];

        if (charIndex < currentLine.length) {
          setDisplayedText(prev => {
            const newText = [...prev];
            newText[lineIndex] =
              currentLine.substring(0, charIndex + 1);
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

  return (
    <View style={styles.wrapper}>
        <View style={styles.glowOverlay} />
      {/* GLASS */}
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

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

      <View style={styles.border} />

      {/* HEADER */}
      <View style={styles.topRow}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.statusTitle}>Status atual:</Text>
          <Text style={styles.statusText}>Não-sócio</Text>
        </View>
      </View>

      {/* TEXTO ANIMADO */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>{displayedText[0]}</Text>

        <Text style={[styles.text, styles.name]}>
          {displayedText[1]}
        </Text>

        <Text style={styles.text}>{displayedText[2]}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    padding: 20,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginTop: 50, // 👈 ajusta aqui

    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,

            shadowColor: '#ff2b2b',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 0 },
        elevation: 15,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  statusTitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },

  statusText: {
    color: '#fff',
    fontWeight: '600',
  },

  textContainer: {},

  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 28,
  },

  name: {
      color: '#ff2b2b',
  textShadowColor: 'rgba(255,0,0,0.8)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
  },

  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  glowOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: 28,
  backgroundColor: 'rgba(255, 0, 0, 0.06)',
},
});