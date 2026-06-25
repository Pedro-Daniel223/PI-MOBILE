import { StyleSheet } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

export const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 20,
    justifyContent: 'space-between',
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 50,
    borderRadius: 22,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
  },

  statusTitle: {
    color: '#fff',
    fontSize: scaleFont(12),
    opacity: 0.7,
  },

  statusText: {
    color: '#fff',
    fontWeight: '700',
  },

  welcome: {
    marginTop: 20,
    marginBottom: 20,
  },

  welcomeText: {
    color: '#fff',
    fontSize: scaleFont(24),
    fontWeight: '600',
  },

  nameText: {
    color: '#fff',
    fontSize: scaleFont(20),
  },

  subText: {
    color: '#fff',
    opacity: 0.7,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    width: '93%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },

  bigCard: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  cardTitle: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginTop: 10,
  },

  cardDesc: {
    color: '#fff',
    fontSize: scaleFont(12),
    opacity: 0.7,
    marginTop: 5,
  },
  btnBemVindo: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#880000',
    padding: 16,
    width: '80%',
    borderRadius: 8
  },
  textoBtn:{
    color: '#fff'
  },

  button: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: scaleFont(12),
  },

  cardImage: {
    width: 100,
    height: 70,
  },

  middleGlow: {
    position: 'absolute',
    width: 2,
    height: '90%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    left: '50%',
    shadowColor: '#fff',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },

  sectionHeader: {
    marginBottom: 12,
    marginTop: 20,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontWeight: '800',
  },

  sectionLine: {
    marginTop: 6,
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ff2b2b',
    shadowColor: '#ff2b2b',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },

  productWrapper: {
    width: 280,
  }
});
