import { StyleSheet } from 'react-native';
import { DS } from './root';
import { SCREEN_HEIGHT } from './dimensoes';

export const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.bg,
    paddingBottom: 100,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGlowRed: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.1,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: DS.accent,
    opacity: 0.04,
    shadowColor: DS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 120,
  },
  bgDots: {
    // Placeholder para textura futura — pode implementar com SVG ou Canvas
    opacity: 0,
  },
  scrollContent: {
    // Sem paddingBottom aqui — tratado com View spacer
  },
});