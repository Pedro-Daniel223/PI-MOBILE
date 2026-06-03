import { StyleSheet } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

export const stylesSplash = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0f0f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerWrap: {
    position: 'absolute',
    width: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  animatedText: {
    position: 'absolute',
    left: 100,
    color: '#fff',
    fontSize: scaleFont(22),
    fontWeight: 'bold',
  },
  logo: {
    width: 120,
    height: 120,
  }
});
