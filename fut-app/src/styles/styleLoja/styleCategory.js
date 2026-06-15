import { DS } from './rootLoja';
import { StyleSheet } from 'react-native';

export const catStyles = StyleSheet.create({
  strip: { marginTop: 28 },
  stripContent: {
    paddingHorizontal: DS.spacing.lg,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: DS.radius.xl,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
    backgroundColor: DS.glass,
    overflow: 'hidden',
  },
  pillActive: {
    borderColor: DS.accent,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: DS.textDim,
  },
  pillTextActive: {
    color: DS.text,
    fontWeight: '700',
  },
});