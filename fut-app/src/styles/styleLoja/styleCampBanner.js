import { StyleSheet } from 'react-native';
import { DS } from './root';
import { SCREEN_WIDTH, SCREEN_HEIGHT, CAMPAIGN_HEIGHT, CAMPAIGN_WIDTH } from './dimensoes';


export const campStyles = StyleSheet.create({
  outer: {
    marginHorizontal: DS.spacing.lg,
    marginTop: 28,
    marginBottom: 8,
  },
  glowLayer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    height: CAMPAIGN_HEIGHT,
    borderRadius: DS.radius.lg,
    backgroundColor: DS.accent,
    opacity: 0.12,
    shadowColor: DS.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DS.spacing.xl,
  },
  campaignTag: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: DS.accent,
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: DS.text,
    lineHeight: 38,
    letterSpacing: -1.5,
  },
  campaignSub: {
    fontSize: 10,
    color: DS.textDim,
    letterSpacing: 0.5,
    marginTop: 8,
    fontWeight: '400',
  },
  campaignCta: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bgMark: {
    position: 'absolute',
    right: -8,
    bottom: -18,
    fontSize: 88,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.04)',
    letterSpacing: -3,
  },
});