import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

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
      activeOpacity={0.9}
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
    backgroundColor: '#FFFFFF', // Branco puro como na imagem
    paddingVertical: 18,        // Altura interna
    paddingHorizontal: 80,      // Bem largo para dar o formato da imagem
    borderRadius: 50,           // Bordas totalmente circulares (pílula)
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para dar profundidade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    // Borda muito sutil
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',           // Preto total
    fontSize: 24,               // Tamanho de fonte generoso
    fontWeight: '600',          // Semi-bold/Bold
    letterSpacing: 4,           // Espaçamento largo (chave do design da imagem)
    textAlign: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
});