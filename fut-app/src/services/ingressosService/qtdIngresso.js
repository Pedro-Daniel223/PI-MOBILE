export const decrease = (quantities, setQuantities, id) => {
  const current = quantities[id] || 0;
  if (current > 0) { setQuantities({ ...quantities, [id]: current - 1 }); }
};

export const increase = (quantities, setQuantities, id) => {
  const current = quantities[id] || 0;
  if (current < 10) { setQuantities({ ...quantities, [id]: current + 1 }); }
};