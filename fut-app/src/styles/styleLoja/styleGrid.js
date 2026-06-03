import { StyleSheet } from 'react-native';
import { DS } from './root';

// Estilos para o grid de produtos na Loja do FUT
export const gridStyles = StyleSheet.create({
  container: {
    paddingHorizontal: DS.spacing.lg,
    marginTop: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
