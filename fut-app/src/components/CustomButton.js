import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

// Componente de botão reutilizável que suporta ícone/imagem à direita ou esquerda
export default function CustomButton({title,onPress,style,textStyle,icon, iconPosition = 'right',disabled = false,}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
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
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    width: '100%',
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
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
    tintColor: '#333',
  },
});

// Versão anterior sem suporte a ícones
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// // Componente de botão reutilizável
// export default function CustomButton({ title, onPress }) {
//   return (

//     // TouchableOpacity = botão clicável com efeito de opacidade
//     <TouchableOpacity style={styles.button} onPress={onPress}>

//       {/* Texto do botão */}
//       <Text style={styles.text}>
//         {title}
//       </Text>

//     </TouchableOpacity>
//   );
// }
// // Estilos
// const styles = StyleSheet.create({

//   button: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },

//   text: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });