import { StyleSheet } from 'react-native';
import { scaleFont } from '../../utils/fontScale';
import { colors } from '../../data/dataCadastro';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: { height: 200, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  escudoHeader: { position: 'absolute', width: 250, height: 250, opacity: 0.12, right: -40, top: -30, transform: [{ rotate: '-15deg' }] },
  headerContent: { zIndex: 2, paddingHorizontal: 40, alignItems: 'center' },
  back: { position: 'absolute', left: 20, top: 20, zIndex: 10, width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: scaleFont(22), color: colors.white },
  headerTitle: { color: colors.white, fontSize: scaleFont(16), fontWeight: '700', textAlign: 'center', letterSpacing: 1 },
  headerSubtitle: { color: '#FFDEDE', fontSize: scaleFont(16), marginTop: 8, textAlign: 'center', opacity: 0.8 },
  card: { flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 30, paddingHorizontal: 30, marginTop: -30, zIndex: 5 },
  formTitle: { fontSize: scaleFont(26), fontWeight: '700', color: colors.primary, marginBottom: 20, textAlign: 'center' },
  formContent: { width: '100%' },
  label: { fontSize: scaleFont(12), fontWeight: '700', color: colors.text, marginBottom: 5, marginLeft: 4, opacity: 0.7 },
  spacing: { marginTop: 12 },
  inputStyle: { backgroundColor: colors.cardBackground, borderRadius: 12, height: 50 },
  iconContainer: { paddingRight: 15, justifyContent: 'center' },
  checkIcon: { color: 'green', fontWeight: '700', fontSize: scaleFont(18) },
  acceptRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.primary, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  checkIconSmall: { fontSize: scaleFont(12), color: colors.white, fontWeight: '700' },
  acceptText: { color: '#333', fontSize: scaleFont(13), fontWeight: '500' },
  buttonWrap: { marginTop: 30 },
  glassButton: { backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 35, height: 60, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.8)', shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 3 },
  glassButtonText: { color: '#181818', fontWeight: '750', fontSize: scaleFont(18), letterSpacing: 1.5 },
  footerTouchable: { marginTop: 4, paddingVertical: 15, alignItems: 'center' },
  footerText: { color: colors.text, fontSize: scaleFont(14) },
  link: { color: colors.primary, fontWeight: 'bold' },
});

export default styles;
