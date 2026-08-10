import { parseValue } from './parseValueService';

export const calculateTotal = (ingressos, quantities) => {
  return ingressos.reduce((sum, item) => {
    const qtd = quantities[item.id] || 0;
    const rawPrice = item.preco ?? item.valor ?? 0;
    const price = typeof rawPrice === 'number' ? rawPrice : parseValue(rawPrice);
    return sum + (Number.isFinite(price) ? price : 0) * qtd;
  }, 0);
};