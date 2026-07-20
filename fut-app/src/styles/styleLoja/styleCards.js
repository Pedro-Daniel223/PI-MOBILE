// import { StyleSheet } from 'react-native';
// import { DS } from './rootLoja';
// import { scaleFont } from '../../utils/fontScale';

// // Estilos para os cards de produto na Loja do FUT, seguindo a estética cinematográfica escura e moderna definida em DS

// export const cardStyles = StyleSheet.create({
//   wrapper: {
//     marginBottom: 14,
//   },
//   card: {
//     borderRadius: DS.radius.lg,
//     backgroundColor: DS.bgElevated,
//     overflow: 'hidden',
//   },
//   borderLayer: {
//     ...StyleSheet.absoluteFillObject,
//     borderRadius: DS.radius.lg,
//     borderWidth: 0.75,
//     borderColor: DS.glassBorder,
//     zIndex: 10,
//   },
//   imageContainer: {
//     flex: 1,
//     backgroundColor: '#111',
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   imageVignette: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//   },
//   badge: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: DS.accent,
//     borderRadius: DS.radius.sm,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   badgeText: {
//     fontSize: scaleFont(9),
//     fontWeight: '800',
//     color: DS.text,
//     letterSpacing: 0.5,
//   },
//   info: {
//     paddingHorizontal: 12,
//     paddingTop: 12,
//     paddingBottom: 14,
//     gap: 4,
//   },
//   categoria: {
//     fontSize: scaleFont(8),
//     fontWeight: '700',
//     color: DS.accent,
//     letterSpacing: 1.8,
//   },
//   nome: {
//     fontSize: scaleFont(12),
//     fontWeight: '700',
//     color: DS.text,
//     lineHeight: scaleFont(16),
//     letterSpacing: 0.1,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     gap: 6,
//     marginTop: 2,
//   },
//   preco: {
//     fontSize: scaleFont(14),
//     fontWeight: '900',
//     color: DS.text,
//     letterSpacing: -0.3,
//   },
//   precoAntigo: {
//     fontSize: scaleFont(10),
//     color: DS.textFaint,
//     textDecorationLine: 'line-through',
//     fontWeight: '400',
//   },
//   accentLine: {
//     position: 'absolute',
//     bottom: 0,
//     left: 20,
//     right: 20,
//     height: 1.5,
//     backgroundColor: DS.accent,
//     opacity: 0.5,
//     borderRadius: 1,
//   },
// });