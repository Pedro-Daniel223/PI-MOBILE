import { StyleSheet } from 'react-native';
import { DS } from './root';
import { scaleFont } from '../../utils/fontScale';

export const adStyles = StyleSheet.create({
  outer: {
    marginTop: 36,
    marginBottom: 8,
  },
  topLine: {
    height: 0.5,
    backgroundColor: DS.glassBorderSub,
  },
  inner: {
    height: 200,
    marginHorizontal: DS.spacing.lg,
    borderRadius: DS.radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 0.75,
    borderColor: 'rgba(140,0,8,0.3)',
    marginTop: 1,
    marginBottom: 1,
  },
  sideLabel: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.07)',
  },
  sideLabelText: {
    fontSize: scaleFont(7),
    fontWeight: '700',
    color: DS.textFaint,
    letterSpacing: 2,
    transform: [{ rotate: '-90deg' }],
    width: 120,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: 24,
    paddingVertical: 28,
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: scaleFont(8),
    fontWeight: '700',
    color: DS.accent,
    letterSpacing: 2.5,
    marginBottom: 12,
  },
  headline: {
    fontSize: scaleFont(48),
    fontWeight: '900',
    color: DS.text,
    lineHeight: scaleFont(46),
    letterSpacing: -2,
  },
  underline: {
    width: 28,
    height: 2,
    backgroundColor: DS.accent,
    marginVertical: 14,
    borderRadius: 1,
  },
  body: {
    fontSize: scaleFont(12),
    fontWeight: '300',
    color: DS.textDim,
    lineHeight: scaleFont(18),
    letterSpacing: 0.2,
  },
  graphicElement: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 3,
    bottom: 0,
    opacity: 0.6,
  },
  watermark: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    fontSize: scaleFont(160),
    fontWeight: '900',
    color: 'rgba(255,255,255,0.025)',
    lineHeight: scaleFont(150),
    letterSpacing: -6,
  },
  bottomLine: {
    height: 0.5,
    backgroundColor: DS.glassBorderSub,
  },
});