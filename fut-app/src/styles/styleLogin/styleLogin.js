import { StyleSheet } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

export const stylesLogin = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  scrollGrow: {
    flexGrow: 1,
  },
  header: {
    height: 220,
    backgroundColor: '#880000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  escudoHeader: {
    position: 'absolute',
    width: 250,
    height: 250,
    opacity: 0.15,
    right: -50,
    top: -20,
    transform: [{ rotate: '-15deg' }],
  },
  headerContent: {
    zIndex: 2,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#FFDEDE',
    fontSize: scaleFont(14),
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 30,
    marginTop: -40,
    zIndex: 10,
  },
  formTitle: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    color: '#880000',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContent: {
    width: '100%',
  },
  label: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.8,
  },
  inputStyle: {
    backgroundColor: '#E9E9E9',
    borderRadius: 12,
    height: 55,
  },
  passwordLabel: {
    marginTop: 18,
  },
  iconContainer: {
    paddingRight: 15,
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#2E8B57',
    fontWeight: 'bold',
    fontSize: scaleFont(18),
  },
  eyeIcon: {
    fontSize: scaleFont(18), 
    opacity: 0.6,
  },
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  redefineBtn: {
    marginLeft: 5,
  },
  forgotText: {
    fontSize: scaleFont(14),
    color: '#000000',
  },
  linkBold: {
    color: '#880000',
    fontWeight: 'bold',
  },
  buttonWrap: {
    marginTop: 35,
    width: '100%',
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 35,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonTitle: {
    color: '#181818',
    fontWeight: '700',
    fontSize: scaleFont(18),
    letterSpacing: 1.5,
  },
  footerContainer: {
    marginTop: 20,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: scaleFont(14),
  },
  iconEye: {
    color: '#880000',
    fontSize: scaleFont(18),
  },
  biometricBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  biometricText: {
    color: '#880000',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inlineIconText: {
    fontSize: scaleFont(18),
  }
});
