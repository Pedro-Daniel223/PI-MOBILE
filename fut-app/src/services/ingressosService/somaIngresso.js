import { parseValue } from './parseValueService';

export const calculateTotal = (ingressos, quantities) => {
  return ingressos.reduce((sum, item) => {
    const qtd = quantities[item.id] || 0;
    return sum + parseValue(item.valor) * qtd;
  }, 0);
};