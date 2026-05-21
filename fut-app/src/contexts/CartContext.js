import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    // For now, we'll use local state. In a real app, you'd load from AsyncStorage
    // const loadCart = async () => {
    //   try {
    //     const savedCart = await AsyncStorage.getItem('cart');
    //     if (savedCart) {
    //       setCartItems(JSON.parse(savedCart));
    //     }
    //   } catch (error) {
    //     console.error('Error loading cart:', error);
    //   }
    // };
    // loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    // const saveCart = async () => {
    //   try {
    //     await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    //   } catch (error) {
    //     console.error('Error saving cart:', error);
    //   }
    // };
    // saveCart();
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item =>
        item.id === product.id && item.tamanho === product.tamanho
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.tamanho === product.tamanho
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, tamanho) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === productId && item.tamanho === tamanho))
    );
  };

  const updateQuantity = (productId, tamanho, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, tamanho);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.tamanho === tamanho
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartTotal,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};