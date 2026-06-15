import { StyleSheet } from 'react-native';
import { DS } from './rootLoja';
import { scaleFont } from '../../utils/fontScale';

export const topStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.spacing.lg,
    paddingVertical: 12,
    gap: 12,
  },
  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: DS.radius.sm,
    backgroundColor: DS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: scaleFont(18),
    fontWeight: '900',
    color: DS.text,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flex: 1,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: DS.glass,
    borderRadius: DS.radius.md,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
  },
  searchInput: {
    flex: 1,
    color: DS.text,
    fontSize: scaleFont(13),
    fontWeight: '400',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: DS.radius.sm,
    backgroundColor: DS.glass,
    borderWidth: 0.75,
    borderColor: DS.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});