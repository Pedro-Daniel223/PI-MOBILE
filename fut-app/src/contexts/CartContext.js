import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const normalizeSize = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized ? normalized.toUpperCase() : null;
};

const normalizeQuantity = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

const normalizePrice = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getItemKey = (itemId, tamanho) => {
  const sizeKey = normalizeSize(tamanho) ?? '__no-size__';
  return `${String(itemId)}::${sizeKey}`;
};

const normalizeCartItem = (product = {}) => {
  const tamanho = normalizeSize(product.tamanho);
  const quantity = normalizeQuantity(product.quantity ?? product.quantidade);
  const preco = normalizePrice(product.preco ?? product.price);

  return {
    id: String(product.id ?? ''),
    nome: product.nome ?? product.title ?? product.name ?? 'Produto',
    imagem: product.imagem ?? product.image ?? null,
    image: product.image ?? product.imagem ?? null,
    preco,
    price: preco,
    quantity,
    ...(tamanho ? { tamanho } : {}),
    imagens: product.imagens ?? product.images ?? [],
    images: product.images ?? product.imagens ?? [],
    categoria: product.categoria ?? product.category ?? product.cat ?? null,
  };
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItem = useCallback((product) => {
    const nextItem = normalizeCartItem(product);
    const nextKey = getItemKey(nextItem.id, nextItem.tamanho);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => getItemKey(item.id, item.tamanho) === nextKey
      );

      if (existingIndex >= 0) {
        const existingItem = prevItems[existingIndex];
        const updatedQuantity = existingItem.quantity + nextItem.quantity;

        return prevItems.map((item, index) => (
          index === existingIndex
            ? { ...item, quantity: updatedQuantity }
            : item
        ));
      }

      return [...prevItems, { ...nextItem, quantity: nextItem.quantity }];
    });
  }, []);

  const removeItem = useCallback((productId, tamanho) => {
    const keyToRemove = getItemKey(productId, tamanho);

    setCartItems((prevItems) => (
      prevItems.filter((item) => getItemKey(item.id, item.tamanho) !== keyToRemove)
    ));
  }, []);

  const updateQuantity = useCallback((productId, tamanho, quantity) => {
    const parsedQuantity = Number(quantity);
    const keyToUpdate = getItemKey(productId, tamanho);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      removeItem(productId, tamanho);
      return;
    }

    const nextQuantity = Math.floor(parsedQuantity);

    setCartItems((prevItems) => (
      prevItems.map((item) => (
        getItemKey(item.id, item.tamanho) === keyToUpdate
          ? { ...item, quantity: nextQuantity }
          : item
      ))
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + normalizeQuantity(item.quantity), 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce(
      (total, item) => total + normalizePrice(item.preco ?? item.price) * normalizeQuantity(item.quantity),
      0
    ),
    [cartItems]
  );

  const value = useMemo(() => ({
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    addToCart: addItem,
    removeFromCart: removeItem,
    getCartCount: () => totalItems,
    getCartTotal: () => subtotal,
  }), [addItem, cartItems, clearCart, removeItem, subtotal, totalItems, updateQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
