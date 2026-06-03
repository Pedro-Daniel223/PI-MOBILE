import { StyleSheet, Dimensions } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT, HERO_HEIGHT } from './dimensoes';
import { DS } from './root';
import { scaleFont } from '../../utils/fontScale';

export const heroStyles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  slide: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  accentGlow: {
    position: 'absolute',
    top: -80,
    left: SCREEN_WIDTH * 0.3,
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 80,
  },
  decorLines: {
    ...StyleSheet.absoluteFillObject,
  },
  decorLine: {
    position: 'absolute',
    top: 60,
    bottom: 140,
    width: 0.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  textContainer: {
    paddingHorizontal: DS.spacing.xl,
    paddingBottom: 80,
  },
  tag: {
    alignSelf: 'flex-start',
    borderWidth: 0.75,
    borderRadius: DS.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  tagText: {
    fontSize: scaleFont(9),
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  title: {
    fontSize: scaleFont(68),
    fontWeight: '900',
    color: DS.text,
    lineHeight: scaleFont(64),
    letterSpacing: -2,
    textTransform: 'uppercase',
  },
  titleDivider: {
    width: 32,
    height: 2,
    marginTop: 18,
    marginBottom: 16,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: scaleFont(15),
    fontWeight: '300',
    color: DS.textDim,
    lineHeight: scaleFont(22),
    letterSpacing: 0.3,
    marginBottom: 28,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 0.75,
    borderRadius: DS.radius.xl,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  ctaText: {
    fontSize: scaleFont(12),
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bgNumber: {
    position: 'absolute',
    right: -12,
    bottom: 60,
    fontSize: scaleFont(200),
    fontWeight: '900',
    color: 'rgba(255,255,255,0.025)',
    lineHeight: scaleFont(190),
    letterSpacing: -8,
  },
  indicators: {
    position: 'absolute',
    bottom: 28,
    right: DS.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 32,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});