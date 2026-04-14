import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function CardActionGlass({
  icon,
  title,
  desc,
  onPress,
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.wrapper}>

        {/* BLUR */}
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

        {/* REFRAÇÃO */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.01)',
            'transparent',
          ]}
          style={StyleSheet.absoluteFill}
        />

        {/* PROFUNDIDADE */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)']}
          style={StyleSheet.absoluteFill}
        />

        {/* HIGHLIGHT */}
        <View style={styles.highlight} />

        {/* BORDA */}
        <View style={styles.border} />

        {/* CONTEÚDO */}
        <View style={styles.content}>

          <Ionicons name={icon} size={26} color="#fff" />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>

          <View style={styles.button}>
            <Text style={styles.buttonText}>VER</Text>
          </View>

        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',

    shadowColor: '#ff2b2b',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  content: {
    padding: 18,
  },

  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },

  desc: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
  },

  button: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});