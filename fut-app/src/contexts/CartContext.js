import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);

const CART_STORAGE_KEY = '@fut_app/cart';

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
  const precoFinal = normalizePrice(
    product.preco_final ??
    product.precoFinal ??
    product.preco ??
    product.price
  );
  const precoOriginal = normalizePrice(
    product.preco_original ??
    product.precoOriginal ??
    product.precoAntigo ??
    product.oldPrice ??
    product.preco ??
    product.price
  );
  const economia = normalizePrice(
    product.economia_total ??
    product.economia ??
    product.economiaDisplay ??
    0
  );
  const descontoPercent = normalizePrice(product.desconto_percent ?? product.descontoPercent ?? 0);

  return {
    id: String(product.id ?? ''),
    nome: product.nome ?? product.title ?? product.name ?? 'Produto',
    imagem: product.imagem ?? product.image ?? null,
    image: product.image ?? product.imagem ?? null,
    preco: precoFinal,
    price: precoFinal,
    precoOriginal,
    preco_original: precoOriginal,
    precoFinal,
    preco_final: precoFinal,
    economia,
    economia_total: economia,
    descontoPercent,
    desconto_percent: descontoPercent,
    beneficios_plano: product.beneficios_plano ?? product.beneficiosPlano ?? [],
    plano_atual: product.plano_atual ?? product.planoAtual ?? null,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);

        if (!mounted) {
          return;
        }

        if (storedCart) {
          const parsed = JSON.parse(storedCart);

          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch {
        // Ignora falhas de leitura local para não travar a inicialização.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch {
        // Ignora falhas de escrita local para não travar o fluxo.
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [cartItems, loading]);

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
    loading,
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
  }), [addItem, cartItems, clearCart, loading, removeItem, subtotal, totalItems, updateQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
