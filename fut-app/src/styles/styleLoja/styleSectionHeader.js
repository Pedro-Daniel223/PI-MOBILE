import { StyleSheet } from 'react-native';
import { DS } from './rootLoja';
import { scaleFont } from '../../utils/fontScale';

export const secStyles = StyleSheet.create({
  container: {
    paddingHorizontal: DS.spacing.lg,
    marginTop: 32,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  tagLine: {
    width: 18,
    height: 2,
    backgroundColor: DS.accent,
    borderRadius: 1,
  },
  tag: {
    fontSize: scaleFont(9),
    fontWeight: '700',
    color: DS.accent,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.8,
    lineHeight: scaleFont(30),
  },
  subtitle: {
    fontSize: scaleFont(12),
    color: DS.textFaint,
    fontWeight: '400',
    marginTop: 6,
    letterSpacing: 0.2,
  },
});