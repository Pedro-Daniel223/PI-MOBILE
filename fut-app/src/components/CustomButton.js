import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

// Componente de botão reutilizável que suporta ícone/imagem à direita ou esquerda
export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconPosition = 'right',
  disabled = false,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      <View style={styles.content}>
        {icon && iconPosition === 'left' && (
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        )}

        <Text style={[styles.text, textStyle]}>{title}</Text>

        {icon && iconPosition === 'right' && (
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#111',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
    tintColor: '#333',
  },
});